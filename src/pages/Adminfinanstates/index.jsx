import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function Adminfinanstates() {
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: "",
    file: null,
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/finan-states");
      setStates(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("year", formData.year);
    if (formData.file) data.append("file", formData.file);

    try {
      if (editId) {
        await axios.post(`http://localhost:8000/api/finan-states/${editId}`, data);
      } else {
        await axios.post("http://localhost:8000/api/finan-states", data);
      }
      resetForm();
      fetchStates();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?")) {
      try {
        await axios.delete(`http://localhost:8000/api/finan-states/${id}`);
        fetchStates();
      } catch (error) {
        console.error("Error deleting state:", error);
      }
    }
  };

  const handleEdit = (state) => {
    setFormData({
      title: state.title,
      description: state.description,
      year: state.year,
      file: null,
    });
    setEditId(state.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", year: "", file: null });
    setEditId(null);
    setShowForm(false);
  };

  if (loading) return <div>กำลังโหลด...</div>;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">จัดการข้อมูลงบการเงิน</h1>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "ปิดฟอร์ม" : "เพิ่มข้อมูล"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="ชื่อเรื่อง"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="คำอธิบาย"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="ปี พ.ศ."
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="file"
                className="form-control"
                onChange={(e) =>
                  setFormData({ ...formData, file: e.target.files[0] })
                }
              />
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

      <table className="table table-bordered text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อเรื่อง</th>
            <th>คำอธิบาย</th>
            <th>ปี พ.ศ.</th>
            <th>รูปภาพ</th>
            <th>QR Code</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {states.map((state, index) => (
            <tr key={state.id}>
              <td>{index + 1}</td>
              <td>{state.title}</td>
              <td>{state.description}</td>
              <td>{state.year}</td>
              <td>
                <img
                  src={state.image_path}
                  alt="รูปภาพ"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </td>
              <td>
                <img
                  src={state.qr_code_path}
                  alt="QR Code"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(state)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(state.id)}
                >
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

export default Adminfinanstates;
