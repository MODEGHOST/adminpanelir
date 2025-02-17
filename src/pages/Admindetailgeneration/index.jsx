import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

function Admindetailgeneration() {
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: "",
    quater: "",
    pdf_url: null,
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_KEY}/api/detailgenerations`
      );
      setStates(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching states:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบประเภทและขนาดของไฟล์ PDF
    if (formData.pdf_url && formData.pdf_url.type !== "application/pdf") {
      Swal.fire({
        icon: "error",
        title: "ไฟล์ไม่ถูกต้อง",
        text: "กรุณาเลือกไฟล์ PDF เท่านั้น",
      });
      return;
    }

    if (formData.pdf_url && formData.pdf_url.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "ไฟล์ใหญ่เกินไป",
        text: "ขนาดไฟล์ต้องไม่เกิน 5 MB",
      });
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("year", formData.year);
    data.append("quater", formData.quater);
    if (formData.pdf_url) data.append("pdf_url", formData.pdf_url);

    try {
      if (editId) {
        await axios.post(
           `${import.meta.env.VITE_API_KEY}/api/detailgenerations/${editId}`,
          data
        );
        Swal.fire("สำเร็จ", "แก้ไขข้อมูลเรียบร้อยแล้ว", "success");
      } else {
        await axios.post(
           `${import.meta.env.VITE_API_KEY}/api/detailgenerations`,
          data
        );
        Swal.fire("สำเร็จ", "เพิ่มข้อมูลเรียบร้อยแล้ว", "success");
      }
      resetForm();
      fetchStates();
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบข้อมูลนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบเลย!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
             `${import.meta.env.VITE_API_KEY}/api/detailgenerations/${id}`
          );
          fetchStates();
          Swal.fire("ลบสำเร็จ!", "ข้อมูลได้ถูกลบแล้ว.", "success");
        } catch (error) {
          console.error("Error deleting state:", error);
          Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
        }
      }
    });
  };

  const handleEdit = (state) => {
    setFormData({
      title: state.title,
      description: state.description,
      year: state.year,
      quater: state.quater,
      pdf_url: null,
    });
    setEditId(state.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      year: "",
      quater: "",
      pdf_url: null,
    });
    setFileName("");
    setEditId(null);
    setShowForm(false);
  };

  if (loading) return <div>กำลังโหลด...</div>;

  return (
    <div className="container py-5" style={{ marginRight: "10%", marginTop: "1%" }}>
      <h1 className="text-center mb-4">จัดการคำอธิบายและการวิเคราะห์ของฝ่ายจัดการ</h1>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "ปิดฟอร์ม" : "เพิ่มข้อมูล"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row mb-3">
            <div className="col-md-3">
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
            <div className="col-md-3">
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
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="ไตรมาส (Q1, Q2, Q3, Q4)"
                value={formData.quater}
                onChange={(e) =>
                  setFormData({ ...formData, quater: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-2">
              <div className="custom-file">
                <input
                  type="file"
                  id="pdf_url"
                  className="custom-file-input"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData({ ...formData, pdf_url: file });
                    setFileName(file ? file.name : ""); // อัปเดตชื่อไฟล์
                  }}
                />
                <label
                  htmlFor="pdf_url"
                  className="custom-file-label btn btn-primary"
                >
                  <i className="fa fa-upload"></i> อัปโหลดไฟล์
                </label>
              </div>
              {fileName && <p className="mt-2">ไฟล์ที่เลือก: {fileName}</p>}
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
            <th>ไตรมาส</th>
            <th>PDF</th>
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
              <td>{state.quater}</td>
              <td>
                <a
                  href={ `${import.meta.env.VITE_PDF_KEY}/uploads/pdf_files/${state.pdf_url}`}
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

export default Admindetailgeneration;
