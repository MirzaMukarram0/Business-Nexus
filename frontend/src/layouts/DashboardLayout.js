import React from "react";

const DashboardLayout = ({ children }) => (
  <div>
    <nav style={{ background: '#eee', padding: 10 }}>Navbar</nav>
    <div style={{ display: 'flex' }}>
      <aside style={{ width: 200, background: '#f4f4f4', minHeight: '100vh' }}>Sidebar</aside>
      <main style={{ flex: 1, padding: 20 }}>{children}</main>
    </div>
  </div>
);

export default DashboardLayout; 