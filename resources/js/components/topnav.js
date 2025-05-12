import React from "react";
import "../../sass/components/_topnav.scss";
import logo from "../../../public/images/lapnixlogo.svg";
import {
  Input,
  Button,
  Dropdown,
  Menu,
  message,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  BellOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Search } = Input;

const TopNav = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");

      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");

      message.success("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      message.error("Logout failed. Please try again.");
    }
  };

  const isAuthenticated = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <a href="/profile">Profile</a>
      </Menu.Item>
      <Menu.Item
        key="logout"
        onClick={handleLogout}
        icon={<LogoutOutlined />}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="topnav">
      <div className="logo">
        <img src={logo} alt="Lapnix Logo" width={100} />
      </div>

      <div className="search-bar">
        <Search
          placeholder="Search product here..."
          enterButton={<Button icon={<SearchOutlined />} />}
          size="large"
          style={{ maxWidth: "400px", width: "100%" }}
        />
      </div>

      <div className="nav-right">
        {isAuthenticated && (
          <span className="username-inline">Welcome, {userName}</span>
        )}
        <div className="nav-icons">
          <ShoppingCartOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
          <BellOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
          {isAuthenticated ? (
            <Dropdown overlay={userMenu} placement="bottomRight">
              <UserOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
