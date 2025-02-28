import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';


function AdminVdomeet() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: "",title_en: "", youtube_link: "", published_date: "" });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    axios
      .get(`${import.meta.env.VITE_API_KEY}/api/vdomeet`)
      .then((response) => {
        setVideos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        setError("ไม่สามารถโหลดข้อมูลได้");
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.youtube_link.includes("youtube.com/watch?v=")) {
      Swal.fire({
        icon: 'error',
        title: 'ลิงก์ไม่ถูกต้อง',
        text: 'กรุณาใส่ลิงก์ YouTube ที่ถูกต้อง'
      });
      return;
    }

    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_KEY}/api/vdomeet/${editId}`, formData);
        Swal.fire('สำเร็จ', 'แก้ไขข้อมูลสำเร็จ', 'success');
      } else {
        await axios.post(`${import.meta.env.VITE_API_KEY}/api/vdomeet`, formData);
        Swal.fire('สำเร็จ', 'เพิ่มวิดีโอสำเร็จ', 'success');
      }

      fetchVideos();
      resetForm();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.message || error.message
      });
    }
  };

  const handleEdit = (id) => {
    const videoToEdit = videos.find((item) => item.id === id);
    if (videoToEdit) {
      setFormData({
        title: videoToEdit.title,
        title_en: videoToEdit.title_en,
        youtube_link: videoToEdit.youtube_link,
        published_date: videoToEdit.published_date
      });
      setEditId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "คุณต้องการลบวิดีโอนี้หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_API_KEY}/api/vdomeet/${id}`)
          .then(() => {
            fetchVideos();
            Swal.fire('ลบสำเร็จ!', 'วิดีโอถูกลบแล้ว.', 'success');
          })
          .catch(() => {
            Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบวิดีโอได้', 'error');
          });
      }
    });
  };

  const resetForm = () => {
    setFormData({ title: "",title_en: "", youtube_link: "", published_date: "" });
    setEditId(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">จัดการวิดีโอ Vdomeet</h1>

      <div className="d-flex justify-content-end mb-4">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "ปิดฟอร์ม" : "เพิ่มวิดีโอ"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">ชื่อวิดีโอ(TH)</label>
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
                <label htmlFor="title_en" className="form-label">ชื่อวิดีโอ(EN)</label>
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
                <label htmlFor="youtube_link" className="form-label">ลิงก์ YouTube</label>
                <input
                  type="url"
                  id="youtube_link"
                  className="form-control"
                  value={formData.youtube_link}
                  onChange={(e) => setFormData({ ...formData, youtube_link: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="published_date" className="form-label">วันที่เผยแพร่</label>
                <input
                  type="date"
                  id="published_date"
                  className="form-control"
                  value={formData.published_date}
                  onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                {editId ? "บันทึกการแก้ไข" : "เพิ่มวิดีโอ"}
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
                <th>ชื่อวิดีโอ(TH)</th>
                <th>ชื่อวิดีโอ(EN)</th>
                <th>ลิงก์</th>
                <th>วันที่เผยแพร่</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video, index) => (
                <tr key={video.id}>
                  <td>{index + 1}</td>
                  <td>{video.title}</td>
                  <td>{video.title_en}</td>
                  <td>
                    <a href={video.youtube_link} target="_blank" rel="noopener noreferrer">
                      ดูวิดีโอ
                    </a>
                  </td>
                  <td>{video.published_date}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(video.id)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(video.id)}>
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

export default AdminVdomeet;
