import React from "react";

const InputField = ({ label, ...props }) => (
  <div>
    {label && <label>{label}</label>}
    <input {...props} />
  </div>
);

export default InputField; 