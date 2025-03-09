import React from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate(); // Redirect after registration

  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", values);
      message.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 sec
    } catch (error) {
      message.error(error.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter your username" }]}>
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Register</Button>
          </Form.Item>
        </Form>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-500">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
