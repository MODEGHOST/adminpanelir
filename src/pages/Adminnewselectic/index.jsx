import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

function AdminNewselectic() {
  const [data, setData] = useState([]); // เก็บข้อมูล newselectic
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: "", date: "", posted_day: "" , title_en: "" });
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
const [pdfFileEn, setPdfFileEn] = useState(null);
const [pdfFileNameEn, setPdfFileNameEn] = useState("");


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(`${import.meta.env.VITE_API_KEY}/api/newselectic`) // ดึงข้อมูลจาก newselectic
      .then((response) => {
        setData(response.data);
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
        icon: "error",
        title: "ไฟล์ไม่ถูกต้อง",
        text: "กรุณาเลือกไฟล์ PDF เท่านั้น",
      });
      return;
    }

    if (pdfFile && pdfFile.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "ไฟล์ใหญ่เกินไป",
        text: "ขนาดไฟล์ต้องไม่เกิน 5 MB",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("posted_day", formData.posted_day); // เพิ่ม posted_day
    if (pdfFile) formDataToSend.append("pdf_file", pdfFile);
    formDataToSend.append("title_en", formData.title_en);  // ✅ เพิ่ม title_en
if (pdfFileEn) formDataToSend.append("pdf_file_en", pdfFileEn);  // ✅ เพิ่ม pdf_file_en


    try {
      let response;
      if (editId) {
        response = await axios.post(
          `${import.meta.env.VITE_API_KEY}/api/newselectic/${editId}`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "แก้ไขข้อมูลสำเร็จ",
        });
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_KEY}/api/newselectic`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "เพิ่มข้อมูลสำเร็จ",
        });
      }

      fetchData();
      resetForm();
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: JSON.stringify(error.response.data.errors),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: error.message,
        });
      }
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    if (itemToEdit) {
      setFormData({
        title: itemToEdit.title,
        date: itemToEdit.date,
        posted_day: itemToEdit.posted_day, // เพิ่ม posted_day
      });
      setPdfFileName(itemToEdit.pdf_url || "");
      setEditId(id);
      setShowForm(true);
      setFormData({ 
        title: itemToEdit.title, 
        title_en: itemToEdit.title_en || "", // ✅ โหลดค่า title_en
        date: itemToEdit.date, 
        posted_day: itemToEdit.posted_day 
      });
      setPdfFileNameEn(itemToEdit.pdf_url_en || ""); // ✅ โหลดค่า pdf_file_en      
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบข้อมูลนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบเลย!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_API_KEY}/api/newselectic/${id}`)
          .then(() => {
            fetchData(); // ดึงข้อมูลใหม่หลังลบสำเร็จ
            Swal.fire("ลบสำเร็จ!", "ข้อมูลได้ถูกลบแล้ว.", "success");
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: "ไม่สามารถลบข้อมูลได้",
            });
          });
      }
    });
  };
  

  const resetForm = () => {
    setFormData({ title: "", date: "", posted_day: "" });
    setPdfFile(null);
    setPdfFileName("");
    setEditId(null);
    setShowForm(false);
    setFormData({ title: "", title_en: "", date: "", posted_day: "" });
setPdfFileEn(null);
setPdfFileNameEn("");

  };

  if (loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container py-5" style={{ marginRight: "10%", marginTop: "1%" }}>
      <h1 className="text-center mb-4">จัดการข่าวแจ้งตลาดหลักทรัพย์</h1>

      <div className="d-flex justify-content-end mb-4">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "ปิดฟอร์ม" : "เพิ่มข้อมูล"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">หัวข้อข่าว(TH)</label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
  <label htmlFor="title_en" className="form-label">หัวข้อข่าว(EN)</label>
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
                <label htmlFor="date" className="form-label">วันที่</label>
                <input
                  type="date"
                  id="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="posted_day" className="form-label">วันที่เผยแพร่</label>
                <input
                  type="text"
                  id="posted_day"
                  className="form-control"
                  value={formData.posted_day}
                  onChange={(e) => setFormData({ ...formData, posted_day: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label>ไฟล์ PDF (TH)</label>
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
                    style={{ display: "none" }}
                  />
                </div>
                {pdfFileName && <p className="mt-2">ไฟล์ที่เลือก: {pdfFileName}</p>}
              </div>
              <div className="mb-3">
  <label>ไฟล์ PDF (EN)</label>
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
                {editId ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={resetForm}
                >
                  ยกเลิก
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>หัวข้อข่าว(TH)</th>
                <th>หัวข้อข่าว(EN)</th>
                <th style={{ width: "100px" }}>ไฟล์ PDF(TH)</th>
                <th style={{ width: "100px" }}>ไฟล์ PDF(EN)</th>
                <th>วันที่</th>
                <th>วันที่เผยแพร่</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.title_en}</td>
                  <td>
                    <a
                      href={`${import.meta.env.VITE_PDF_KEY}/uploads/pdf_files/${item.pdf_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/public/assets/img/pdf.png"
                        alt="ดาวน์โหลด"
                        style={{ width: "70px", height: "70px" }}
                      />
                    </a>
                  </td>
                  <td>
                    <a
                      href={`${import.meta.env.VITE_PDF_KEY}/uploads/pdf_files/${item.pdf_url_en}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/public/assets/img/pdf.png"
                        alt="ดาวน์โหลด"
                        style={{ width: "70px", height: "70px" }}
                      />
                    </a>
                  </td>
                  <td>{item.date}</td>
                  <td>{item.posted_day}</td> {/* แสดงเป็นข้อความ */}
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
      </div>
    </div>
  );
}

export default AdminNewselectic;
