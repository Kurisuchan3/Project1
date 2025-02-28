import React from "react";
import "../../sass/components/_topnav.scss";
import logo from "../../../public/images/logo.png";
import { Input, Button } from "antd";
import { SearchOutlined, UserOutlined, ShoppingCartOutlined, BellOutlined } from "@ant-design/icons";

const { Search } = Input;

const TopNav = () => {
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
          <UserOutlined />
          <ShoppingCartOutlined />
          <BellOutlined />
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
