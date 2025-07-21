import React from "react";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => (
  <div className="bnx-dashboard-layout">
    <nav className="bnx-dashboard-navbar">Navbar</nav>
    <div className="bnx-dashboard-content">
      <aside className="bnx-dashboard-sidebar">Sidebar</aside>
      <main className="bnx-dashboard-main">{children}</main>
    </div>
  </div>
);

export default DashboardLayout; 