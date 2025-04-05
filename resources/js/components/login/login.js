import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../sass/components/_login.scss";
import TopNav from "../topnav";
import logo from "../../../../public/images/logo.png";
import { Input, Button, message } from "antd";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    if (token) {
      axios
        .get("/api/user", { headers: { Authorization: token } })
        .then((response) => {
          if (isMounted) {
            console.log("Token validated:", response.data);
            const role = parseInt(userRole, 10); // Parse userRole to integer
            navigate(role === 1 ? "/admindashboard" : "/homepagecontent");
          }
        })
        .catch((error) => {
          console.error("Token validation failed:", error.response?.data);
          if (isMounted) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userRole");
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post("/api/login", credentials);
      console.log("Login response:", response.data);

      if (!response.data.token) {
        throw new Error("Authentication token not received.");
      }

      const token = `Bearer ${response.data.token}`;
      localStorage.setItem("authToken", token);
      const role = parseInt(response.data.user.roles_id, 10); // Parse roles_id to integer
      localStorage.setItem("userRole", role);

      axios.defaults.headers.common["Authorization"] = token;

      message.success("Login successful!");
      navigate(role === 1 ? "/admindashboard" : "/homepagecontent");
    } catch (error) {
      console.error("Login failed:", error.response?.data);
      message.error(error.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
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
          <p>
            Don't have an account?{" "}
            <a href="/register" className="signup-link">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;