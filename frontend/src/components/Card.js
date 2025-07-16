import React from "react";

const Card = ({ children }) => (
  <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
    {children}
  </div>
);

export default Card; 