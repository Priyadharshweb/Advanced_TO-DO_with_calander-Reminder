import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Register.css';
import NavigationBar from "./NavigationBar";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Try public registration endpoint first
      const res = await axios.post('http://localhost:8080/api/auth/register', formData);
      alert('User registered successfully');
      navigate("/login");
    } catch (error) {
      // Fallback to users endpoint without auth headers
      try {
        const res = await axios.post('http://localhost:8080/api/users', formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        alert('User registered successfully');
        navigate("/login");
      } catch (fallbackError) {
        console.error("Registration failed:", fallbackError.response?.data || fallbackError.message);
        alert('Registration failed. Please try again.');
      }
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <>
    <NavigationBar/>
    <div className="register-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email ID</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>

        <div className="form-group password-container">
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleChange}
            required
          />
          <span 
            className="toggle-password" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </span>
        </div>

        <div className="form-group">
          <label>Select Role</label>
          <select name="role" onChange={handleChange} required>
            <option value="" disabled selected>
              Select your role
            </option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div>

        <button type="submit" className="register-btn">
          Register
        </button>
      </form>

      <div className="login-link">
        Already have an account?{" "}
        <a href="/login" onClick={handleLogin}>Login</a>
      </div>
    </div>
    </>
  );
};

export default Register;
