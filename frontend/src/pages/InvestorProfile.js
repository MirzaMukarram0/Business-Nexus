import React from "react";
import Card from "../components/Card";
import "./InvestorProfile.css";

const mockProfile = {
  name: "Jane Doe",
  bio: "Investor with a focus on fintech and AI startups.",
  interests: "Fintech, AI, SaaS",
  portfolio: ["FinBank", "HealthSync", "EduPro"]
};

const InvestorProfile = () => (
  <div className="bnx-profile-root">
    <Card className="bnx-card-profile">
      <h2 className="bnx-profile-title">{mockProfile.name}</h2>
      <div className="bnx-profile-section"><b>Bio:</b> {mockProfile.bio}</div>
      <div className="bnx-profile-section"><b>Investment Interests:</b> {mockProfile.interests}</div>
      <div className="bnx-profile-section"><b>Portfolio Companies:</b> {mockProfile.portfolio.join(", ")}</div>
    </Card>
  </div>
);

export default InvestorProfile; 