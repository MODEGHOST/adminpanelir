import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

function Adminquarter() {
  const [quarterlyData, setQuarterlyData] = useState([]);
  const [quarandyearData, setQuarandyearData] = useState([]);
  const [quarterFormData, setQuarterFormData] = useState({
    quarter: "",
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
    current_ratio: "",
    debt_to_equity_ratio: "",
    par_value: "",
    book_value_per_share: "",
    net_profit_per_share: "",
    registered_common_shares: "",
    paid_common_shares: "",
  });
  const [quarandyearFormData, setQuarandyearFormData] = useState({
    Qpercent: "",
    Ypercent: "",
  });
  const [quarterEditId, setQuarterEditId] = useState(null);
  const [quarandyearEditId, setQuarandyearEditId] = useState(null);
  const [showQuarterForm, setShowQuarterForm] = useState(false);
  const [showQuarandyearForm, setShowQuarandyearForm] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/api/quarterly/all").then((response) => {
      const sortedData = response.data.data.sort((a, b) => b.year - a.year);
      setQuarterlyData(sortedData);
    }).catch((error) => {
      console.error("Error fetching quarterly data:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูล quarterly ได้", "error");
    });

    axios.get("http://localhost:8000/api/quarandyear/all").then((response) => {
      setQuarandyearData(response.data.data);
    }).catch((error) => {
      console.error("Error fetching quarandyear data:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูล quarandyear ได้", "error");
    });
  }, []);

  const handleQuarterChange = (e) => {
    setQuarterFormData({ ...quarterFormData, [e.target.name]: e.target.value });
  };

  const handleQuarandyearChange = (e) => {
    setQuarandyearFormData({ ...quarandyearFormData, [e.target.name]: e.target.value });
  };

  const handleQuarterSubmit = (e) => {
    e.preventDefault();
    if (quarterEditId) {
      axios.put(`http://localhost:8000/api/quarterly/${quarterEditId}`, quarterFormData).then((response) => {
        setQuarterlyData(quarterlyData.map((data) => data.id === quarterEditId ? response.data.data : data));
        resetQuarterForm();
        Swal.fire("สำเร็จ", "แก้ไขข้อมูล Quarterly เรียบร้อยแล้ว", "success");
      }).catch((error) => {
        console.error("Error updating data:", error);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถแก้ไขข้อมูลได้", "error");
      });
    } else {
      axios.post("http://localhost:8000/api/quarterly", quarterFormData).then((response) => {
        setQuarterlyData([...quarterlyData, response.data.data]);
        resetQuarterForm();
        Swal.fire("สำเร็จ", "เพิ่มข้อมูล Quarterly เรียบร้อยแล้ว", "success");
      }).catch((error) => {
        console.error("Error adding data:", error);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มข้อมูลได้", "error");
      });
    }
  };

  const handleQuarandyearSubmit = (e) => {
    e.preventDefault();
    if (quarandyearEditId) {
      axios.put(`http://localhost:8000/api/quarandyear/${quarandyearEditId}`, quarandyearFormData).then((response) => {
        setQuarandyearData(quarandyearData.map((data) => data.id === quarandyearEditId ? response.data.data : data));
        resetQuarandyearForm();
        Swal.fire("สำเร็จ", "แก้ไขข้อมูล Quarandyear เรียบร้อยแล้ว", "success");
      }).catch((error) => {
        console.error("Error updating data:", error);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถแก้ไขข้อมูลได้", "error");
      });
    } else {
      axios.post("http://localhost:8000/api/quarandyear", quarandyearFormData).then((response) => {
        setQuarandyearData([...quarandyearData, response.data.data]);
        resetQuarandyearForm();
        Swal.fire("สำเร็จ", "เพิ่มข้อมูล Quarandyear เรียบร้อยแล้ว", "success");
      }).catch((error) => {
        console.error("Error adding data:", error);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มข้อมูลได้", "error");
      });
    }
  };

  const resetQuarterForm = () => {
    setQuarterFormData({
      quarter: "",
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
      current_ratio: "",
      debt_to_equity_ratio: "",
      par_value: "",
      book_value_per_share: "",
      net_profit_per_share: "",
      registered_common_shares: "",
      paid_common_shares: "",
    });
    setQuarterEditId(null);
    setShowQuarterForm(false);
  };

  const resetQuarandyearForm = () => {
    setQuarandyearFormData({ Qpercent: "", Ypercent: "" });
    setQuarandyearEditId(null);
    setShowQuarandyearForm(false);
  };

  const handleQuarterEdit = (id) => {
    const data = quarterlyData.find((data) => data.id === id);
    setQuarterFormData(data);
    setQuarterEditId(id);
    setShowQuarterForm(true);
  };

  const handleQuarandyearEdit = (id) => {
    const data = quarandyearData.find((data) => data.id === id);
    setQuarandyearFormData(data);
    setQuarandyearEditId(id);
    setShowQuarandyearForm(true);
  };

  const handleQuarterDelete = (id) => {
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
        axios.delete(`http://localhost:8000/api/quarterly/${id}`).then(() => {
          setQuarterlyData(quarterlyData.filter((data) => data.id !== id));
          Swal.fire("ลบสำเร็จ!", "ข้อมูลได้ถูกลบแล้ว.", "success");
        }).catch((error) => {
          console.error("Error deleting data:", error);
          Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
        });
      }
    });
  };

  const handleQuarandyearDelete = (id) => {
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
        axios.delete(`http://localhost:8000/api/quarandyear/${id}`).then(() => {
          setQuarandyearData(quarandyearData.filter((data) => data.id !== id));
          Swal.fire("ลบสำเร็จ!", "ข้อมูลได้ถูกลบแล้ว.", "success");
        }).catch((error) => {
          console.error("Error deleting data:", error);
          Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
        });
      }
    });
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
      <h1 className="text-center mb-4">จัดการข้อมูลเปรียบเทียบไตรมาส</h1>
      <button
  className="btn btn-primary mb-4"
  onClick={() => setShowQuarterForm(!showQuarterForm)}
