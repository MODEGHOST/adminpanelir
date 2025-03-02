import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function AdminEvent() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    date: new Date().toISOString().split("T")[0], 
    title: "",
    title_en: "", // ✅ เพิ่ม title_en
    description: "",
    description_en: "", // ✅ เพิ่ม description_en
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
      .get(`${import.meta.env.VITE_API_KEY}/api/events`)
      .then((response) => {
        setEvents(response.data.data || []); // ตรวจสอบให้แน่ใจว่า `data` มีค่า
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  };

  // ฟังก์ชันแปลงรูปแบบวันที่ก่อนส่งไป Backend (YYYY-MM-DD)
  const formatDateToISO = (date) => {
    if (!date) return ""; // ตรวจสอบว่าค่า `date` ไม่เป็น null หรือ undefined
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  // ฟังก์ชันแปลงรูปแบบวันที่สำหรับแสดงผล (DD/MM/YYYY)
  const formatDateToDisplay = (date) => {
    if (!date) return "-"; // กรณีที่ `date` ไม่มีค่า
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
      date: formatDateToISO(formData.date), 
      title_en: formData.title_en, // ✅ ส่งค่า title_en
      description_en: formData.description_en, // ✅ ส่งค่า description_en
    };
    

    console.log("Data to send:", formattedData);

    axios
      .post(`${import.meta.env.VITE_API_KEY}/api/events`, formattedData)
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
      date: formatDateToISO(event?.date || ""), // ตรวจสอบว่าค่า `date` ไม่เป็น null
      title_en: event?.title_en || "", // ✅ โหลด title_en
    description_en: event?.description_en || "", // ✅ โหลด description_en
    });
    setEditId(id);
    setShowForm(true);
  };

  const handleUpdate = () => {
    const formattedData = {
      ...formData,
      date: formatDateToISO(formData.date),
      title_en: formData.title_en, // ✅ อัปเดต title_en
      description_en: formData.description_en, // ✅ อัปเดต description_en
    };

    axios
      .put(`${import.meta.env.VITE_API_KEY}/api/events/${editId}`, formattedData)
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
      .delete(`${import.meta.env.VITE_API_KEY}/api/events/${id}`)
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
      date: new Date().toISOString().split("T")[0],
      title: "",
      description: "",
      title_en: "",
      description_en: "",
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
    <div className="container py-5" style={{ marginRight: "10%", marginTop: "1%" }}>
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
              <label>หัวข้อ(TH)</label>
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
              <label>หัวข้อ(EN)</label>
              <input
                type="text"
                name="title_en"
                className="form-control"
                value={formData.title_en}
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
            <div className="col-md-4 mb-3">
              <label>รายละเอียด</label>
              <input
                type="text"
                name="description_en"
                className="form-control"
                value={formData.description_en}
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
            <th>หัวข้อ(TH)</th>
            <th>หัวข้อ(EN)</th>
            <th>รายละเอียด(TH)</th>
            <th>รายละเอียด(EN)</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.length > 0 ? (
            currentEvents.map((event, index) => (
              <tr key={event.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{event.date ? formatDateToDisplay(event.date) : "-"}</td>
                <td>{event.title}</td>
                <td>{event.title_en}</td>
                <td>{event.description}</td>
                <td>{event.description_en}</td>
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
