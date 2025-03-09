import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../sass/components/_login.scss";
import TopNav from "../topnav";
import logo from "../../../../public/images/logo.png";
import { Input, Button, message } from "antd";
import axios from "axios";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // 🔥 Prevent multiple login attempts
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (loading) return; // 🔥 Prevent multiple clicks
    setLoading(true);

    try {
      const response = await axios.post("/api/login", credentials);

      if (!response.data.token) {
        throw new Error("Authentication token not received.");
      }

      // ✅ Store Bearer Token securely
      const token = `Bearer ${response.data.token}`;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", response.data.user.roles_id);

      // ✅ Set Axios Default Authorization Header
      axios.defaults.headers.common["Authorization"] = token;

      message.success("Login successful!");

      // ✅ Redirect based on role
      navigate(response.data.user.roles_id === 1 ? "/admindashboard" : "/userlandingpage");
    } catch (error) {
      console.error("Login failed", error);
      message.error(error.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false); // 🔥 Allow login attempts again
    }
  };

  return (
    <div className="login-page">
      <TopNav />
      <div className="login-container">
        <div className="login-logo">
          <img src={logo} alt="Lapnix Logo" width={200} />
        </div>
        <div className="login-form">
          <h2>Greetings!</h2>
          <h3>Please Login to continue</h3>
          <label>Email</label>
          <Input type="email" name="email" placeholder="Enter your email" onChange={handleChange} />
          <label>Password</label>
          <Input.Password name="password" placeholder="Enter your password" onChange={handleChange} />
          <Button type="primary" className="login-button" onClick={handleLogin} loading={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <p>Don't have an account? <a href="/register" className="signup-link">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