>
  {showQuarterForm ? "ปิดฟอร์ม" : "เพิ่มข้อมูล"}
</button>


{showQuarterForm && (
  <div className="card mb-4">
    <div className="card-body">
      <h5 className="card-title">{editId ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}</h5>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="quarter" className="form-label">ไตรมาส</label>
            <input
              type="text"
              id="quarter"
              name="quarter"
              className="form-control"
              value={formData.quarter}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="sales_and_services_income" className="form-label">รายได้จากการขายและบริการ</label>
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
            <label htmlFor="gross_profit" className="form-label">กำไร (ขาดทุน) ขั้นต้น</label>
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
            <label htmlFor="ebit" className="form-label">กำไรก่อนดอกเบี้ยและภาษี</label>
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
            <label htmlFor="net_profit_loss" className="form-label">กำไร (ขาดทุน) สุทธิ</label>
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
            <label htmlFor="shareholders_equity" className="form-label">ส่วนของผู้ถือหุ้น</label>
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
            <label htmlFor="gross_profit_margin" className="form-label">อัตรากำไรขั้นต้น (%)</label>
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
            <label htmlFor="ebitda_margin" className="form-label">EBITDA Margin (%)</label>
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
            <label htmlFor="net_profit_margin" className="form-label">อัตรากำไรสุทธิ (%)</label>
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
            <label htmlFor="current_ratio" className="form-label">อัตราส่วนเงินทุนหมุนเวียน</label>
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
            <label htmlFor="debt_to_equity_ratio" className="form-label">อัตราส่วนหนี้สินต่อส่วนของผู้ถือหุ้น</label>
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
            <label htmlFor="par_value" className="form-label">มูลค่าที่ตราไว้</label>
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
            <label htmlFor="book_value_per_share" className="form-label">มูลค่าทางบัญชีต่อหุ้น</label>
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
            <label htmlFor="net_profit_per_share" className="form-label">กำไรสุทธิต่อหุ้น</label>
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
            <label htmlFor="registered_common_shares" className="form-label">หุ้นสามัญจดทะเบียน</label>
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
            <label htmlFor="paid_common_shares" className="form-label">หุ้นสามัญชำระแล้ว</label>
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
    <h5 className="card-title text-center">เปรียบเทียบไตรมาส</h5>
    <div className="table-responsive">
      <table
        className="table table-bordered table-hover"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead style={{ position: "sticky", top: "0", backgroundColor: "#f8f9fa", zIndex: 2 }}>
          <tr>
            <th style={{ textAlign: "center", backgroundColor: "#e9ecef" }}>ไตรมาส</th>
            <th>รายได้จากการขายและบริการ</th>
<th>รายได้รวม1</th>
<th>กำไร (ขาดทุน) ขั้นต้น</th>
<th>กำไรก่อนดอกเบี้ย ภาษี ค่าเสื่อมราคาและ ค่าตัดจำหน่าย</th>
<th>กำไรก่อนดอกเบี้ยและภาษี</th>
<th>กำไร (ขาดทุน) สุทธิ 2</th>
<th>สินทรัพย์รวม</th>
<th>หนี้สินรวม</th>
<th>ส่วนของผู้ถือหุ้น</th>
<th>อัตรากำไรขั้นต้น</th>
<th>กำไรก่อนดอกเบี้ย ภาษี ค่าเสื่อมราคาและ ค่าตัดจำหน่าย</th>
<th>อัตรากำไรสุทธิ</th>
<th>อัตราผลตอบแทนจากสินทรัพย์รวม</th>
<th>อัตราผลตอบแทนจากส่วนของผู้ถือหุ้น</th>
<th>อัตราส่วนเงินทุนหมุนเวียน</th>
<th>อัตราส่วนหนี้สินต่อส่วนของผู้ถือหุ้น</th>
<th>มูลค่าที่ตราไว้</th>
<th>มูลค่าทางบัญชีต่อหุ้น</th>
<th>กำไรสุทธิต่อหุ้น</th>
<th>จำนวนหุ้นสามัญจดทะเบียน</th>
<th>จำนวนหุ้นสามัญชำระแล้ว</th>
<th>จัดการ</th>

          </tr>
        </thead>
        <tbody>
          {quarterlyData.length > 0 ? (
            quarterlyData.map((data) => (
              <tr key={data.id}>
                <td
                  style={{
                    textAlign: "center",
                    backgroundColor: "#e9ecef",
                    fontWeight: "bold",
                  }}
                >
                  {data.quarter}
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
                <td style={{ textAlign: "center" }}>{data.current_ratio}</td>
                <td style={{ textAlign: "center" }}>{data.debt_to_equity_ratio}</td>
                <td style={{ textAlign: "center" }}>{data.par_value}</td>
                <td style={{ textAlign: "center" }}>{data.book_value_per_share}</td>
                <td style={{ textAlign: "center" }}>{data.net_profit_per_share}</td>
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


      {/* Quarandyear Table Section */}
      
      <div className="card mt-5">
        <div className="card-body">
          <h5 className="card-title text-center">จัดการ Quarandyear</h5>
          <button
            className="btn btn-primary mb-4"
            onClick={() => setShowQuarandyearForm(!showQuarandyearForm)}
          >
            {showQuarandyearForm ? "ปิดฟอร์ม" : "เพิ่มข้อมูล"}
          </button>
          {showQuarandyearForm && (
            <form onSubmit={handleQuarandyearSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="Qpercent" className="form-label">Q Percent</label>
                  <input
                    type="number"
                    id="Qpercent"
                    name="Qpercent"
                    className="form-control"
                    value={quarandyearFormData.Qpercent}
                    onChange={handleQuarandyearChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="Ypercent" className="form-label">Y Percent</label>
                  <input
                    type="number"
                    id="Ypercent"
                    name="Ypercent"
                    className="form-control"
                    value={quarandyearFormData.Ypercent}
                    onChange={handleQuarandyearChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success mt-3">
                {quarandyearEditId ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล"}
              </button>
            </form>
          )}
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                <th style={{ width: "50px", textAlign: "center" }}>#</th>
                <th style={{ width: "100px", textAlign: "center" }}>Q Percent</th>
                <th style={{ width: "100px", textAlign: "center" }}>Y Percent</th>
                <th style={{ width: "100px", textAlign: "center" }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {quarandyearData.length > 0 ? (
                  quarandyearData.map((data) => (
                    <tr key={data.id}>
                      <td>{data.id}</td>
                      <td>{data.Qpercent}</td>
                      <td>{data.Ypercent}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleQuarandyearEdit(data.id)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleQuarandyearDelete(data.id)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">ไม่พบข้อมูล</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>


    </div>
  );
}

export default Adminquarter;
