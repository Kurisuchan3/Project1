import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/login/login";
import Register from "../components/register/register";
import Inventory from "../components/inventory/inventory";
import Admindashboard from "../components/admindashboard/admindashboard";
import UserLandingPage from "../components/user-landingpage/userlandingpage";

// 🔥 Auth Wrapper Component to Protect Routes
const ProtectedRoute = ({ element, allowedRoles }) => {
  const authToken = localStorage.getItem("authToken");
  const userRole = parseInt(localStorage.getItem("userRole"));

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/userlandingpage" replace />;
  }

  return element;
};

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="inventory" element={<ProtectedRoute element={<Inventory />} allowedRoles={[1]} />} />
        <Route path="admindashboard" element={<ProtectedRoute element={<Admindashboard />} allowedRoles={[1]} />} />
        <Route path="userlandingpage" element={<ProtectedRoute element={<UserLandingPage />} allowedRoles={[2]} />} />
      </Routes>
    </Router>
  );
}

if (document.getElementById("root")) {
  ReactDOM.render(<Routers />, document.getElementById("root"));
}
