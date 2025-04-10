import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopNav from "../topnav";
import AdminSideMenu from "../admin-sidemenu";
import "../../../sass/components/_AdminRegister.scss";

const AdminRegister = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Admin Register Form values:", values);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        ...values,
        roles_id: 1, // Force Admin role
      });
      console.log("Admin Registration response:", response.data);
      message.success("Admin account created successfully!");
      setTimeout(() => navigate("/admindashboard"), 2000); // Redirect to dashboard
    } catch (error) {
      console.error("Admin Registration error:", error.response?.data);
      message.error(error.response?.data?.error || "Failed to create admin account.");
    }
  };

  return (
    <div className="admin-register-page">
      <TopNav />
      <div style={{ display: "flex", marginTop: "110px" }}>
        <AdminSideMenu />
        <div className="register-content" style={{ flex: 1, padding: "20px" }}>
          <div className="register-container">
            <h2>Create New Admin Account</h2>
            <Form
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ roles_id: 1 }} // Set Admin role
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please enter a username" }]}
              >
                <Input placeholder="Enter username" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter a password", min: 8 }]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
              <Form.Item name="roles_id" initialValue={1} hidden>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Create Admin
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;