import React from "react";
import "../../sass/components/_topnav.scss";
import logo from "../../../public/images/logo.png";
import { Input, Button, Dropdown, Menu, message } from "antd";
import { SearchOutlined, UserOutlined, ShoppingCartOutlined, BellOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Search } = Input;

const TopNav = () => {
  const navigate = useNavigate();

  // 🔥 Logout function (Reverted to Session-based Auth)
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");

      // ✅ Clear session-based auth
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");

      message.success("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      message.error("Logout failed. Please try again.");
    }
  };

  // 🔥 Check authentication state
  const isAuthenticated = localStorage.getItem("authToken");
  const userRole = parseInt(localStorage.getItem("userRole"), 10);

  // 🔥 User Menu Dropdown
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <a href="/profile">Profile</a>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <nav className="topnav">
        <div className="logo">
          <img src={logo} alt="Lapnix Logo" width={100} />
        </div>
        <div className="search-bar">
          <Search placeholder="Search product here..." enterButton={<Button icon={<SearchOutlined />} />} />
        </div>
        <div className="nav-icons">
          <ShoppingCartOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
          <BellOutlined style={{ fontSize: "18px", cursor: "pointer" }} />

          {isAuthenticated ? (
            <Dropdown overlay={userMenu} placement="bottomRight">
              <UserOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate("/login")}>Login</Button>
          )}
        </div>
      </nav>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/brands">Brands</a>
        <a href="/peripherals">Peripherals</a>
        <a href="/support">Support</a>
        <a href="/about">About Us</a>
      </div>
    </>
  );
};

export default TopNav;
