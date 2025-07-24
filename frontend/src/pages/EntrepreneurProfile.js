import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useParams } from 'react-router-dom';
import { getProfile } from '../services/api';
import "./EntrepreneurProfile.css";

const EntrepreneurProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    getProfile(id, 'entrepreneur').then(res => setProfile(res.data));
  }, [id]);
  if (!profile) return <div>Loading...</div>;
  return (
    <div className="bnx-profile-root">
      <Card className="bnx-card-profile">
        <h2 className="bnx-profile-title">{profile.name}</h2>
        <div className="bnx-profile-section"><b>Bio:</b> {profile.bio}</div>
        <div className="bnx-profile-section"><b>Startup:</b> {profile.startup}</div>
        <div className="bnx-profile-section"><b>Description:</b> {profile.startupDescription}</div>
        <div className="bnx-profile-section"><b>Funding Need:</b> {profile.fundingNeed}</div>
        <div className="bnx-profile-section"><b>Pitch Deck:</b> <span style={{ color: '#888' }}>{profile.pitchDeck || '[Upload/Link Placeholder]'}</span></div>
      </Card>
    </div>
  );
};

export default EntrepreneurProfile; 