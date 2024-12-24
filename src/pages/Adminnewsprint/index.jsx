import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function Adminnewsprint() {
  const [newsprints, setNewsprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: '', date: '' });
  const [pdfFile, setPdfFile] = useState(null); // สำหรับอัปโหลดไฟล์ PDF
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchNewsprints();
  }, []);

  const fetchNewsprints = () => {
    axios
      .get('http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/newsprint')
      .then((response) => {
        setNewsprints(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching newsprints:', error);
        setError('ไม่สามารถโหลดข้อมูลได้');
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('date', formData.date);
    if (pdfFile) formDataToSend.append('pdf_file', pdfFile);

    try {
      let response;
      if (editId) {
        response = await axios.post(
          `http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/newsprint/${editId}`,
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        response = await axios.post(
          'http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/newsprint',
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }

      console.log(response.data);
      fetchNewsprints();
      resetForm();
    } catch (error) {
      if (error.response) {
        console.error('Error Response:', error.response.data.errors);
        alert('เกิดข้อผิดพลาด: ' + JSON.stringify(error.response.data.errors));
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  const handleEdit = (id) => {
    const newsprintToEdit = newsprints.find((item) => item.id === id);
    if (newsprintToEdit) {
      setFormData({ title: newsprintToEdit.title, date: newsprintToEdit.date });
      setEditId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('คุณต้องการลบข้อมูลนี้หรือไม่?')) {
      axios
        .delete(`http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/newsprint/${id}`)
        .then(() => fetchNewsprints())
        .catch((error) => console.error('Error deleting newsprint:', error));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', date: '' });
    setPdfFile(null);
    setEditId(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">จัดการข้อมูลข่าวจากสื่อสิ่งพิมพ์</h1>

      <div className="d-flex justify-content-end mb-4">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'ปิดฟอร์ม' : 'เพิ่มข้อมูล'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">หัวข้อข่าว</label>
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
                <label htmlFor="pdf_file" className="form-label">ไฟล์ PDF</label>
                <input
                  type="file"
                  id="pdf_file"
                  className="form-control"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                />
              </div>
              <button type="submit" className="btn btn-success">
                {editId ? 'บันทึกการแก้ไข' : 'เพิ่มข่าว'}
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
                <th>หัวข้อข่าว</th>
                <th>วันที่</th>
                <th>ไฟล์ PDF</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {newsprints.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.date}</td>
                  <td style={{ width: "100px", height: "100px" }}>
                    <a
                      href={`http://129.200.6.52/laravel_auth_jwt_api_omd/public${item.pdf_url}`}
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

export default Adminnewsprint;
