import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function Index() {
  const [stockPrices, setStockPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]); // ข้อมูลที่กรองตามการค้นหา
  const [formData, setFormData] = useState({
    date: "",
    open_price: "",
    high_price: "",
    low_price: "",
    previous_close_price: "",
    change: "",
    changepercent: "",
    trading_value: "",
  });
  const [editId, setEditId] = useState(null); // ID ของข้อมูลที่กำลังแก้ไข
  const [searchDate, setSearchDate] = useState(""); // วันที่ค้นหา
  const [showForm, setShowForm] = useState(false); // จัดการการแสดง/ซ่อนฟอร์ม

  useEffect(() => {
    // ดึงข้อมูลจาก API
    axios
      .get("http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/stock-prices")
      .then((response) => {
        setStockPrices(response.data);
        setFilteredPrices(response.data); // ตั้งค่าเริ่มต้นให้เหมือนข้อมูลทั้งหมด
      })
      .catch((error) => console.error("Error fetching stock prices:", error));
  }, []);

  // ค้นหาข้อมูลตามวันที่
  const handleSearch = (e) => {
    const date = e.target.value;
    setSearchDate(date);

    const filtered = stockPrices.filter((price) =>
      price.date.includes(date) // กรองตามวันที่ที่ค้นหา
    );
    setFilteredPrices(filtered);
  };

  // จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // เพิ่มหรือแก้ไขข้อมูล
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      // แก้ไขข้อมูล
      axios
        .put(`http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/stock-prices/${editId}`, formData)
        .then((response) => {
          setStockPrices(
            stockPrices.map((price) =>
              price.id === editId ? response.data : price
            )
          );
          setFilteredPrices(
            filteredPrices.map((price) =>
              price.id === editId ? response.data : price
            )
          );
          resetForm();
        })
        .catch((error) => console.error("Error updating stock price:", error));
    } else {
      // เพิ่มข้อมูลใหม่
      axios
        .post("http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/stock-prices", formData)
        .then((response) => {
          setStockPrices([...stockPrices, response.data]);
          setFilteredPrices([...filteredPrices, response.data]);
          resetForm();
        })
        .catch((error) => console.error("Error adding stock price:", error));
    }
  };

  // รีเซ็ตฟอร์มหลังจากเพิ่มหรือแก้ไขข้อมูล
  const resetForm = () => {
    setFormData({
      date: "",
      open_price: "",
      high_price: "",
      low_price: "",
      previous_close_price: "",
      change: "",
      changepercent: "",
      trading_value: "",
    });
    setEditId(null);
    setShowForm(false);
  };

  // จัดการการแก้ไขข้อมูล
  const handleEdit = (id) => {
    const price = stockPrices.find((price) => price.id === id);
    setFormData(price);
    setEditId(id);
    setShowForm(true); // แสดงฟอร์มเมื่อแก้ไข
  };

  // ลบข้อมูล
  const handleDelete = (id) => {
    axios
      .delete(`http://129.200.6.52/laravel_auth_jwt_api_omd/public/api/stock-prices/${id}`)
      .then(() => {
        setStockPrices(stockPrices.filter((price) => price.id !== id));
        setFilteredPrices(filteredPrices.filter((price) => price.id !== id));
      })
      .catch((error) => console.error("Error deleting stock price:", error));
  };

  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <div
          className="container py-5"
          style={{ marginRight: "10%", marginTop: "1%" }}
        >
          <h1 className="text-center mb-4">จัดการข้อมูลราคาหลักทรัพย์</h1>

          {/* ค้นหาวันที่และปุ่มเพิ่มข้อมูลในบรรทัดเดียวกัน */}
