import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useParams } from 'react-router-dom';
import { getProfile } from '../services/api';
import "./InvestorProfile.css";

const InvestorProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    getProfile(id).then(res => setProfile(res.data));
  }, [id]);
  if (!profile) return <div>Loading...</div>;
  return (
    <div className="bnx-profile-root">
      <Card className="bnx-card-profile">
        <h2 className="bnx-profile-title">{profile.name}</h2>
        <div className="bnx-profile-section"><b>Bio:</b> {profile.bio}</div>
        <div className="bnx-profile-section"><b>Investment Interests:</b> {profile.investmentInterests}</div>
        <div className="bnx-profile-section"><b>Portfolio Companies:</b> {(profile.portfolio || []).join(", ")}</div>
      </Card>
    </div>
  );
};

export default InvestorProfile; 