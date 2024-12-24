import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function Admindocone() {
  const [docReads, setDocReads] = useState([]);
  const [formData, setFormData] = useState({ title: "", date: "", qrCode: "" });
  const [file, setFile] = useState(null); // สำหรับอัปโหลดไฟล์
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState(""); // สำหรับค้นหาข้อมูลตามวันที่
  const [isAdmin, setIsAdmin] = useState(true); // ตัวแปรสำหรับกำหนดสิทธิ์การแสดงปุ่ม
  const [showForm, setShowForm] = useState(false); // สถานะสำหรับเปิด-ปิดฟอร์ม

  useEffect(() => {
    fetchDocReads();
  }, []);

  const fetchDocReads = async () => {
    try {
      const response = await axios.get("http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/doc_read");
      setDocReads(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doc_reads:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("date", formData.date); // เพิ่ม date
    if (file) data.append("file", file);

    try {
      if (editId) {
        // หากเป็นการอัปเดต
        await axios.post(`http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/doc_read/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // หากเป็นการเพิ่มข้อมูล
        await axios.post("http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/doc_read", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchDocReads();
      resetForm();
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
        alert("Validation Error: " + JSON.stringify(error.response.data));
      } else {
        console.error("Error submitting data:", error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?")) {
      try {
        await axios.delete(`http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/doc_read/${id}`);
        fetchDocReads();
      } catch (error) {
        console.error("Error deleting doc_read:", error);
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      // ส่งคำขอ GET เพื่อดึงข้อมูลเอกสารตาม ID
      const response = await axios.get(`http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/doc_read/${id}`);

      const docRead = response.data;
      setFormData({
        title: docRead.title,
        date: docRead.date, // โหลด date จากฐานข้อมูล
        qrCode: docRead.qr_code_path,
      });
      setEditId(docRead.id);
      setShowForm(true); // แสดงฟอร์มแก้ไข
    } catch (error) {
      console.error("Error fetching document for edit:", error);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", date: "", qrCode: "" });
    setFile(null);
    setEditId(null);
    setShowForm(false); // ปิดฟอร์มเมื่อยกเลิก
  };

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;

  return (
    <div className="container py-5" style={{ marginRight: "10%", marginTop: "1%" }}>
      <h1 className="text-center mb-4">จัดการเอกสาร One-Port</h1>

      {/* ค้นหาข้อมูลตามวันที่ */}
      <div className="mb-3 d-flex justify-content-between">
        <div>
          <input
            type="date"
            className="form-control"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
        {/* ปุ่มเพิ่มข้อมูล */}
        {isAdmin && (
          <div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) resetForm(); // รีเซ็ตฟอร์มเมื่อกดปิด
              }}
            >
              {showForm ? "ปิดฟอร์ม" : "เพิ่มข้อมูล"}
            </button>
          </div>
        )}
      </div>

      {/* ฟอร์มเพิ่ม/แก้ไขข้อมูล */}
      {isAdmin && showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              ชื่อเอกสาร
            </label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              วันที่
            </label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="file" className="form-label">
              ไฟล์ PDF
            </label>
            <input
              type="file"
              id="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="qrCode" className="form-label">
              Generation QR Code
            </label>
            <div className="d-flex align-items-center">
              {formData.qrCode && (
                <img
                  src={`http://129.200.6.52/laravel_auth_jwt_api_omd/public/storage/${formData.qrCode}`}
                  alt="Generated QR Code"
                  style={{ width: "100px", height: "100px" }}
                />
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            {editId ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล"}
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={resetForm}
          >
            ยกเลิก
          </button>
        </form>
      )}

      {/* ตารางแสดงข้อมูล */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อเอกสาร</th>
            <th>ไฟล์เอกสาร</th>
            <th>QR Code เอกสาร</th>
            <th>วันที่</th>
            {isAdmin && <th>การจัดการ</th>}
          </tr>
        </thead>
        <tbody>
          {docReads.map((docRead, index) => (
            <tr key={docRead.id}>
              <td>{index + 1}</td>
              <td>{docRead.title}</td>
              <td>
                <a
                  href={`http://129.200.6.52/laravel_auth_jwt_api_omd/public/storage/${docRead.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ดาวน์โหลด
                </a>
              </td>
              <td>
                {docRead.qr_code_path ? (
                  <img
                    src={`http://129.200.6.52/laravel_auth_jwt_api_omd/public/storage/${docRead.qr_code_path}`}
                    alt="QR Code"
                    style={{ width: "100px", height: "100px" }}
                  />
                ) : (
                  "ไม่มี QR Code"
                )}
              </td>
              <td>{docRead.date || "N/A"}</td>
              {isAdmin && (
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(docRead.id)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(docRead.id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="me-1" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admindocone;
