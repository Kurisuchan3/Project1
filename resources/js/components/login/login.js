import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const from = location.state?.from || '/homepagecontent';
  const guestCart = location.state?.cartItems || [];

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    if (token) {
      axios
        .get("/api/user", { headers: { Authorization: token } })
        .then((response) => {
          if (isMounted) {
            const role = parseInt(userRole, 10);
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
      const token = `Bearer ${response.data.token}`;
      localStorage.setItem("authToken", token);
      const role = parseInt(response.data.user.roles_id, 10);
      localStorage.setItem("userRole", role);

      axios.defaults.headers.common["Authorization"] = token;

      // Sync guest cart with backend
      if (guestCart.length > 0) {
        try {
          console.log("Attempting to sync guest cart:", guestCart);
          console.log("Using token:", token);
          const syncResponse = await axios.post('/api/cart/sync', { cart: guestCart }, {
            headers: { Authorization: token }
          });
          console.log("Sync response:", syncResponse.data);
          localStorage.removeItem('guestCart');
          message.success("Guest cart synced successfully!");
          navigate('/cartview');
        } catch (syncError) {
          console.error("Guest cart sync failed:", syncError.response?.data || syncError.message);
          message.warning("Logged in successfully, but failed to sync guest cart.");
          navigate(role === 1 ? "/admindashboard" : "/homepagecontent");
        }
      } else {
        message.success("Login successful!");
        navigate(role === 1 ? "/admindashboard" : "/homepagecontent");
      }
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