import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

function Adminmeetinguser() {
  const [meetinguser, setMeetinguser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: "" });
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMeetinguser();
  }, []);

  const fetchMeetinguser = () => {
    axios
      .get(`${import.meta.env.VITE_API_KEY}/api/meetinguser`)
      .then((response) => {
        setMeetinguser(response.data);
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

    try {
      let response;
      if (editId) {
        response = await axios.post(
          `http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/meetinguser/${editId}`,
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
          "http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/meetinguser",
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'เพิ่มข้อมูลสำเร็จ',
        });
      }

      fetchMeetinguser();
      resetForm();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
      });
    }
  };

  const handleEdit = (id) => {
    const meetinguserToEdit = meetinguser.find((item) => item.id === id);
    if (meetinguserToEdit) {
      setFormData({ title: meetinguserToEdit.title });
      setPdfFileName(meetinguserToEdit.pdf_file || "");
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
          .delete(`http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/meetinguser/${id}`)
          .then(() => {
            fetchMeetinguser();
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
    setFormData({ title: "" });
    setPdfFile(null);
    setPdfFileName("");
    setEditId(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container py-5" style={{ marginRight: "10%", marginTop: "1%" }}>
      <h1 className="text-center mb-4">จัดหารประชุมผู้ถือหุ้น</h1>

      <div className="d-flex justify-content-end mb-4">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "ปิดฟอร์ม" : "เพิ่มรายงาน"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label>หัวข้อรายงาน</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ title: e.target.value })}
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

          <button type="submit" className="btn btn-success">
            {editId ? "บันทึกการแก้ไข" : "เพิ่มรายงาน"}
          </button>
        </form>
      )}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>หัวข้อ</th>
            <th>ไฟล์ PDF</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {meetinguser.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>
                <a
                  href={`http://129.200.6.52/laravel_auth_jwt_api_omd/storage/app/public/uploads/pdf_files/${item.pdf_file}`}
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

export default Adminmeetinguser;
