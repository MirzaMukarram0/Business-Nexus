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
      const userId = localStorage.getItem('userId');
      console.log('API response:', res.data);
      // Debug: log each request's entrepreneur field
      res.data.forEach(r => {
        console.log('Request entrepreneur:', r.entrepreneur);
      });
      // Show all requests for this entrepreneur (remove !r.sentByMe filter)
      const receivedRequests = res.data.filter(r =>
        r.entrepreneur && String(r.entrepreneur._id) === String(userId)
      );
      setRequests(receivedRequests);
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
          {loading ? <div>Loading...</div> : Array.isArray(requests) && requests.length > 0 ? requests.map(r => (
            <Card key={r._id} className="bnx-card-dashboard">
              <div className="bnx-card-header">
                <span className="bnx-card-title">
                  {r.sentByMe
                    ? `To: ${r.entrepreneur?.name || 'Entrepreneur'}`
                    : `From: ${r.investor?.name || 'Investor'}`}
                </span>
                <span className="bnx-card-subtitle">
                  {r.sentByMe
                    ? r.entrepreneur?.bio || ''
                    : r.investor?.bio || ''}
                </span>
              </div>
              <div className="bnx-card-body">
                Status: <b>{r.status}</b>
              </div>
              {!r.sentByMe && r.status === "Pending" && (
                <div style={{ marginTop: 12 }}>
                  <Button className="bnx-btn-gradient bnx-btn-md" style={{ marginRight: 8 }} onClick={() => handleAction(r._id, 'Accepted')}>Accept</Button>
                  <Button className="bnx-btn-md" style={{ background: '#eee', color: '#333' }} onClick={() => handleAction(r._id, 'Rejected')}>Reject</Button>
                </div>
              )}
              {r.sentByMe && (
                <div style={{ marginTop: 12, color: '#7f9cf5', fontSize: '0.95rem' }}>
                  (You sent this request)
                </div>
              )}
            </Card>
          )) : <div>No requests found.</div>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EntrepreneurDashboard;