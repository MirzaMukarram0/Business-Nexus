import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import "./EntrepreneurDashboard.css";

const mockRequests = [
  {
    id: 1,
    investor: "Jane Doe",
    profile: "Fintech specialist, 10+ years investing in startups.",
    status: "Pending"
  },
  {
    id: 2,
    investor: "Mike Chan",
    profile: "Healthcare VC, interested in AI/ML.",
    status: "Accepted"
  }
];

const EntrepreneurDashboard = () => (
  <DashboardLayout>
    <div className="bnx-dashboard-root">
      <h2 className="bnx-dashboard-title">Collaboration Requests</h2>
      <div className="bnx-dashboard-list">
        {mockRequests.map(r => (
          <Card key={r.id} className="bnx-card-dashboard">
            <div className="bnx-card-header">
              <span className="bnx-card-title">{r.investor}</span>
              <span className="bnx-card-subtitle">{r.profile}</span>
            </div>
            <div className="bnx-card-body">Status: <b>{r.status}</b></div>
            {r.status === "Pending" && (
              <div style={{ marginTop: 12 }}>
                <Button className="bnx-btn-gradient bnx-btn-md" style={{ marginRight: 8 }}>Accept</Button>
                <Button className="bnx-btn-md" style={{ background: '#eee', color: '#333' }}>Reject</Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default EntrepreneurDashboard; 