import React from "react";
import Card from "../components/Card";
import "./EntrepreneurProfile.css";

const mockProfile = {
  name: "Alice Smith",
  bio: "Passionate entrepreneur in green energy.",
  startup: "GreenTech",
  description: "Developing affordable solar panels for urban homes.",
  funding: "$500,000",
  pitchDeck: null // Placeholder
};

const EntrepreneurProfile = () => (
  <div className="bnx-profile-root">
    <Card className="bnx-card-profile">
      <h2 className="bnx-profile-title">{mockProfile.name}</h2>
      <div className="bnx-profile-section"><b>Bio:</b> {mockProfile.bio}</div>
      <div className="bnx-profile-section"><b>Startup:</b> {mockProfile.startup}</div>
      <div className="bnx-profile-section"><b>Description:</b> {mockProfile.description}</div>
      <div className="bnx-profile-section"><b>Funding Need:</b> {mockProfile.funding}</div>
      <div className="bnx-profile-section"><b>Pitch Deck:</b> <span style={{ color: '#888' }}>[Upload/Link Placeholder]</span></div>
    </Card>
  </div>
);

export default EntrepreneurProfile; 