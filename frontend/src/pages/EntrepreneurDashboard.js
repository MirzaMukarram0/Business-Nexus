import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import { getRequests, updateRequestStatus, getConversations } from '../services/api';
import api from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import "./EntrepreneurDashboard.css";

const EntrepreneurDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [postedRequests, setPostedRequests] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'requests';

  useEffect(() => {
    getRequests().then(res => {
      const userId = localStorage.getItem('userId');
      console.log('API response:', res.data);
      // Filter requests where the current user is the entrepreneur (received requests)
      const receivedRequests = res.data.filter(r =>
        r.entrepreneur && String(r.entrepreneur._id) === String(userId) && !r.sentByMe
      );
      setRequests(receivedRequests);
      setLoading(false);
    });
    
    // Load conversations
    getConversations().then(res => {
      setConversations(res.data);
    }).catch(err => {
      console.error('Error loading conversations:', err);
    });

    // Load posted requests
    loadPostedRequests();
  }, []);

  const loadPostedRequests = async () => {
    try {
      const response = await api.get('/entrepreneur-requests');
      const userId = localStorage.getItem('userId');
      // Filter requests posted by the current entrepreneur
      const myRequests = response.data.filter(r => 
        String(r.entrepreneur._id) === String(userId)
      );
      setPostedRequests(myRequests);
    } catch (err) {
      console.error('Error loading posted requests:', err);
    }
  };

  const handleAction = (id, status) => {
    updateRequestStatus(id, status).then(() => {
      setRequests(reqs => reqs.map(r => r._id === id ? { ...r, status } : r));
    });
  };

  const handleMessage = (investorId) => {
    navigate(`/chat/${investorId}`);
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await api.delete(`/entrepreneur-requests/${requestId}`);
        setPostedRequests(prev => prev.filter(r => r._id !== requestId));
        alert('Request deleted successfully');
      } catch (err) {
        console.error('Error deleting request:', err);
        alert('Failed to delete request');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="bnx-dashboard-root">
        {/* Analytics Dashboard - Only show on requests tab */}
        {activeTab === 'requests' && (
          <AnalyticsDashboard />
        )}
        
        {activeTab === 'requests' && (
          <>
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
                <div><b>Status:</b> {r.status}</div>
                <div><b>Request ID:</b> {r._id}</div>
                <div><b>Created At:</b> {new Date(r.createdAt).toLocaleString()}</div>
                <div><b>Investor:</b> {r.investor?.name || r.investorId}</div>
                <div><b>Entrepreneur:</b> {r.entrepreneur?.name || r.entrepreneurId}</div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                {!r.sentByMe && r.status === "Pending" && (
                  <>
                    <Button className="bnx-btn-gradient bnx-btn-md" onClick={() => handleAction(r._id, 'Accepted')}>Accept</Button>
                    <Button className="bnx-btn-md" style={{ background: '#eee', color: '#333' }} onClick={() => handleAction(r._id, 'Rejected')}>Reject</Button>
                    <Button className="bnx-btn-md" style={{ background: '#4CAF50', color: 'white' }} onClick={() => handleMessage(r.investor._id)}>Message</Button>
                  </>
                )}
                {!r.sentByMe && r.status !== "Pending" && (
                  <Button className="bnx-btn-md" style={{ background: '#4CAF50', color: 'white' }} onClick={() => handleMessage(r.investor._id)}>Message</Button>
                )}
                {r.sentByMe && (
                  <div style={{ marginTop: 12, color: '#7f9cf5', fontSize: '0.95rem' }}>
                    (You sent this request)
                  </div>
                )}
              </div>
            </Card>
                        )) : <div>No requests found.</div>}
            </div>
          </>
        )}

        {activeTab === 'posted' && (
          <>
            <h2 className="bnx-dashboard-title">My Posted Requests</h2>
            <div className="bnx-dashboard-list">
              {postedRequests.length > 0 ? postedRequests.map(request => (
                <Card key={request._id} className="bnx-card-dashboard">
                  <div className="bnx-card-header">
                    <span className="bnx-card-title">{request.title}</span>
                    <span className="bnx-card-subtitle">
                      Status: <b>{request.status}</b> • Posted {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="bnx-card-body">
                    <p style={{ margin: '0 0 10px 0' }}>{request.description}</p>
                    <div style={{ 
                      display: 'flex', 
                      gap: '15px', 
                      marginBottom: '10px',
                      flexWrap: 'wrap'
                    }}>
                      {request.industry && (
                        <span style={{ 
                          background: '#e3f2fd', 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: '#1976d2'
                        }}>
                          {request.industry}
                        </span>
                      )}
                      {request.fundingAmount && (
                        <span style={{ 
                          background: '#e8f5e8', 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: '#2e7d32'
                        }}>
                          ${Number(request.fundingAmount).toLocaleString()}
                        </span>
                      )}
                      {request.location && (
                        <span style={{ 
                          background: '#fff3e0', 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: '#f57c00'
                        }}>
                          {request.location}
                        </span>
                      )}
                    </div>
                    {request.requirements && (
                      <p style={{ 
                        margin: '10px 0 0 0', 
                        fontSize: '14px', 
                        color: '#666',
                        fontStyle: 'italic'
                      }}>
                        <strong>Requirements:</strong> {request.requirements}
                      </p>
                    )}
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
                      <div><b>Request ID:</b> {request._id}</div>
                      <div><b>Created:</b> {new Date(request.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <Button 
                      className="bnx-btn-md" 
                      style={{ background: '#4CAF50', color: 'white' }}
                      onClick={() => navigate('/post-request')}
                    >
                      Edit Request
                    </Button>
                    <Button 
                      className="bnx-btn-md" 
                      style={{ background: '#f44336', color: 'white' }}
                      onClick={() => handleDeleteRequest(request._id)}
                    >
                      Delete Request
                    </Button>
                  </div>
                </Card>
              )) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  <p>No posted requests found.</p>
                  <p>Click the button below to post your first investment request.</p>
                  <Button 
                    className="bnx-btn-gradient bnx-btn-md" 
                    onClick={() => navigate('/post-request')}
                    style={{ marginTop: '10px' }}
                  >
                    Post New Request
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
        
        {activeTab === 'messages' && (
          <>
            <h2 className="bnx-dashboard-title">Recent Conversations</h2>
            <div className="bnx-dashboard-list">
              {conversations.length > 0 ? conversations.map(conv => (
                <Card key={conv.partnerId} className="bnx-card-dashboard">
                  <div className="bnx-card-header">
                    <span className="bnx-card-title">{conv.partnerName}</span>
                    <span className="bnx-card-subtitle">
                      {new Date(conv.lastMessageTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="bnx-card-body">
                    <p style={{ margin: '0 0 10px 0', color: '#666' }}>
                      {conv.lastMessage.length > 50 ? 
                        conv.lastMessage.substring(0, 50) + '...' : 
                        conv.lastMessage
                      }
                    </p>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Button 
                      className="bnx-btn-gradient bnx-btn-md" 
                      onClick={() => handleMessage(conv.partnerId)}
                    >
                      Open Chat
                    </Button>
                  </div>
                </Card>
              )) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  <p>No conversations yet.</p>
                  <p>Click on any "Message" button in the requests section to start a conversation.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EntrepreneurDashboard;