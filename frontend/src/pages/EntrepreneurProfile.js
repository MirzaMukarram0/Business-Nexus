import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { useParams, useNavigate } from 'react-router-dom';
import { getProfile } from '../services/api';
import api from '../services/api';
import "./EntrepreneurProfile.css";

const EntrepreneurProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [loading, setLoading] = useState(false);
  const currentUserId = localStorage.getItem('userId');
  const isOwnProfile = currentUserId === id;

  useEffect(() => {
    getProfile(id).then(res => {
      setProfile(res.data);
      setEditValues(res.data);
    });
  }, [id]);

  const handleEdit = (field) => {
    setEditing(field);
    setEditValues(prev => ({ ...prev, [field]: profile[field] }));
  };

  const handleSave = async (field) => {
    setLoading(true);
    try {
      const response = await api.patch(`/profile/${id}`, {
        [field]: editValues[field]
      });
      setProfile(response.data);
      setEditing(null);
      // Update localStorage if it's the current user's profile
      if (isOwnProfile && field === 'name') {
        localStorage.setItem('userName', response.data.name);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setEditValues(profile);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!profile) return (
    <DashboardLayout>
      <div className="bnx-profile-loading">Loading...</div>
    </DashboardLayout>
  );

  const renderField = (field, label, type = 'text') => {
    const isEditing = editing === field;
    
    return (
      <div className="bnx-profile-field">
        <div className="bnx-profile-field-header">
          <h3 className="bnx-profile-field-label">{label}</h3>
          {isOwnProfile && !isEditing && (
            <Button 
              className="bnx-btn-md" 
              style={{ 
                background: '#7f9cf5', 
                color: 'white', 
                padding: '6px 12px',
                fontSize: '0.85rem',
                minWidth: '60px'
              }}
              onClick={() => handleEdit(field)}
            >
              Edit
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <div className="bnx-profile-edit">
            {type === 'textarea' ? (
              <textarea
                value={editValues[field] || ''}
                onChange={(e) => setEditValues(prev => ({ ...prev, [field]: e.target.value }))}
                className="bnx-profile-textarea"
                rows={3}
              />
            ) : (
              <InputField
                value={editValues[field] || ''}
                onChange={(e) => setEditValues(prev => ({ ...prev, [field]: e.target.value }))}
                placeholder={label}
              />
            )}
            <div className="bnx-profile-edit-actions">
              <Button 
                className="bnx-btn-gradient bnx-btn-md" 
                onClick={() => handleSave(field)}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                className="bnx-btn-md" 
                style={{ background: '#eee', color: '#333' }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="bnx-profile-field-value">
            {profile[field] || 'Not specified'}
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="bnx-profile-container">
        <Card className="bnx-profile-card">
          <div className="bnx-profile-layout">
            {/* Left Side - Profile Picture */}
            <div className="bnx-profile-picture-section">
              <div className="bnx-profile-avatar">
                  <div className="bnx-profile-avatar-placeholder">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'E'}
                  </div>
                </div>
              </div>
            
            {/* Right Side - Profile Details */}
            <div className="bnx-profile-details-section">
              <div className="bnx-profile-header">
                <h2 className="bnx-profile-name">{profile.name}</h2>
                <p className="bnx-profile-role">Entrepreneur</p>
                      </div>
              
              <div className="bnx-profile-fields">
                {renderField('email', 'Email')}
                {renderField('bio', 'Bio', 'textarea')}
                {renderField('startup', 'Startup')}
                {renderField('startupDescription', 'Startup Description', 'textarea')}
                {renderField('fundingNeed', 'Funding Need')}
                {renderField('pitchDeck', 'Pitch Deck Link')}
                      </div>

              {/* Logout Section */}
              {isOwnProfile && (
                <div className="bnx-profile-logout-section">
                  <button 
                    className="bnx-profile-logout-button"
                    onClick={handleLogout}
                  >
                    Logout Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EntrepreneurProfile; 