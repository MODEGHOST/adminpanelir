import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';


function AdminnewsprintTable() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    date: '',
    title: '',
    pdf_url: '',
  });
  const [editId, setEditId] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const itemsPerPage = 4; // จำนวนข้อมูลต่อหน้า

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/newsprint')
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching newsprint:', error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const date = e.target.value;
    setSearchDate(date);

    const filtered = data.filter((item) => item.date.includes(date));
    setFilteredData(filtered);
    setCurrentPage(1); // รีเซ็ตหน้ากลับไปหน้าแรกเมื่อค้นหา
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      axios
        .put(`http://localhost:8000/api/newsprint/${editId}`, formData)
        .then((response) => {
          setData(
            data.map((item) =>
              item.id === editId ? response.data : item
            )
          );
          setFilteredData(
            filteredData.map((item) =>
              item.id === editId ? response.data : item
            )
          );
          resetForm();
        })
        .catch((error) => console.error('Error updating print:', error));
    } else {
      axios
        .post('http://localhost:8000/api/newsprint', formData)
        .then((response) => {
          setData([...data, response.data]);
          setFilteredData([...filteredData, response.data]);
          resetForm();
        })
        .catch((error) => console.error('Error adding newsprint:', error));
    }
  };

  const resetForm = () => {
    setFormData({ id: null, date: '', title: '', pdf_url: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (id) => {
    const item = data.find((newsprint) => newsprint.id === id);
    setFormData(item);
    setEditId(id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/api/newsprint/${id}`)
      .then(() => {
        setData(data.filter((newsprint) => newsprint.id !== id));
        setFilteredData(filteredData.filter((newsprint) => newsprint.id !== id));
      })
      .catch((error) => console.error('Error deleting newsprint:', error));
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <div className="container mt-5" style={{ marginRight: "10%", marginTop: "1%" }}>
          <div className="container py-5" style={{ marginRight: "10%", marginTop: "1%" }}>
            <h1 className="text-center mb-4">จัดการข้อมูลข่าวจากสื่อสิ่งพิมพ์</h1>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div style={{ width: "15%" }}>
                <label htmlFor="search-date" className="form-label">ค้นหาวันที่:</label>
                <input
                  type="date"
                  id="search-date"
                  className="form-control"
                  value={searchDate}
                  onChange={handleSearch}
                />
              </div>
              <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                {showForm ? "ปิดฟอร์ม" : "เพิ่มข้อมูล"}
              </button>
            </div>

            {showForm && (
              <div className="card mb-3">
                <div className="card-body">
                  <h5>{editId ? 'แก้ไขข่าว' : 'เพิ่มข่าว'}</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label htmlFor="date" className="form-label">วันที่</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          className="form-control"
                          value={formData.date}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="title" className="form-label">หัวข้อข่าว</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          className="form-control"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="pdf_url" className="form-label">ลิงก์เอกสาร</label>
                        <input
                          type="url"
                          id="pdf_url"
                          name="pdf_url"
                          className="form-control"
                          value={formData.pdf_url}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-success mt-3">
                      {editId ? 'บันทึกการแก้ไข' : 'เพิ่มข่าว'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {loading ? (
              <p>กำลังโหลดข้อมูล...</p>
            ) : (
              <>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>วันที่</th>
                      <th>หัวข้อข่าว</th>
                      <th>ลิงก์เอกสาร</th>
                      <th>วันที่สร้าง</th>
                      <th>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((newsprint) => (
                        <tr key={newsprint.id}>
                          <td>{newsprint.date}</td>
                          <td>{newsprint.title}</td>
                          <td style={{ width: "100px", height: "100px" }}>
                            <a
                              href={`http://localhost:8000${newsprint.pdf_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src="/public/assets/img/pdf.png"
                                alt="ดาวน์โหลด"
                                style={{ width: "100px", height: "100px" }}
                              />
                            </a>
                          </td>
                          <td>{newsprint.created_at}</td>
                          <td>
                            <button
                              className="btn btn-warning me-3"
                             style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
                              onClick={() => handleEdit(newsprint.id)}
                            >
                              <FontAwesomeIcon icon={faEdit} className="me-1" />
                                                
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
                              onClick={() => handleDelete(newsprint.id)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} className="me-1" />
                                                
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">ไม่พบข้อมูล</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="pagination d-flex justify-content-center mt-3">
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      className={`btn btn-sm ${page === currentPage ? "btn-primary" : "btn-outline-primary"} mx-1`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminnewsprintTable;
