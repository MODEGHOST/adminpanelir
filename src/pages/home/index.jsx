import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Index() {
  const [counts, setCounts] = useState({
    analysis: 0,
    detailgeneration: 0,
    doc_read: 0,
    events: 0,
    finan_state: 0,
    holder_stuc: 0,
    manualsgovernan: 0,
    news: 0,
    newsprint: 0,
    pay_lists: 0,
    petty_cashes: 0,
    stock_prices: 0,
    users: 0,
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_KEY}/api/count-tables`)
      .then((response) => {
        setCounts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching table counts:", error);
      });
  }, []);

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">หน้าหลัก</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item active">หน้าหลัก</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
  <div className="container-fluid">
    {/* ข้อมูลเดิม */}
    <div className="row">
      <TableBox name="Analysis" count={counts.analysis} color="bg-info" />
      <TableBox name="Detail Generation" count={counts.detailgeneration} color="bg-primary" />
      <TableBox name="Doc Read" count={counts.doc_read} color="bg-success" />
      <TableBox name="Events" count={counts.events} color="bg-danger" />
    </div>
    <div className="row">
      <TableBox name="Financial State" count={counts.finan_state} color="bg-warning" />
      <TableBox name="Holder Stuc" count={counts.holder_stuc} color="bg-secondary" />
      <TableBox name="News" count={counts.news} color="bg-info" />
    </div>

    {/* ข้อมูลใหม่: SET Search */}
    <div className="row">
  <div className="col-lg-3">
    <a
      href="https://www.set.or.th/th/market/product/stock/quote/TRU/price"
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", color: "inherit" }} // เอาสไตล์ให้ลิงก์กลมกลืน
    >
      <div className="small-box bg-primary">
        <div className="inner">
          <h3>SET TRADE</h3>
          <p>ทางลัดเข้าหน้าตลาดหลักทรัพย์</p>
        </div>
        <div className="icon">
          <i className="fas fa-search"></i>
        </div>
      </div>
    </a>
  </div>
</div>

  </div>
</div>

    </div>
  );
}

function TableBox({ name, count, color }) {
  return (
    <div className="col-lg-3">
      <div className={`small-box ${color}`}>
        <div className="inner">
          <h3>{count}</h3>
          <p>{name}</p>
        </div>
        <div className="icon">
          <i className="fas fa-database"></i>
        </div>
      </div>
    </div>
  );
}
