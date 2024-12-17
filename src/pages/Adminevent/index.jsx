import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function AdminEvent() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    date: new Date().toISOString().split("T")[0], // วันที่ปัจจุบันเป็นค่าเริ่มต้น
    title: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchEvents();
  }, []);

  // ฟังก์ชันดึงข้อมูลกิจกรรม
  const fetchEvents = () => {
    axios
      .get("http://localhost:8000/api/events")
      .then((response) => {
        setEvents(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  };

  // ฟังก์ชันแปลงรูปแบบวันที่ก่อนส่งไป Backend (YYYY-MM-DD)
  const formatDateToISO = (date) => {
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  // ฟังก์ชันแปลงรูปแบบวันที่สำหรับแสดงผล (DD/MM/YYYY)
  const formatDateToDisplay = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  // จัดการการเปลี่ยนแปลงฟอร์ม
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // เพิ่มหรือแก้ไขกิจกรรม
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  // เพิ่มกิจกรรม
  const handleAdd = () => {
    const formattedData = {
      ...formData,
      date: formatDateToISO(formData.date), // ส่งเป็น YYYY-MM-DD
    };

    axios
      .post("http://localhost:8000/api/events", formattedData)
      .then(() => {
        fetchEvents();
        resetForm();
      })
      .catch((error) => {
        console.error("Error adding event:", error.response?.data || error.message);
      });
  };

  // แก้ไขกิจกรรม
  const handleEdit = (id) => {
    const event = events.find((e) => e.id === id);
    setFormData({
      ...event,
      date: formatDateToISO(event.date), // คงรูปแบบวันที่ไว้ตอนแก้ไข
    });
    setEditId(id);
    setShowForm(true);
  };

  const handleUpdate = () => {
    const formattedData = {
      ...formData,
      date: formatDateToISO(formData.date),
    };

    axios
      .put(`http://localhost:8000/api/events/${editId}`, formattedData)
      .then(() => {
        fetchEvents();
        resetForm();
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };

  // ลบกิจกรรม
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/api/events/${id}`)
      .then(() => {
        fetchEvents();
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
      });
  };

  // รีเซ็ตฟอร์ม
  const resetForm = () => {
    setFormData({
      id: null,
      date: new Date().toISOString().split("T")[0], // รีเซ็ตวันที่เป็นปัจจุบัน
      title: "",
      description: "",
    });
    setEditId(null);
    setShowForm(false);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">จัดการข้อมูลกิจกรรม</h2>
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "ปิดฟอร์ม" : "เพิ่มกิจกรรม"}
        </button>
      </div>

      {/* ฟอร์มเพิ่ม/แก้ไข */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-3 mb-4">
          <div className="row">
            <div className="col-md-4 mb-3">
              <label>วันที่</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label>หัวข้อ</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label>รายละเอียด</label>
              <input
                type="text"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            {editId ? "บันทึกการแก้ไข" : "เพิ่มกิจกรรม"}
          </button>
        </form>
      )}

      {/* ตารางกิจกรรม */}
      <table className="table table-bordered table-hover">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>วันที่</th>
            <th>หัวข้อ</th>
            <th>รายละเอียด</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.length > 0 ? (
            currentEvents.map((event, index) => (
              <tr key={event.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{formatDateToDisplay(event.date)}</td> {/* แสดง DD/MM/YYYY */}
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleEdit(event.id)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(event.id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                ไม่พบข้อมูลกิจกรรม
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`btn mx-1 ${currentPage === page ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AdminEvent;
