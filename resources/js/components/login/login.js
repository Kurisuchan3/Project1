import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../sass/components/_login.scss";
import TopNav from "../topnav";
import { Input, Button, message } from "antd";
import axios from "axios";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    if (token) {
      axios
        .get("/api/user", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          if (isMounted) {
            console.log("Token validated:", response.data);
            const role = parseInt(userRole, 10);
            navigate(role === 1 ? "/admindashboard" : "/homepagecontent");
          }
        })
        .catch((err) => {
          console.error("Token validation failed:", err.response?.data);
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
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
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

      const token = response.data.token; // Store raw token
      localStorage.setItem("authToken", token);

      const role = parseInt(response.data.user.roles_id, 10);
      localStorage.setItem("userRole", role);

      // Set default header for future calls
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      message.success("Login successful!");
      navigate(role === 1 ? "/admindashboard" : "/homepagecontent");
    } catch (err) {
      console.error("Login failed:", err.response?.data);
      message.error(
        err.response?.data?.error || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <TopNav />

      <div className="login-container">
        <div className="login-box">
          <div className="login-logo">
            <img src="/images/lapnixlogo.svg" alt="Lapnix Logo" />
          </div>

          <h2>Greetings!</h2>
          <h3>
            Please <span className="highlight">Login</span> to continue
          </h3>

          <label>Email</label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
          />

          <label>Password</label>
          <Input.Password
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
          />

          <Button
            type="primary"
            className="login-button"
            onClick={handleLogin}
            loading={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p>
            Don’t have an account?{" "}
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