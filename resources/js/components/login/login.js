import React from "react";
import "../../../sass/components/_login.scss";
import TopNav from "../topnav";
import logo from "../../../../public/images/logo.png";
import { Input, Button } from "antd";

const Login = () => {
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
          <Input type="email" placeholder="Enter your email" />
          <label>Password</label>
          <Input type="password" placeholder="Enter your password" />
          <a href="/forgot-password" className="forgot-password">Forgot password?</a>
          <Button type="primary" className="login-button">Login</Button>
          <p>Don't have an account? <a href="/signup" className="signup-link">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
