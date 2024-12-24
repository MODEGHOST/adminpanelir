import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // สำหรับการตรวจสอบรหัสผ่าน
  const [password, setPassword] = useState(""); // รหัสผ่านที่ป้อนโดยผู้ใช้
  const [logs, setLogs] = useState([]); // สำหรับเก็บ Logs

  const API_URL = "http://129.200.6.52/laravel_auth_jwt_api_omd/public/api";

  // ดึงข้อมูลผู้ดูแลระบบและ Logs
  useEffect(() => {
    if (isAuthenticated) {
      fetchAdmins();
      fetchLogs();
    }
  }, [isAuthenticated]);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${API_URL}/admins`);
      const sortedAdmins = response.data.sort((a, b) => {
        const rolePriority = { superadmin: 1, admin: 2 };
        return rolePriority[a.role] - rolePriority[b.role];
      });
      setAdmins(sortedAdmins);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/logs`);
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/admins/${editId}`, formData);
        Swal.fire("Success", "Admin updated successfully", "success");
      } else {
        await axios.post(`${API_URL}/admins`, formData);
        Swal.fire("Success", "Admin created successfully", "success");
      }
      fetchAdmins();
      fetchLogs();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?")) {
      try {
        await axios.delete(`${API_URL}/admins/${id}`);
        Swal.fire("Deleted", "Admin deleted successfully", "success");
        fetchAdmins();
        fetchLogs();
      } catch (error) {
        console.error("Error deleting admin:", error);
      }
    }
  };

  const handleEdit = (admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role,
    });
    setEditId(admin.id);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", role: "admin" });
    setEditId(null);
  };

  const handleLogin = () => {
    if (password === "ไม่มีธุระเข้าได้ตามสบาย") {
      setIsAuthenticated(true);
    } else {
      Swal.fire("Error", "รหัสผ่านไม่ถูกต้อง", "error");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container text-center py-5" style={{ marginRight: "10%", marginTop: "1%" }}>
        <h1>เข้าสู่ระบบผู้ดูแลระบบ</h1>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="กรอกรหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleLogin}>
          ยืนยัน
        </button>
      </div>
    );
  }

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;

  return (
    <div className="container py-5" style={{ marginRight: "10%", marginTop: "1%" }}>
      <h1 className="text-center mb-4">จัดการผู้ดูแลระบบ</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col-md-3 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="ชื่อ"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="อีเมล"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="รหัสผ่าน"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editId}
            />
          </div>
          <div className="col-md-2 mb-3">
            <select
              className="form-select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-primary">
              {editId ? "อัปเดต" : "เพิ่ม"}
            </button>
          </div>
        </div>
      </form>

      <table className="table table-bordered text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อ</th>
            <th>อีเมล</th>
            <th>บทบาท</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={admin.id}>
              <td>{index + 1}</td>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(admin)}>
                  แก้ไข
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(admin.id)}>
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-center mt-5">Logs</h2>
      <table className="table table-bordered text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Admin</th>
            <th>Action</th>
            <th>Description</th>
            <th>IP Address</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log.id}>
              <td>{index + 1}</td>
              <td>{log.admin_id ? log.admin_id : "Hack"}</td>
              <td>{log.action}</td>
              <td>{log.description}</td>
              <td>{log.ip_address}</td>
              <td>{new Date(log.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminManagement;
