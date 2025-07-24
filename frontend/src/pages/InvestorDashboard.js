import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { sendRequest } from '../services/api';
import { useNavigate } from 'react-router-dom';
import "./InvestorDashboard.css";

const InvestorDashboard = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Replace with real API call to fetch entrepreneurs
    setEntrepreneurs([
      { _id: '1', name: 'Alice Smith', startup: 'GreenTech', pitch: 'Revolutionizing renewable energy for urban homes.' },
      { _id: '2', name: 'Bob Lee', startup: 'HealthSync', pitch: 'AI-powered health monitoring for seniors.' }
    ]);
    setLoading(false);
  }, []);

  const handleRequest = (entrepreneurId) => {
    sendRequest({ entrepreneurId }).then(() => {
      alert('Request sent!');
    });
  };

  const handleMessage = (entrepreneurId) => {
    navigate(`/chat/${entrepreneurId}`);
  };

  return (
    <DashboardLayout>
      <div className="bnx-dashboard-root">
        <h2 className="bnx-dashboard-title">Entrepreneurs</h2>
        <div className="bnx-dashboard-list">
          {loading ? <div>Loading...</div> : entrepreneurs.map(e => (
            <Card key={e._id} className="bnx-card-dashboard">
              <div className="bnx-card-header">
                <span className="bnx-card-title">{e.name}</span>
                <span className="bnx-card-subtitle">{e.startup}</span>
              </div>
              <div className="bnx-card-body">{e.pitch}</div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <Button className="bnx-btn-gradient bnx-btn-md" onClick={() => handleMessage(e._id)}>Message</Button>
                <Button className="bnx-btn-md" style={{ background: '#eee', color: '#333' }} onClick={() => handleRequest(e._id)}>Request</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvestorDashboard; 