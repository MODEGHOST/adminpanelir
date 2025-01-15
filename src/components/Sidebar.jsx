import React from "react";
import { NavLink as Link } from "react-router-dom";
import Logo from "../../public/assets/dist/img/AdminLTELogo.png";

export default function Sidebar() {
  return (
    <>
      <aside className="main-sidebar nav-pills sidebar-dark-primary sidebar-no-expand elevation-1">
        <Link to="/" className="brand-link">
          <img
            src={Logo}
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
              <li className="nav-header">Main Menu</li>
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Home</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/adminstockpice" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Stock Prices</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminnews" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Market News</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminnewsprint" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Media News</p>
                </Link>
              </li>
              <li className="nav-header">Document Menu</li>
              <li className="nav-item">
                <Link to="/Admingovernan" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Guides & Rules</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Admindocread" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>One Report</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminfinanstates" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Financials</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminanalysis" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Presentation </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminreportmuser" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Meeting Reports</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminmeetinguser" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Shareholder Meetings</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Admindetailgeneration" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Management Details</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminpolicypayment" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Policypayment</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminpropose" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Proposeagenda</p>
                </Link>
              </li>
              <li className="nav-header">General Menu</li>
              <li className="nav-item">
                <Link to="/Adminevent" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Events</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminholder" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Shareholders</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminthreeyear" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Threeyear</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Adminquarter" className="nav-link">
                  <i className="fas fa-circle nav-icon" style={{ fontSize: "0.5rem", marginRight: "8px" }}></i>
                  <p>Quarter</p>
                </Link>
              </li>
              
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
