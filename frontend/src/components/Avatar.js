import React from "react";

const Avatar = ({ src, alt }) => (
  <img src={src} alt={alt} style={{ width: 40, height: 40, borderRadius: '50%' }} />
);

export default Avatar; 