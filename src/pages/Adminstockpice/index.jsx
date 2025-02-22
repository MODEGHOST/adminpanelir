import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

function Index() {
  const [stockPrices, setStockPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
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
  const [editId, setEditId] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [rowsToShow, setRowsToShow] = useState(10); // ค่าเริ่มต้นเป็น 10 แถว
  const [csvFile, setCsvFile] = useState(null);



  useEffect(() => {
    axios
      // .get(`${import.meta.env.VITE_API_KEY}/api/stock-prices`)
      .get(`${import.meta.env.VITE_API_KEY}/api/stock-prices`)
      .then((response) => {
        setStockPrices(response.data);
        setFilteredPrices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock prices:", error);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้", "error");
      });
  }, []);

  const handleSearch = (e) => {
    const date = e.target.value;
    setSearchDate(date);

    const filtered = stockPrices.filter((price) =>
      price.date.includes(date)
    );
    setFilteredPrices(filtered);
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
};

const handleImportCSV = () => {
  if (!csvFile) {
      Swal.fire("กรุณาเลือกไฟล์", "กรุณาเลือกไฟล์ CSV ก่อนอัปโหลด", "warning");
      return;
  }

  const formData = new FormData();
  formData.append("file", csvFile);

  axios.post(`${import.meta.env.VITE_API_KEY}/api/stock-prices/import-csv`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
  })
  .then((response) => {
      Swal.fire("นำเข้าสำเร็จ", response.data.message, "success");
      setCsvFile(null);
      document.getElementById("csv-file-input").value = "";
  })
  .catch((error) => {
      console.error("Error importing CSV:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถนำเข้าข้อมูลได้", "error");
  });
};


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("📤 ส่งข้อมูลไปยัง API:", formData); // ✅ ตรวจสอบข้อมูลที่ถูกส่งไป

    if (editId) {
        console.log(`🛠 กำลังอัปเดตข้อมูลที่ ID: ${editId}`);

        axios.put(`${import.meta.env.VITE_API_KEY}/api/stock-prices/${editId}`, formData)
            .then((response) => {
                console.log("✅ API ตอบกลับ:", response.data); // ✅ ตรวจสอบ Response ที่ได้รับกลับมา

                setStockPrices((prevStockPrices) =>
                    prevStockPrices
                        .map((price) => (price.id === editId ? response.data : price))
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // เรียงตามวันที่
                );

                setFilteredPrices((prevFilteredPrices) =>
                    prevFilteredPrices
                        .map((price) => (price.id === editId ? response.data : price))
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // เรียงตามวันที่
                );

                resetForm();
                Swal.fire("สำเร็จ", "แก้ไขข้อมูลเรียบร้อยแล้ว", "success");
            })
            .catch((error) => {
                console.error("❌ Error updating stock price:", error);
                Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถแก้ไขข้อมูลได้", "error");
            });
    } else {
        console.log("➕ กำลังเพิ่มข้อมูลใหม่...");

        axios.post(`${import.meta.env.VITE_API_KEY}/api/stock-prices`, formData)
            .then((response) => {
                console.log("✅ API ตอบกลับ:", response.data); // ✅ ตรวจสอบ Response ที่ได้รับกลับมา

                setStockPrices((prevStockPrices) =>
                    [...prevStockPrices, response.data].sort((a, b) => new Date(b.date) - new Date(a.date))
                );

                setFilteredPrices((prevFilteredPrices) =>
                    [...prevFilteredPrices, response.data].sort((a, b) => new Date(b.date) - new Date(a.date))
                );

                resetForm();
                Swal.fire("สำเร็จ", "เพิ่มข้อมูลเรียบร้อยแล้ว", "success");
            })
            .catch((error) => {
                console.error("❌ Error adding stock price:", error);
                Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มข้อมูลได้", "error");
            });
    }
};

  
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
      trading_amount: "",
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (id) => {
    const price = stockPrices.find((price) => price.id === id);
    setFormData(price);
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
          .delete(`${import.meta.env.VITE_API_KEY}/api/stock-prices/${id}`)
          .then(() => {
            setStockPrices(stockPrices.filter((price) => price.id !== id));
            setFilteredPrices(filteredPrices.filter((price) => price.id !== id));
            Swal.fire("ลบสำเร็จ!", "ข้อมูลได้ถูกลบแล้ว.", "success");
          })
          .catch((error) => {
            console.error("Error deleting stock price:", error);
            Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
          });
      }
    });
  };

  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <div
          className="container py-5"
          style={{ marginRight: "10%", marginTop: "1%" }}
        >
          <h1 className="text-center mb-4">จัดการข้อมูลราคาหลักทรัพย์</h1>
          <div className="d-flex justify-content-between align-items-center mb-4">
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
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "ปิดฟอร์ม" : "เพิ่มข้อมูล"}
            </button>
          </div>
          <div className="d-flex gap-2">
    <input
        type="file"
        id="csv-file-input"
        className="form-control"
        accept=".csv"
        onChange={handleFileChange}
    />
    <button className="btn btn-success" onClick={handleImportCSV}>นำเข้า CSV</button>
</div>


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
                        ราคาปิด
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
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="trading_value" className="form-label">
                        ปริมาณซื้อขาย ( หุ้น )
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
                    <div className="col-md-4">
                      <label htmlFor="trade_amount" className="form-label">
                        มูลค่าการซื้อขาย
                      </label>
                      <input
                        type="number"
                        id="trade_amount"
                        name="trade_amount"
                        className="form-control"
                        value={formData.trade_amount}
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
              <h5 className="card-title">ข้อมูลราคาหลักทรัพย์</h5>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>วันที่</th>
                      <th>ราคาเปิด</th>
                      <th>ราคาสูงสุด</th>
                      <th>ราคาต่ำสุด</th>
                      <th>ราคาปิด</th>
                      <th>การเปลี่ยนแปลง</th>
                      <th>% เปลี่ยนแปลง</th>
                      <th>ปริมาณซื้อขาย</th>
                      <th>มูลค่าการซื้อขาย</th>
                      <th>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
  {filteredPrices.length > 0 ? (
    filteredPrices.slice(0, rowsToShow).map((price) => (
      <tr key={price.id}>
        <td>{price.date}</td>
        <td>{price.open_price}</td>
        <td>{price.high_price}</td>
        <td>{price.low_price}</td>
        <td>{price.previous_close_price}</td>
        <td>{price.change}</td>
        <td>{price.changepercent}</td>
        <td>{price.trading_value}</td>
        <td>{price.trade_amount}</td>
        <td>
          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(price.id)}>
            <FontAwesomeIcon icon={faEdit} className="me-1" />
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(price.id)}>
            <FontAwesomeIcon icon={faTrashAlt} className="me-1" />
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="10" className="text-center">ไม่พบข้อมูล</td>
    </tr>
  )}
</tbody>

                </table>
                <div className="d-flex justify-content-end mt-3">
  <label className="me-2">แสดงข้อมูล:</label>
  <select
    className="form-select w-auto"
    value={rowsToShow}
    onChange={(e) => setRowsToShow(Number(e.target.value))}
  >
    <option value="10">10</option>
    <option value="25">25</option>
    <option value="50">50</option>
    <option value="100">100</option>
  </select>
</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
