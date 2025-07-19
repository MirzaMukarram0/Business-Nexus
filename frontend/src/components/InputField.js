import React from "react";
import "./InputField.css";

const InputField = ({ label, className = "", ...props }) => (
  <div className="bnx-input-group">
    {label && <label className="bnx-label">{label}</label>}
    <input className={`bnx-input ${className}`} {...props} />
  </div>
);

export default InputField; 