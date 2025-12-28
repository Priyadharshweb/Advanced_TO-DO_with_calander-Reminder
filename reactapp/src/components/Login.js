import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationBar from "./NavigationBar";
const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔗 Make sure this URL matches your backend login endpoint
      const res = await axios.post("http://localhost:8080/api/auth/login", formData);

      if (res.status === 200) {
        const { token, role, id, name, email } = res.data;

        // ✅ Save JWT and user data to localStorage
        localStorage.setItem("jwt", token);
        localStorage.setItem("role", role);
        localStorage.setItem("currentUser", JSON.stringify({ id, name, email, role }));

        alert("Login successful!");

        // 🔄 Redirect user based on their role
        if (role) {
          switch (role.toUpperCase()) {
            case "ADMIN":
              navigate("/adminPage");
              break;
            case "USER":
              navigate("/userHome");
              break;
            default:
              alert("Unknown role");
          }
        } else {
          alert("Role not found in response");
        }
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <>
    <NavigationBar/>
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-group password-container">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span 
              className="toggle-password" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️🗨️'}
            </span>
          </div>



          {/* Login Button */}
          <button type="submit" className="login-btn">
            LOGIN
          </button>
        </form>

        {/* Navigation Links */}
        <p className="register-link">
          Don’t have an account? <a href="/register">REGISTER</a>
        </p>
        <p className="forgot-password">Forgot your password?</p>
      </div>
    </div>
    </>
  );
};

export default Login;
