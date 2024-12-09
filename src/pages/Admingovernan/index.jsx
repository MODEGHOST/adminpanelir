import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';


function AdminIndex() {
  const [manuals, setManuals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: "" });
  const [frontImage, setFrontImage] = useState(null); // สำหรับอัปโหลดรูปภาพ
  const [downloadFile, setDownloadFile] = useState(null); // สำหรับอัปโหลดไฟล์ดาวน์โหลด
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchManuals();
  }, []);

  const fetchManuals = () => {
    axios
      .get("http://localhost:8000/api/manuals")
      .then((response) => {
        setManuals(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching manuals:", error);
        setError("ไม่สามารถโหลดข้อมูลได้");
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    if (frontImage) formDataToSend.append("front_image", frontImage); // เพิ่มไฟล์รูปภาพ
    if (downloadFile) formDataToSend.append("download_file", downloadFile); // เพิ่มไฟล์ดาวน์โหลด

    try {
      if (editId) {
        // Update manual
        await axios.post(
          `http://localhost:8000/api/manuals/${editId}`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        // Add new manual
        await axios.post("http://localhost:8000/api/manuals", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchManuals();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (manual) => {
    setFormData({ title: manual.title });
    setEditId(manual.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?")) {
      axios
        .delete(`http://localhost:8000/api/manuals/${id}`)
        .then(() => fetchManuals())
        .catch((error) => console.error("Error deleting manual:", error));
    }
  };

  const resetForm = () => {
    setFormData({ title: "" });
    setFrontImage(null);
    setDownloadFile(null);
    setEditId(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container py-5" style={{ marginRight: "10%", marginTop: "1%" }}>
      <h1 className="text-center mb-4">จัดการคู่มือการกำกับดูแลกิจการ</h1>

      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "ปิดฟอร์ม" : "เพิ่มข้อมูล"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  ชื่อคู่มือ
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
                <label htmlFor="front_image" className="form-label">
                  รูปภาพหน้า
                </label>
                <input
                  type="file"
                  id="front_image"
                  className="form-control"
                  onChange={(e) => setFrontImage(e.target.files[0])}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="download_file" className="form-label">
                  ไฟล์สำหรับดาวน์โหลด
                </label>
                <input
                  type="file"
                  id="download_file"
                  className="form-control"
                  onChange={(e) => setDownloadFile(e.target.files[0])}
                />
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
                <th>ชื่อคู่มือ</th>
                <th>รูปภาพหน้า</th>
                <th>ไฟล์ดาวน์โหลด</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {manuals.map((manual, index) => (
                <tr key={manual.id}>
                  <td>{index + 1}</td>
                  <td>{manual.title}</td>
                  <td style={{ width: "100px", height: "100px" }}>
                    <img
                      src={`http://localhost:8000${manual.front_image_url}`}
                      alt={manual.title}
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </td>
                  <td style={{ width: "100px", height: "100px" }}>
                    <a
                      href={`http://localhost:8000${manual.download_url}`}
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
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(manual.id)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(manual.id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="me-1" />
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

export default AdminIndex;