<div className="d-flex justify-content-between align-items-center mb-4">
  {/* ช่องค้นหาวันที่ */}
  <div style={{ width: "15%" }}>
    <label htmlFor="search-date" className="form-label">
      ค้นหาวันที่:
    </label>
    <input
      type="date"
      id="search-date"
      className="form-control"
      value={searchDate}
      onChange={handleSearch}
    />
  </div>

  {/* ปุ่มเพิ่มข้อมูล */}
  <button
    className="btn btn-primary"
    onClick={() => setShowForm(!showForm)}
  >
    {showForm ? "ปิดฟอร์ม" : "เพิ่มข้อมูล"}
  </button>
</div>


          {/* ฟอร์มเพิ่ม/แก้ไขข้อมูล */}
          {showForm && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">
                  {editId ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}
                </h5>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label htmlFor="date" className="form-label">
                        วันที่
                      </label>
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
                      <label htmlFor="open_price" className="form-label">
                        ราคาเปิด
                      </label>
                      <input
                        type="number"
                        id="open_price"
                        name="open_price"
                        className="form-control"
                        value={formData.open_price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="high_price" className="form-label">
                        ราคาสูงสุด
                      </label>
                      <input
                        type="number"
                        id="high_price"
                        name="high_price"
                        className="form-control"
                        value={formData.high_price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="low_price" className="form-label">
                        ราคาต่ำสุด
                      </label>
                      <input
                        type="number"
                        id="low_price"
                        name="low_price"
                        className="form-control"
                        value={formData.low_price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="previous_close_price" className="form-label">
                        ราคาเปิดย้อนหลัง
                      </label>
                      <input
                        type="number"
                        id="previous_close_price"
                        name="previous_close_price"
                        className="form-control"
                        value={formData.previous_close_price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="change" className="form-label">
                        การเปลี่ยนแปลง
                      </label>
                      <input
                        type="number"
                        id="change"
                        name="change"
                        className="form-control"
                        value={formData.change}
                        onChange={handleChange}
                        
                      />
                    </div>
                    <div className="col-md-4">
  <label htmlFor="changepercent" className="form-label">
    % เปลี่ยนแปลง
  </label>
  <input
    type="text"
    id="changepercent"
    name="changepercent"
    className="form-control"
    value={formData.changepercent}
    onChange={(e) => {
      const value = e.target.value;
      // ตรวจสอบว่าเป็นเลขที่มี + หรือ - หรือเปล่า
      if (/^[+-]?\d*$/.test(value)) {
        handleChange(e);
      }
    }}
    style={{
      color: formData.changepercent < 0 ? 'red' : 'blue', // เปลี่ยนสีตามค่า
    }}
    required
  />
</div>

                    <div className="col-md-4">
                      <label htmlFor="trading_value" className="form-label">
                        มูลค่าการซื้อขาย
                      </label>
                      <input
                        type="number"
                        id="trading_value"
                        name="trading_value"
                        className="form-control"
                        value={formData.trading_value}
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

          {/* ตารางข้อมูล */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">ข้อมูลราคาหลักทรัพย์</h5>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>วันที่</th>
                      <th>ราคาเปิด</th>
                      <th>ราคาสูงสุด</th>
                      <th>ราคาต่ำสุด</th>
                      <th>ราคาเปิดย้อนหลัง</th>
                      <th>การเปลี่ยนแปลง</th>
                      <th>% เปลี่ยนแปลง</th>
                      <th>มูลค่าการซื้อขาย</th>
                      <th>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrices.length > 0 ? (
                      filteredPrices.map((price) => (
                        <tr key={price.id}>
                          <td>{price.date}</td>
                          <td>{price.open_price}</td>
                          <td>{price.high_price}</td>
                          <td>{price.low_price}</td>
                          <td>{price.previous_close_price}</td>
                          <td>{price.change}</td>
                          <td>{price.changepercent}</td>
                          <td>{price.trading_value}</td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => handleEdit(price.id)}
                            >
                              <FontAwesomeIcon icon={faEdit} className="me-1" />
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(price.id)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} className="me-1" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          ไม่พบข้อมูล
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
