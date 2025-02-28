import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../components/login/login";
import Register from "../components/register/register";
import Inventory from "../components/inventory/inventory";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default route: Login */}
        <Route path="register" element={<Register />} /> {/* Register page */}
        <Route path="inventory" element={<Inventory />} /> {/* Inventory page */}
      </Routes>
    </Router>
  );
}

if (document.getElementById("root")) {
  ReactDOM.render(<Routers />, document.getElementById("root"));
}