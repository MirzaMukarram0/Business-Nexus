import React, { useState } from "react";
import Card from "../components/Card";
import InputField from "../components/InputField";
import Button from "../components/Button";
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import "./Register.css";

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  // At least 6 chars, 1 number, 1 letter
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
};

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required.";
    else if (!validateEmail(form.email)) newErrors.email = "Invalid email format.";
    if (!form.password) newErrors.password = "Password is required.";
    else if (!validatePassword(form.password)) newErrors.password = "Password must be at least 6 characters, include a letter and a number.";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!form.role) newErrors.role = "Please select a role.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ email: true, password: true, confirmPassword: true, role: true });
    if (Object.keys(validationErrors).length === 0) {
      try {
        await api.post('/auth/register', {
          name: form.email.split('@')[0], // Use part before @ as name for demo
          email: form.email,
          password: form.password,
          role: form.role.toLowerCase()
        });
        navigate('/login');
      } catch (err) {
        setApiError(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="bnx-register-root">
      <Card className="bnx-card-register">
        <h2 className="bnx-register-title">Register for Business Nexus</h2>
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
            autoComplete="new-password"
            required
          />
          {touched.password && errors.password && (
            <div className="bnx-error">{errors.password}</div>
          )}
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            required
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <div className="bnx-error">{errors.confirmPassword}</div>
          )}
          <div className="bnx-role-group">
            <label className="bnx-label">Role</label>
            <div className="bnx-role-options">
              <label className="bnx-role-option">
                <input
                  type="radio"
                  name="role"
                  value="Investor"
                  checked={form.role === "Investor"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                Investor
              </label>
              <label className="bnx-role-option">
                <input
                  type="radio"
                  name="role"
                  value="Entrepreneur"
                  checked={form.role === "Entrepreneur"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                Entrepreneur
              </label>
            </div>
            {touched.role && errors.role && (
              <div className="bnx-error">{errors.role}</div>
            )}
          </div>
          {apiError && <div className="bnx-error">{apiError}</div>}
          <Button type="submit" className="bnx-btn-gradient bnx-btn-lg">
            Register
          </Button>
        </form>
        <div className="bnx-register-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </Card>
    </div>
  );
};

export default Register; 