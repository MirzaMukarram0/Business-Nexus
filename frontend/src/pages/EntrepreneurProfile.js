import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { useParams } from 'react-router-dom';
import { getProfile } from '../services/api';
import api from '../services/api';
import "./EntrepreneurProfile.css";

const EntrepreneurProfile = () => {
  const { id } = useParams();
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
              style={{ background: '#7f9cf5', color: 'white', padding: '4px 12px' }}
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
                rows={4}
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
        <section className="bnx-about-section">
          <div className="bnx-container">
            <div className="bnx-row bnx-align-items-center">
              <div className="bnx-col-lg-6">
                <div className="bnx-about-avatar">
                  <div className="bnx-profile-avatar-placeholder">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'E'}
                  </div>
                </div>
              </div>
              <div className="bnx-col-lg-6">
                <div className="bnx-about-text">
                  <h3 className="bnx-dark-color">About Me</h3>
                  <h6 className="bnx-theme-color bnx-lead">Entrepreneur & Startup Founder</h6>
                  <p>
                    I <mark>innovate and build</mark> solutions that address real-world problems, 
                    specializing in creating scalable business models and disruptive technologies. 
                    My passion is to transform ideas into successful ventures that make a positive impact.
                  </p>
                  <div className="bnx-row bnx-about-list">
                    <div className="bnx-col-md-6">
                      <div className="bnx-media">
                        <label>Name</label>
                        <p>{profile.name || 'Not specified'}</p>
                      </div>
                      <div className="bnx-media">
                        <label>Startup</label>
                        <p>{profile.startup || 'Not specified'}</p>
                      </div>
                      <div className="bnx-media">
                        <label>Funding Need</label>
                        <p>{profile.fundingNeed || 'Not specified'}</p>
                      </div>
                      <div className="bnx-media">
                        <label>Location</label>
                        <p>Global</p>
                      </div>
                    </div>
                    <div className="bnx-col-md-6">
                      <div className="bnx-media">
                        <label>E-mail</label>
                        <p>{profile.email || 'Not specified'}</p>
                      </div>
                      <div className="bnx-media">
                        <label>Phone</label>
                        <p>{profile.phone || 'Not specified'}</p>
                      </div>
                      <div className="bnx-media">
                        <label>Experience</label>
                        <p>5+ Years</p>
                      </div>
                      <div className="bnx-media">
                        <label>Status</label>
                        <p>Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Card className="bnx-profile-card">
          <div className="bnx-profile-content">
            {renderField('bio', 'Bio', 'textarea')}
            {renderField('startupDescription', 'Startup Description', 'textarea')}
            {renderField('pitchDeck', 'Pitch Deck Link')}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EntrepreneurProfile; 