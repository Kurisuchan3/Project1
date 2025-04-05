import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/login/login";
import Register from "../components/register/register";
import Inventory from "../components/inventory/inventory";
import Admindashboard from "../components/admindashboard/admindashboard";
import HomepageContent from "./Homepage/homepage"; // Use HomepageContent
import UserTable from "../components/userslist/users_component/userstable";
import ProductPage from "./adminproducts/adminproducts";
import ProductDetails from "./userspage/selectedproduct";
import Profile from "../components/Profile"; 
import Shop_ui from "../components/ShopContent/Shop_UI";
import CartView from "./CartUI/cart_view";
import Payment from "./CheckoutUI/payment";
import Complete from "./OrderCompleteUI/complete"; // Import the complete component
import FooterContent from "./FooterContent/FooterContent"; // Import the FooterContent component


const ProtectedRoute = ({ element, allowedRoles }) => {
  const authToken = localStorage.getItem("authToken");
  const userRole = parseInt(localStorage.getItem("userRole"));

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/homepagecontent" replace />; // Redirect to homepagecontent instead
  }

  return element;
};

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/homepagecontent" />} /> {/* Default to homepage */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepagecontent" element={<HomepageContent />} /> {/* Public route */}
        <Route path="/inventory" element={<ProtectedRoute element={<Inventory />} allowedRoles={[1]} />} />
        <Route path="/admindashboard" element={<ProtectedRoute element={<Admindashboard />} allowedRoles={[1]} />} />
        <Route path="/usertable" element={<ProtectedRoute element={<UserTable />} allowedRoles={[1]} />} />
        <Route path="/adminproducts" element={<ProtectedRoute element={<ProductPage />} allowedRoles={[1]} />} />
        <Route path="/shopui" element={<Shop_ui />} />
        <Route path="/cartview" element={<CartView />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/complete" element={<Complete />} />
        <Route path="/footercontent" element={<FooterContent />} /> {/* Public route */}

        <Route
          path="/product/:id"
          element={<ProtectedRoute element={<ProductDetails />} allowedRoles={[2]} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} allowedRoles={[1, 2]} />}
        />
      </Routes>
    </Router>
  );
}

if (document.getElementById("root")) {
  ReactDOM.render(<Routers />, document.getElementById("root"));
}