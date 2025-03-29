import React from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../../../sass/components/registerpage.scss';

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Form values:", values); // ✅ Debug payload
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", values);
      console.log("Registration response:", response.data); // ✅ Debug response
      message.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Registration error:", error.response?.data); // ✅ Debug error
      message.error(error.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Register</h2>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ roles_id: 2 }} // Set default role to Customer
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item name="roles_id" initialValue={2} hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
          <div className="login-link">
            Already have an account?{" "}
            <Link to="/login">
              Log in here
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;