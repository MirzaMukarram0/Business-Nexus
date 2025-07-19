import React from "react";
import "./Button.css";

const Button = ({ children, className = "", ...props }) => (
  <button className={`bnx-btn ${className}`} {...props}>{children}</button>
);

export default Button; 