import React from "react";
import "./Card.css";

const Card = ({ children, className = "" }) => (
  <div className={`bnx-card ${className}`}>
    {children}
  </div>
);

export default Card; 