import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function Adminreportmuser() {
  const [reportmuser, setReportmuser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: "" });
  const [pdfFile, setPdfFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReportmuser();
  }, []);

  const fetchReportmuser = () => {
    axios
      .get("http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/reportmtuser")
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

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    if (pdfFile) formDataToSend.append("pdf_file", pdfFile);

    try {
      let response;
      if (editId) {
        response = await axios.post(
          `http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/reportmtuser/${editId}`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post(
          "http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/reportmtuser",
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      console.log(response.data);
      fetchReportmuser();
      resetForm();
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleEdit = (id) => {
    const reportToEdit = reportmuser.find((item) => item.id === id);
    if (reportToEdit) {
      setFormData({ title: reportToEdit.title });
      setEditId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?")) {
      axios
        .delete(`http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/reportmtuser/${id}`)
        .then(() => fetchReportmuser())
        .catch((error) => console.error("Error deleting data:", error));
    }
  };

  const resetForm = () => {
    setFormData({ title: "" });
    setPdfFile(null);
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
              onChange={(e) => setPdfFile(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </div>
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
          {reportmuser.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td style={{ width: "100px", height: "100px" }}>
                    <a
                      href={`http://129.200.6.52/laravel_auth_jwt_api_omd/public${item.pdf_file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/public/assets/img/pdf.png" // เปลี่ยนเป็น URL ของรูปภาพไอคอนดาวน์โหลด
                        alt="ดาวน์โหลด"
                        style={{ width: "100px", height: "100px" }} // กำหนดขนาดรูปภาพ
                      />
                    </a>
                  </td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => handleEdit(item.id)}>
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
