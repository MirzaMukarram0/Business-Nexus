import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { getRequests, updateRequestStatus } from '../services/api';
import "./EntrepreneurDashboard.css";

const EntrepreneurDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRequests().then(res => {
      setRequests(res.data);
      setLoading(false);
    });
  }, []);

  const handleAction = (id, status) => {
    updateRequestStatus(id, status).then(() => {
      setRequests(reqs => reqs.map(r => r._id === id ? { ...r, status } : r));
    });
  };

  return (
    <DashboardLayout>
      <div className="bnx-dashboard-root">
        <h2 className="bnx-dashboard-title">Collaboration Requests</h2>
        <div className="bnx-dashboard-list">
          {loading ? <div>Loading...</div> : requests.map(r => (
            <Card key={r._id} className="bnx-card-dashboard">
              <div className="bnx-card-header">
                <span className="bnx-card-title">{r.investor?.name || 'Investor'}</span>
                <span className="bnx-card-subtitle">{r.investor?.bio || ''}</span>
              </div>
              <div className="bnx-card-body">Status: <b>{r.status}</b></div>
              {r.status === "Pending" && (
                <div style={{ marginTop: 12 }}>
                  <Button className="bnx-btn-gradient bnx-btn-md" style={{ marginRight: 8 }} onClick={() => handleAction(r._id, 'Accepted')}>Accept</Button>
                  <Button className="bnx-btn-md" style={{ background: '#eee', color: '#333' }} onClick={() => handleAction(r._id, 'Rejected')}>Reject</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EntrepreneurDashboard; 