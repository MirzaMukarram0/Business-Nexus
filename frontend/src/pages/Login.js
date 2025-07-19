import React, { useState } from "react";
import Card from "../components/Card";
import InputField from "../components/InputField";
import Button from "../components/Button";
import "./Login.css";

const validateEmail = (email) => {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required.";
    else if (!validateEmail(form.email)) newErrors.email = "Invalid email format.";
    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ email: true, password: true });
    if (Object.keys(validationErrors).length === 0) {
      // TODO: Implement login logic
      alert("Login successful (mock)");
    }
  };

  return (
    <div className="bnx-login-root">
      <Card className="bnx-card-login">
        <h2 className="bnx-login-title">Login to Business Nexus</h2>
        <form className="bnx-form" onSubmit={handleSubmit} noValidate>
          <InputField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
            required
          />
          {touched.email && errors.email && (
            <div className="bnx-error">{errors.email}</div>
          )}
          <InputField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="current-password"
            required
          />
          {touched.password && errors.password && (
            <div className="bnx-error">{errors.password}</div>
          )}
          <Button type="submit" className="bnx-btn-gradient bnx-btn-lg">
            Login
          </Button>
        </form>
        <div className="bnx-login-footer">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </Card>
    </div>
  );
};

export default Login; 