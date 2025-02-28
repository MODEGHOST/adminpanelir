import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function Admindocone() {
  const [docReads, setDocReads] = useState([]);
  const [formData, setFormData] = useState({ title: "", title_en: "", date: "", qrCode: "" });
  const [file, setFile] = useState(null); // สำหรับอัปโหลดไฟล์
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState(""); // สำหรับค้นหาข้อมูลตามวันที่
  const [isAdmin, setIsAdmin] = useState(true); // ตัวแปรสำหรับกำหนดสิทธิ์การแสดงปุ่ม
  const [showForm, setShowForm] = useState(false); // สถานะสำหรับเปิด-ปิดฟอร์ม
  const [fileEn, setFileEn] = useState(null);
  const [fileNameEn, setFileNameEn] = useState("");


  useEffect(() => {
    fetchDocReads();
  }, []);

  const fetchDocReads = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_KEY}/api/doc_read`);
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
    data.append("title_en", formData.title_en);  // ✅ เพิ่ม title_en
if (fileEn) data.append("file_path_en", fileEn);  // ✅ เพิ่ม file_path_en


    try {
      if (editId) {
        // หากเป็นการอัปเดต
        await axios.post( `${import.meta.env.VITE_API_KEY}/api/doc_read/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // หากเป็นการเพิ่มข้อมูล
        await axios.post( `${import.meta.env.VITE_API_KEY}/api/doc_read`, data, {
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
        await axios.delete( `${import.meta.env.VITE_API_KEY}/api/doc_read/${id}`);
        fetchDocReads();
      } catch (error) {
        console.error("Error deleting doc_read:", error);
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      // ส่งคำขอ GET เพื่อดึงข้อมูลเอกสารตาม ID
      const response = await axios.get(`${import.meta.env.VITE_API_KEY}/api/doc_read/${id}`);

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
    setFormData({ 
      title: docRead.title, 
      title_en: docRead.title_en || "", // ✅ โหลดค่า title_en
      date: docRead.date, 
      qrCode: docRead.qr_code_path,
    });
    setFileNameEn(docRead.file_path_en || ""); // ✅ โหลดค่า file_path_en
    
  };

  const resetForm = () => {
    setFormData({ title: "", date: "", qrCode: "" });
    setFile(null);
    setEditId(null);
    setShowForm(false); // ปิดฟอร์มเมื่อยกเลิก
    setFormData({ title: "", title_en: "", date: "", qrCode: "" });
setFileEn(null);
setFileNameEn("");

  };

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;

  return (
    <div className="container py-5" style={{ marginRight: "10%", marginTop: "1%" }}>
      <h1 className="text-center mb-4">จัดการแบบ 56-1 Report</h1>

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
              ชื่อเอกสาร(TH)
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
  <label htmlFor="title_en" className="form-label">ชื่อเอกสาร(EN)</label>
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
              ไฟล์ PDF(TH)
            </label>
            <input
              type="file"
              id="file"
              accept="application/pdf"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="mb-3">
  <label>ไฟล์ PDF(EN)</label>
  <div className="custom-file">
    <label htmlFor="file_path_en" className="custom-file-label btn btn-primary">
      <i className="fa fa-upload"></i> อัปโหลดไฟล์
    </label>
    <input
      type="file"
      id="file_path_en"
      className="custom-file-input"
      accept="application/pdf"
      onChange={(e) => {
        setFileEn(e.target.files[0]);
        setFileNameEn(e.target.files[0]?.name || "");
      }}
      style={{ display: "none" }}
    />
  </div>
  {fileNameEn && <p className="mt-2">ไฟล์ที่เลือก: {fileNameEn}</p>}
</div>

          <div className="mb-3">
            <label htmlFor="qrCode" className="form-label">
              Generation QR Code
            </label>
            <div className="d-flex align-items-center">
              {formData.qrCode && (
                <img
                  src={`${import.meta.env.VITE_QR_KEY}/uploads/images/${formData.qrCode}`}
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
            <th style={{ width: '30px' }}>#</th>
            <th style={{ width: '100px' }}>ชื่อเอกสาร(TH)</th>
            <th style={{ width: '100px' }}>ชื่อเอกสาร(EN)</th>
            <th style={{ width: '50px' }}>ไฟล์เอกสาร(TH)</th>
            <th style={{ width: '50px' }}>ไฟล์เอกสาร(EN)</th>
            <th style={{ width: '50px' }}>QR Code เอกสาร</th>
            <th style={{ width: '100px' }}>วันที่</th>
            {isAdmin && <th style={{ width: '100px' }}>การจัดการ</th>}
          </tr>
        </thead>
        <tbody>
          {docReads.map((docRead, index) => (
            <tr key={docRead.id}>
              <td>{index + 1}</td>
              <td>{docRead.title}</td>
              <td>{docRead.title_en}</td>
              <td>
                <a
                  href={`${import.meta.env.VITE_PDF_KEY}/uploads/pdf_files/${docRead.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                <img
                        src="/public/assets/img/pdf.png"
                        alt="ดาวน์โหลด"
                        style={{ width: '70px', height: '70px' }}
                      />
                </a>
              </td>
              <td>
                <a
                  href={`${import.meta.env.VITE_PDF_KEY}/uploads/pdf_files/${docRead.file_path_en}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                <img
                        src="/public/assets/img/pdf.png"
                        alt="ดาวน์โหลด"
                        style={{ width: '70px', height: '70px' }}
                      />
                </a>
              </td>
              <td>
                {docRead.qr_code_path ? (
                  <img
                    src={`${import.meta.env.VITE_QR_KEY}/uploads/images/${docRead.qr_code_path}`}
                    alt="QR Code"
                    style={{width: '70px', height: '70px' }}
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
