import React from "react";
import { NavLink as Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <>
      <aside className="main-sidebar nav-pills sidebar-dark-primary sidebar-no-expand elevation-1">
        <Link to="/" className="brand-link">
          <img
            src="/assets/dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-1"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">ADMIN WEB IR</span>
        </Link>
        <div className="sidebar">
          <nav className="mt-2">
            <ul
              className="nav nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-header">เมนูหลัก</li>
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <i className="nav-icon fas fa-home"></i>
                  <p>หน้าแรก</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/adminstockpice" className="nav-link">
                  <p>ราคาตลาดหลักทรัพย์ย้อนหลัง</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Admingovernan" className="nav-link">
                  <p>คู่มือการกำกับดูแลกิจการฯ & ข้อบังคับของบริษัท</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminnews" className="nav-link">
                  <p>ข่าวข้อมูลตลาดหลักทรัพย์</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminnewsprint" className="nav-link">
                  <p>ข่าวจากสื่อสิ่งพิมพื</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Admindocread" className="nav-link">
                  <p>เอกสารOne-report</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminholder" className="nav-link">
                  <p>โครงสร้างผู้ถือหุ้น</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminevent" className="nav-link">
                  <p>ปฎิทินกิจกรรม</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminfinanstates" className="nav-link">
                  <p>งบการเงิน</p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
