import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'; // Import SweetAlert2

function Adminreportmuser() {
  const [reportmuser, setReportmuser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: "", title_en: "" }); // เพิ่ม title_en
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [pdfFileEn, setPdfFileEn] = useState(null); // สำหรับไฟล์ PDF ภาษาอังกฤษ
const [pdfFileNameEn, setPdfFileNameEn] = useState(""); // สำหรับแสดงชื่อไฟล์ PDF ภาษาอังกฤษ



  useEffect(() => {
    fetchReportmuser();
  }, []);

  const fetchReportmuser = () => {
    axios
      .get(`${import.meta.env.VITE_API_KEY}/api/reportmtuser`)
      .then((response) => {
        setReportmuser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("ไม่สามารถโหลดข้อมูลได้");
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pdfFile && pdfFile.type !== "application/pdf") {
      Swal.fire({
        icon: 'error',
        title: 'ไฟล์ไม่ถูกต้อง',
        text: 'กรุณาเลือกไฟล์ PDF เท่านั้น',
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    if (pdfFile) formDataToSend.append("pdf_file", pdfFile);
    formDataToSend.append("title_en", formData.title_en); // เพิ่ม title_en
if (pdfFileEn) formDataToSend.append("pdf_file_en", pdfFileEn); // เพิ่ม pdf_file_en


    try {
      let response;
      if (editId) {
        response = await axios.post(
          `${import.meta.env.VITE_API_KEY}/api/reportmtuser/${editId}`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'แก้ไขข้อมูลสำเร็จ',
        });
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_KEY}/api/reportmtuser`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'เพิ่มข้อมูลสำเร็จ',
        });
      }

      fetchReportmuser();
      resetForm();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้',
      });
    }
  };

  const handleEdit = (id) => {
    const reportToEdit = reportmuser.find((item) => item.id === id);
    if (reportToEdit) {
      setFormData({ 
        title: reportToEdit.title, 
        title_en: reportToEdit.title_en || ""  // ✅ โหลดค่า title_en 
      });
      setPdfFileName(reportToEdit.pdf_file || "");
      setPdfFileNameEn(reportToEdit.pdf_file_en || "");  // ✅ โหลดค่า pdf_file_en
      setEditId(id);
      setShowForm(true);
    }
  };
  

  const handleDelete = (id) => {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบข้อมูลนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_API_KEY}/api/reportmtuser/${id}`)
          .then(() => {
            fetchReportmuser();
            Swal.fire('ลบสำเร็จ!', 'ข้อมูลได้ถูกลบแล้ว.', 'success');
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาด',
              text: 'ไม่สามารถลบข้อมูลได้',
            });
          });
      }
    });
  };

  const resetForm = () => {
    setFormData({ title: "", title_en: "" });  // ✅ รีเซ็ต title_en
    setPdfFile(null);
    setPdfFileName("");
    setPdfFileEn(null);  // ✅ รีเซ็ต pdf_file_en
    setPdfFileNameEn("");
    setEditId(null);
    setShowForm(false);
  };
  

  if (loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container py-5" style={{ marginRight: "10%", marginTop: "1%" }}>
      <h1 className="text-center mb-4">จัดการรายงานการประชุม</h1>

      <div className="d-flex justify-content-end mb-4">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "ปิดฟอร์ม" : "เพิ่มรายงาน"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label>หัวข้อรายงาน (TH)</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ title: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
  <label htmlFor="title_en" className="form-label">หัวข้อรายงาน (EN)</label>
  <input
    type="text"
    id="title_en"
    className="form-control"
    value={formData.title_en}
    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
    required
  />
</div>

          <div className="mb-3">
            <label>ไฟล์ PDF</label>
            <div className="custom-file">
              <label htmlFor="pdf_file" className="custom-file-label btn btn-primary">
                <i className="fa fa-upload"></i> อัปโหลดไฟล์
              </label>
              <input
                type="file"
                id="pdf_file"
                className="custom-file-input"
                accept="application/pdf"
                onChange={(e) => {
                  setPdfFile(e.target.files[0]);
                  setPdfFileName(e.target.files[0]?.name || "");
                }}
                style={{ display: 'none' }}
              />
            </div>
            {pdfFileName && <p className="mt-2">ไฟล์ที่เลือก: {pdfFileName}</p>}
          </div>
          <div className="mb-3">
  <label>ไฟล์ PDF (English)</label>
  <div className="custom-file">
    <label htmlFor="pdf_file_en" className="custom-file-label btn btn-primary">
      <i className="fa fa-upload"></i> อัปโหลดไฟล์
    </label>
    <input
      type="file"
      id="pdf_file_en"
      className="custom-file-input"
      accept="application/pdf"
      onChange={(e) => {
        setPdfFileEn(e.target.files[0]);
        setPdfFileNameEn(e.target.files[0]?.name || "");
      }}
      style={{ display: "none" }}
    />
  </div>
  {pdfFileNameEn && <p className="mt-2">ไฟล์ที่เลือก: {pdfFileNameEn}</p>}
</div>

          <button type="submit" className="btn btn-success">
            {editId ? "บันทึกการแก้ไข" : "เพิ่มรายงาน"}
          </button>
        </form>
      )}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>หัวข้อ(TH)</th>
            <th>หัวข้อ(EN)</th>
            <th>ไฟล์ PDF(TH)</th>
            <th>ไฟล์ PDF(EN)</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {reportmuser.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>{item.title_en}</td>
              <td>
                <a
                  href={`${import.meta.env.VITE_PDF_KEY}/uploads/pdf_files/${item.pdf_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/public/assets/img/pdf.png"
                    alt="ดาวน์โหลด"
                    style={{ width: '100px', height: '100px' }}
                  />
                </a>
              </td>
              <td>
                <a
                  href={`${import.meta.env.VITE_PDF_KEY}/uploads/pdf_files/${item.pdf_file_en}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/public/assets/img/pdf.png"
                    alt="ดาวน์โหลด"
                    style={{ width: '100px', height: '100px' }}
                  />
                </a>
              </td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item.id)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Adminreportmuser;
