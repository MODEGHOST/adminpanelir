import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function HolderStucManager() {
  const [holderStucs, setHolderStucs] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    holder_name: "",
    shares_count: "",
    share_percentage: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchHolderStucs();
  }, []);

  const fetchHolderStucs = () => {
    setLoading(true);
    axios
      .get("http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/holders")
      .then((response) => {
        setHolderStucs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  const handleAdd = () => {
    axios
      .post("http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/holders", formData)
      .then(() => {
        fetchHolderStucs();
        setFormData({ id: null, holder_name: "", shares_count: "", share_percentage: "" });
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error adding data:", error);
      });
  };

  const handleEdit = (id) => {
    const holderStuc = holderStucs.find((item) => item.id === id);
    setFormData(holderStuc);
    setEditId(id);
    setShowForm(true);
  };

  const handleUpdate = () => {
    axios
      .put(`http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/holders/${editId}`, formData)
      .then(() => {
        fetchHolderStucs();
        setFormData({ id: null, holder_name: "", shares_count: "", share_percentage: "" });
        setEditId(null);
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/holders/${id}`)
      .then(() => {
        fetchHolderStucs();
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = holderStucs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const pageNumbers = Array.from(
    { length: Math.ceil(holderStucs.length / itemsPerPage) },
    (_, i) => i + 1
  );

  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <div className="container mt-5" style={{ marginRight: "10%", marginTop: "1%" }}>
          <div className="container py-5" style={{ marginRight: "10%", marginTop: "1%" }}>
      <h2 className="text-center mb-4">จัดการข้อมูลผู้ถือหุ้น (HolderStuc)</h2>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "ปิดฟอร์ม" : "เพิ่มข้อมูล"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-3">
          <div className="card-body">
            <h5>{editId ? "แก้ไขข้อมูลผู้ถือหุ้น" : "เพิ่มข้อมูลผู้ถือหุ้น"}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="holder_name" className="form-label">
                    ชื่อผู้ถือหุ้น
                  </label>
                  <input
                    type="text"
                    id="holder_name"
                    name="holder_name"
                    className="form-control"
                    value={formData.holder_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="shares_count" className="form-label">
                    จำนวนหุ้น
                  </label>
                  <input
                    type="number"
                    id="shares_count"
                    name="shares_count"
                    className="form-control"
                    value={formData.shares_count}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="share_percentage" className="form-label">
                    % ของจำนวนหุ้นทั้งหมด
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="share_percentage"
                    name="share_percentage"
                    className="form-control"
                    value={formData.share_percentage}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success mt-3">
                {editId ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล"}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อผู้ถือหุ้น</th>
              <th>จำนวนหุ้น</th>
              <th>% ของจำนวนหุ้นทั้งหมด</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((holderStuc, index) => (
                <tr key={holderStuc.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{holderStuc.holder_name}</td>
                  <td>{holderStuc.shares_count}</td>
                  <td>{holderStuc.share_percentage}%</td>
                  <td>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleEdit(holderStuc.id)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(holderStuc.id)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="pagination d-flex justify-content-center mt-3">
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`btn btn-sm ${
              page === currentPage ? "btn-primary" : "btn-outline-primary"
            } mx-1`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
    </div>
    </div>
    </div>
  );
}

export default HolderStucManager;
