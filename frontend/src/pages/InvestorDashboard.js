import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import "./InvestorDashboard.css";

const mockEntrepreneurs = [
  {
    id: 1,
    name: "Alice Smith",
    startup: "GreenTech",
    pitch: "Revolutionizing renewable energy for urban homes."
  },
  {
    id: 2,
    name: "Bob Lee",
    startup: "HealthSync",
    pitch: "AI-powered health monitoring for seniors."
  }
];

const InvestorDashboard = () => (
  <DashboardLayout>
    <div className="bnx-dashboard-root">
      <h2 className="bnx-dashboard-title">Entrepreneurs</h2>
      <div className="bnx-dashboard-list">
        {mockEntrepreneurs.map(e => (
          <Card key={e.id} className="bnx-card-dashboard">
            <div className="bnx-card-header">
              <span className="bnx-card-title">{e.name}</span>
              <span className="bnx-card-subtitle">{e.startup}</span>
            </div>
            <div className="bnx-card-body">{e.pitch}</div>
            <Button className="bnx-btn-gradient bnx-btn-md" style={{ marginTop: 12 }}>
              Message / Request
            </Button>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default InvestorDashboard; 