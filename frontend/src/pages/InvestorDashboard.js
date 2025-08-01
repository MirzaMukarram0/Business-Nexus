import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { sendRequest, getConversations } from '../services/api';
import api from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import "./InvestorDashboard.css";

const InvestorDashboard = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [entrepreneurRequests, setEntrepreneurRequests] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    industry: '',
    fundingAmount: '',
    location: ''
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'entrepreneurs';

  useEffect(() => {
    api.get('/entrepreneurs').then(res => {
      setEntrepreneurs(res.data);
      setLoading(false);
    });
    
    // Load conversations
    getConversations().then(res => {
      setConversations(res.data);
    }).catch(err => {
      console.error('Error loading conversations:', err);
    });

    // Load entrepreneur requests
    loadEntrepreneurRequests();
  }, []);

  const loadEntrepreneurRequests = async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.industry) params.append('industry', filters.industry);
      if (filters.fundingAmount) params.append('fundingAmount', filters.fundingAmount);
      if (filters.location) params.append('location', filters.location);
      
      const response = await api.get(`/entrepreneur-requests?${params.toString()}`);
      setEntrepreneurRequests(response.data);
    } catch (err) {
      console.error('Error loading entrepreneur requests:', err);
    }
  };

  const handleSearch = () => {
    loadEntrepreneurRequests(searchFilters);
  };

  const handleRequest = (entrepreneurId) => {
    const investorId = localStorage.getItem('userId');
    sendRequest({ investorId, entrepreneurId }).then(() => {
      alert('Request sent!');
    });
  };

  const handleMessage = (entrepreneurId) => {
    navigate(`/chat/${entrepreneurId}`);
  };

  const handleInvest = (requestId) => {
    // Handle investment logic here
    alert('Investment request sent!');
  };

  return (
    <DashboardLayout>
      <div className="bnx-dashboard-root">
        {activeTab === 'entrepreneurs' && (
          <>
            <h2 className="bnx-dashboard-title">Entrepreneurs</h2>
            <div className="bnx-dashboard-list">
              {loading ? <div>Loading...</div> : entrepreneurs.length > 0 ? entrepreneurs.map(e => (
            <Card key={e._id} className="bnx-card-dashboard">
              <div className="bnx-card-header">
                <span className="bnx-card-title">{e.name}</span>
                <span className="bnx-card-subtitle">{e.startup}</span>
              </div>
              <div className="bnx-card-body">
                <div><b>Startup Description:</b> {e.startupDescription}</div>
                <div><b>Entrepreneur ID:</b> {e._id}</div>
                <div><b>Startup:</b> {e.startup}</div>
                <div><b>Bio:</b> {e.bio || 'No bio available'}</div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <Button className="bnx-btn-gradient bnx-btn-md" onClick={() => handleMessage(e._id)}>Message</Button>
                <Button className="bnx-btn-md" style={{ background: '#eee', color: '#333' }} onClick={() => handleRequest(e._id)}>Request</Button>
              </div>
            </Card>
                        )) : <div>No entrepreneurs found.</div>}
            </div>
          </>
        )}

        {activeTab === 'requests' && (
          <>
            <h2 className="bnx-dashboard-title">Investment Requests</h2>
            
            {/* Search Filters */}
            <div style={{ 
              background: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              display: 'flex',
              gap: '15px',
              flexWrap: 'wrap',
              alignItems: 'end'
            }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <InputField
                  value={searchFilters.industry}
                  onChange={e => setSearchFilters({...searchFilters, industry: e.target.value})}
                  placeholder="Search by Industry"
                />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <InputField
                  value={searchFilters.fundingAmount}
                  onChange={e => setSearchFilters({...searchFilters, fundingAmount: e.target.value})}
                  placeholder="Max Funding Amount (USD)"
                  type="number"
                />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <InputField
                  value={searchFilters.location}
                  onChange={e => setSearchFilters({...searchFilters, location: e.target.value})}
                  placeholder="Search by Location"
                />
              </div>
              <Button 
                className="bnx-btn-gradient bnx-btn-md" 
                onClick={handleSearch}
                style={{ minWidth: '100px' }}
              >
                Search
              </Button>
            </div>

            <div className="bnx-dashboard-list">
              {entrepreneurRequests.length > 0 ? entrepreneurRequests.map(request => (
                <Card key={request._id} className="bnx-card-dashboard">
                  <div className="bnx-card-header">
                    <span className="bnx-card-title">{request.title}</span>
                    <span className="bnx-card-subtitle">
                      {request.entrepreneur?.name} • {request.entrepreneur?.startup}
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
                      <div><b>Status:</b> {request.status}</div>
                      <div><b>Created:</b> {new Date(request.createdAt).toLocaleString()}</div>
                      <div><b>Entrepreneur:</b> {request.entrepreneur?.name} ({request.entrepreneur?.startup})</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <Button 
                      className="bnx-btn-gradient bnx-btn-md" 
                      onClick={() => handleInvest(request._id)}
                    >
                      Invest
                    </Button>
                    <Button 
                      className="bnx-btn-md" 
                      style={{ background: '#eee', color: '#333' }}
                      onClick={() => handleMessage(request.entrepreneur._id)}
                    >
                      Message
                    </Button>
                  </div>
                </Card>
              )) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  <p>No investment requests found.</p>
                  <p>Try adjusting your search filters.</p>
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
                  <p>Click on any "Message" button to start a conversation.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'portfolio' && (
          <>
            <h2 className="bnx-dashboard-title">My Portfolio</h2>
            <div className="bnx-dashboard-list">
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                <p>Portfolio management features coming soon.</p>
                <p>Track your investments and performance metrics here.</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            <h2 className="bnx-dashboard-title">Analytics Dashboard</h2>
            <div className="bnx-dashboard-list">
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                <p>Analytics and reporting features coming soon.</p>
                <p>View detailed insights about your investment activities.</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            <h2 className="bnx-dashboard-title">Settings</h2>
            <div className="bnx-dashboard-list">
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                <p>Settings and preferences coming soon.</p>
                <p>Manage your account settings and preferences here.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InvestorDashboard;