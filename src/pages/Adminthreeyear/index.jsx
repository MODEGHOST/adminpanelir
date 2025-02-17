import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

function Adminthreeyear() {
  const [comments, setComments] = useState({});
const [editComment, setEditComment] = useState({ column: "", value: "" });
  const [threeYearsData, setThreeYearsData] = useState([]);
  const [formData, setFormData] = useState({
    year: "",
    sales_and_services_income: "",
    total_income: "",
    gross_profit: "",
    ebitda: "",
    ebit: "",
    net_profit_loss: "",
    total_assets: "",
    total_liabilities: "",
    shareholders_equity: "",
    gross_profit_margin: "",
    ebitda_margin: "",
    net_profit_margin: "",
    return_on_assets: "",
    return_on_equity: "",
    dividend_payout_ratio: "",
    dividend_yield: "",
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_KEY}/api/threeyear/all`)
      .then((response) => {
        const sortedData = response.data.data.sort((a, b) => b.year - a.year);
        setThreeYearsData(sortedData);
        setComments(response.data.comments); // เก็บ comments จาก API
      })
      .catch((error) => {
        console.error("Error fetching three years data:", error);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้", "error");
      });
  }, []);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form data:", formData); // Debug log
    if (editId) {
      axios
        .put(`${import.meta.env.VITE_API_KEY}/api/threeyear/${editId}`, formData)
        .then((response) => {
          console.log("Update response:", response.data); // Debug log
          setThreeYearsData(
            threeYearsData.map((data) =>
              data.id === editId ? response.data.data : data
            )
          );
          resetForm();
          Swal.fire("สำเร็จ", "แก้ไขข้อมูลเรียบร้อยแล้ว", "success");
        })
        .catch((error) => {
          console.error("Error updating data:", error);
          Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถแก้ไขข้อมูลได้", "error");
        });
    } else {
      axios
        .post("http://localhost:8000/api/threeyear", formData)
        .then((response) => {
          console.log("Add response:", response.data); // Debug log
          setThreeYearsData([...threeYearsData, response.data.data]);
          resetForm();
          Swal.fire("สำเร็จ", "เพิ่มข้อมูลเรียบร้อยแล้ว", "success");
        })
        .catch((error) => {
          console.error("Error adding data:", error);
          Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มข้อมูลได้", "error");
        });
    }
  };

  const resetForm = () => {
    setFormData({
      year: "",
      sales_and_services_income: "",
      total_income: "",
      gross_profit: "",
      ebitda: "",
      ebit: "",
      net_profit_loss: "",
      total_assets: "",
      total_liabilities: "",
      shareholders_equity: "",
      gross_profit_margin: "",
      ebitda_margin: "",
      net_profit_margin: "",
      return_on_assets: "",
      return_on_equity: "",
      dividend_payout_ratio: "",
      dividend_yield: "",
      current_ratio: "",
      debt_to_equity_ratio: "",
      par_value: "",
      book_value_per_share: "",
      net_profit_per_share: "",
      dividend_per_share: "",
      registered_common_shares : "",
      paid_common_shares: "",
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (id) => {
    const data = threeYearsData.find((data) => data.id === id);
    setFormData(data);
    setEditId(id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบข้อมูลนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบเลย!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_API_KEY}/api/threeyear/${id}`)
          .then(() => {
            setThreeYearsData(threeYearsData.filter((data) => data.id !== id));
            Swal.fire("ลบสำเร็จ!", "ข้อมูลได้ถูกลบแล้ว.", "success");
          })
          .catch((error) => {
            console.error("Error deleting data:", error);
            Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
          });
      }
    });
  };

  const handleCommentChange = (column, value) => {
    setEditComment({ column, value }); // ตั้งค่าคอลัมน์และค่าที่ต้องการแก้ไข
  };
  
  const handleCommentSubmit = () => {
    // ตรวจสอบข้อมูลก่อนส่ง
    if (!editComment.column || !editComment.value) {
      Swal.fire("เกิดข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน", "error");
      return;
    }
  
    // ส่งข้อมูลไปยัง Backend
    axios
      .post(`${import.meta.env.VITE_API_KEY}/api/threeyear/comments/update`, {
        comments: {
          [editComment.column]: editComment.value, // ส่งข้อมูลในรูปแบบ { column: comment }
        },
      })
      .then(() => {
        // อัปเดต state ของ comments
        setComments({ ...comments, [editComment.column]: editComment.value });
        setEditComment({ column: "", value: "" }); // รีเซ็ตฟอร์ม
        Swal.fire("สำเร็จ", "แก้ไข Comment เรียบร้อยแล้ว", "success");
      })
      .catch((error) => {
        console.error("Error updating comment:", error);
        const errorMessage =
          error.response?.data?.message || "ไม่สามารถแก้ไข Comment ได้";
        Swal.fire("เกิดข้อผิดพลาด", errorMessage, "error");
      });
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 7; // จำนวน Comment ต่อหน้า
  const totalPages = Math.ceil(Object.entries(comments).length / commentsPerPage);
  const currentComments = Object.entries(comments).slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  


  return (
    <div
  className="container-fluid py-5"
  style={{

    marginTop: "40px",
    marginRight: "50px",
    maxWidth: "5000px",
    width: "80%",
  }}
>
      <h1 className="text-center mb-4">จัดการข้อมูลเปรียบเทียบ 3 ปี</h1>
      <button
        className="btn btn-primary mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "ปิดฟอร์ม" : "เพิ่มข้อมูล"}
      </button>

      {showForm && (
  <div className="card mb-4">
    <div className="card-body">
      <h5 className="card-title">{editId ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}</h5>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="year" className="form-label">ปี</label>
            <input
              type="text"
              id="year"
              name="year"
              className="form-control"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="sales_and_services_income" className="form-label">รายได้ขาย/บริการ</label>
            <input
              type="number"
              id="sales_and_services_income"
              name="sales_and_services_income"
              className="form-control"
              value={formData.sales_and_services_income}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="total_income" className="form-label">รายได้รวม</label>
            <input
              type="number"
              id="total_income"
              name="total_income"
              className="form-control"
              value={formData.total_income}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="gross_profit" className="form-label">กำไรขั้นต้น</label>
            <input
              type="number"
              id="gross_profit"
              name="gross_profit"
              className="form-control"
              value={formData.gross_profit}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="ebitda" className="form-label">EBITDA</label>
            <input
              type="number"
              id="ebitda"
              name="ebitda"
              className="form-control"
              value={formData.ebitda}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="ebit" className="form-label">กำไรก่อนดบ.ภาษี</label>
            <input
              type="number"
              id="ebit"
              name="ebit"
              className="form-control"
              value={formData.ebit}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="net_profit_loss" className="form-label">กำไรสุทธิ</label>
            <input
              type="number"
              id="net_profit_loss"
              name="net_profit_loss"
              className="form-control"
              value={formData.net_profit_loss}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="total_assets" className="form-label">สินทรัพย์รวม</label>
            <input
              type="number"
              id="total_assets"
              name="total_assets"
              className="form-control"
              value={formData.total_assets}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="total_liabilities" className="form-label">หนี้สินรวม</label>
            <input
              type="number"
              id="total_liabilities"
              name="total_liabilities"
              className="form-control"
              value={formData.total_liabilities}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="shareholders_equity" className="form-label">ผู้ถือหุ้น</label>
            <input
              type="number"
              id="shareholders_equity"
              name="shareholders_equity"
              className="form-control"
              value={formData.shareholders_equity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="gross_profit_margin" className="form-label">กำไรขั้นต้น (%)</label>
            <input
              type="number"
              id="gross_profit_margin"
              name="gross_profit_margin"
              className="form-control"
              value={formData.gross_profit_margin}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="ebitda_margin" className="form-label">EBITDA (%)</label>
            <input
              type="number"
              id="ebitda_margin"
              name="ebitda_margin"
              className="form-control"
              value={formData.ebitda_margin}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="net_profit_margin" className="form-label">กำไรสุทธิ (%)</label>
            <input
              type="number"
              id="net_profit_margin"
              name="net_profit_margin"
              className="form-control"
              value={formData.net_profit_margin}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="return_on_assets" className="form-label">ROA (%)</label>
            <input
              type="number"
              id="return_on_assets"
              name="return_on_assets"
              className="form-control"
              value={formData.return_on_assets}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="return_on_equity" className="form-label">ROE (%)</label>
            <input
              type="number"
              id="return_on_equity"
              name="return_on_equity"
              className="form-control"
              value={formData.return_on_equity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="current_ratio" className="form-label">เงินทุนหมุนเวียน</label>
            <input
              type="number"
              id="current_ratio"
              name="current_ratio"
              className="form-control"
              value={formData.current_ratio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="debt_to_equity_ratio" className="form-label">หนี้สิน/ผู้ถือหุ้น</label>
            <input
              type="number"
              id="debt_to_equity_ratio"
              name="debt_to_equity_ratio"
              className="form-control"
              value={formData.debt_to_equity_ratio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="par_value" className="form-label">มูลค่าตราไว้</label>
            <input
              type="number"
              id="par_value"
              name="par_value"
              className="form-control"
              value={formData.par_value}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="book_value_per_share" className="form-label">มูลค่าบัญชี/หุ้น</label>
            <input
              type="number"
              id="book_value_per_share"
              name="book_value_per_share"
              className="form-control"
              value={formData.book_value_per_share}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="net_profit_per_share" className="form-label">กำไร/หุ้น</label>
            <input
              type="number"
              id="net_profit_per_share"
              name="net_profit_per_share"
              className="form-control"
              value={formData.net_profit_per_share}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="dividend_per_share" className="form-label">ปันผล/หุ้น</label>
            <input
              type="number"
              id="dividend_per_share"
              name="dividend_per_share"
              className="form-control"
              value={formData.dividend_per_share}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
  <label htmlFor="dividend_payout_ratio" className="form-label">ปันผล/กำไรสุทธิ (%)</label>
  <input
    type="number"
    id="dividend_payout_ratio"
    name="dividend_payout_ratio"
    className="form-control"
    value={formData.dividend_payout_ratio}
    onChange={handleChange}
    required
  />
</div>
<div className="col-md-4">
  <label htmlFor="dividend_yield" className="form-label">ผลตอบแทนปันผล (%)</label>
  <input
    type="number"
    id="dividend_yield"
    name="dividend_yield"
    className="form-control"
    value={formData.dividend_yield}
    onChange={handleChange}
    required
  />
</div>

          <div className="col-md-4">
            <label htmlFor="registered_common_shares" className="form-label">หุ้นจดทะเบียน</label>
            <input
              type="number"
              id="registered_common_shares"
              name="registered_common_shares"
              className="form-control"
              value={formData.registered_common_shares}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="paid_common_shares" className="form-label">หุ้นชำระแล้ว</label>
            <input
              type="number"
              id="paid_common_shares"
              name="paid_common_shares"
              className="form-control"
              value={formData.paid_common_shares}
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

<div className="card">
  <div className="card-body">
    <h5 className="card-title text-center">ข้อมูลเปรียบเทียบ 3 ปี</h5>
    <div className="table-responsive">
      <table
        className="table table-bordered table-hover"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead style={{ position: "sticky", top: "0", backgroundColor: "#f8f9fa", zIndex: 2 }}>
          <tr>
            <th style={{ textAlign: "center", backgroundColor: "#e9ecef" }}>ปี</th>
            <th>รายได้ขาย/บริการ</th>
<th>รายได้รวม</th>
<th>กำไรขั้นต้น</th>
<th>EBITDA</th>
<th>กำไรก่อนดบ.ภาษี</th>
<th>กำไรสุทธิ</th>
<th>สินทรัพย์รวม</th>
<th>หนี้สินรวม</th>
<th>ผู้ถือหุ้น</th>
<th>กำไรขั้นต้น (%)</th>
<th>EBITDA (%)</th>
<th>กำไรสุทธิ (%)</th>
<th>ROA (%)</th>
<th>ROE (%)</th>
<th>เงินทุนหมุนเวียน</th>
<th>หนี้สิน/ผู้ถือหุ้น</th>
<th>มูลค่าตราไว้</th>
<th>มูลค่าบัญชี/หุ้น</th>
<th>กำไร/หุ้น</th>
<th>ปันผล/หุ้น</th>
<th>ปันผล/กำไรสุทธิ</th>
<th>ผลตอบแทนปันผล</th>
<th>หุ้นจดทะเบียน</th>
<th>หุ้นชำระแล้ว</th>
<th>จัดการ</th>

          </tr>
        </thead>
        <tbody>
          {threeYearsData.length > 0 ? (
            threeYearsData.map((data) => (
              <tr key={data.id}>
                <td
                  style={{
                    textAlign: "center",
                    backgroundColor: "#e9ecef",
                    fontWeight: "bold",
                  }}
                >
                  {data.year}
                </td>
                <td style={{ textAlign: "right" }}>{data.sales_and_services_income.toLocaleString()}</td>
                <td style={{ textAlign: "right" }}>{data.total_income.toLocaleString()}</td>
                <td style={{ textAlign: "right" }}>{data.gross_profit.toLocaleString()}</td>
                <td style={{ textAlign: "right" }}>{data.ebitda.toLocaleString()}</td>
                <td style={{ textAlign: "right" }}>{data.ebit.toLocaleString()}</td>
                <td style={{ textAlign: "right" }}>{data.net_profit_loss.toLocaleString()}</td>
                <td style={{ textAlign: "right" }}>{data.total_assets.toLocaleString()}</td>
                <td style={{ textAlign: "right" }}>{data.total_liabilities.toLocaleString()}</td>
                <td style={{ textAlign: "right" }}>{data.shareholders_equity.toLocaleString()}</td>
                <td style={{ textAlign: "right" }}>{data.gross_profit_margin}%</td>
                <td style={{ textAlign: "right" }}>{data.ebitda_margin}%</td>
                <td style={{ textAlign: "right" }}>{data.net_profit_margin}%</td>
                <td style={{ textAlign: "right" }}>{data.return_on_assets}%</td>
                <td style={{ textAlign: "right" }}>{data.return_on_equity}%</td>
                <td style={{ textAlign: "right" }}>{data.dividend_payout_ratio}%</td>
                <td style={{ textAlign: "right" }}>{data.dividend_yield}%</td>
                <td style={{ textAlign: "center" }}>{data.current_ratio}</td>
                <td style={{ textAlign: "center" }}>{data.debt_to_equity_ratio}</td>
                <td style={{ textAlign: "center" }}>{data.par_value}</td>
                <td style={{ textAlign: "center" }}>{data.book_value_per_share}</td>
                <td style={{ textAlign: "center" }}>{data.net_profit_per_share}</td>
                <td style={{ textAlign: "center" }}>{data.dividend_per_share}</td>
                <td style={{ textAlign: "center" }}>{data.registered_common_shares}</td>
                <td style={{ textAlign: "center" }}>{data.paid_common_shares}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(data.id)}
                    title="แก้ไขข้อมูล"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(data.id)}
                    title="ลบข้อมูล"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="27" className="text-center">
                ไม่พบข้อมูล
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>
<div className="card">
  <div className="card-body">
    <h5 className="card-title">จัดการ Comment ของคอลัมน์</h5>
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th style={{ width: "1%" }}>คอลัมน์</th>
            <th style={{ width: "1%" }}>Comment</th>
            <th style={{ width: "1%" }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {currentComments.map(([column, comment]) => (
            <tr key={column}>
              <td>{column}</td>
              <td>
                {editComment.column === column ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editComment.value}
                    onChange={(e) =>
                      setEditComment({ column, value: e.target.value })
                    }
                  />
                ) : (
                  comment
                )}
              </td>
              <td>
                {editComment.column === column ? (
                  <button
                    className="btn btn-success"
                    onClick={handleCommentSubmit}
                  >
                    บันทึก
                  </button>
                ) : (
                  <button
                    className="btn btn-warning"
                    onClick={() =>
                      setEditComment({ column, value: comments[column] })
                    }
                  >
                    แก้ไข
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="pagination">
      <button
        className="btn btn-secondary me-2"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ก่อนหน้า
      </button>
      <button
        className="btn btn-secondary ms-2"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ถัดไป
      </button>
    </div>
  </div>
</div>
    </div>
  );
}

export default Adminthreeyear;
