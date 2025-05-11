import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/login/login";
import Register from "../components/register/register";
import Inventory from "../components/inventory/inventory";
import Admindashboard from "../components/admindashboard/admindashboard";
import HomepageContent from "./Homepage/homepage";
import UserTable from "../components/userslist/users_component/userstable";
import ProductPage from "./adminproducts/adminproducts";
import ProductDetails from "./userspage/selectedproduct";
import Profile from "../components/Profile";
import Shop_ui from "../components/ShopContent/Shop_ui";
import CartView from "./CartUI/cart_view";
import Payment from "./CheckoutUI/payment";
import Complete from "./OrderCompleteUI/complete";
import FooterContent from "./FooterContent/FooterContent";
import Orders from "./Orders/orders";
import OrdersModal from "./OrderModal/ordersmodal";
import AdminRegister from "../components/AdminRegister/adminregister";
import ProdModal from "./ModalUI/ProdModal";
import MyAddresses from "../components/MyAddress/myaddress";
import MyPurchases from "../components/MyPurchase/mypurchase"; // Add new import
import AboutUs from "../components/AboutUs/AboutUs";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const authToken = localStorage.getItem("authToken");
  const userRole = parseInt(localStorage.getItem("userRole"));

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/homepagecontent" replace />;
  }

  return element;
};

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/homepagecontent" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepagecontent" element={<HomepageContent />} />
        <Route path="/inventory" element={<ProtectedRoute element={<Inventory />} allowedRoles={[1]} />} />
        <Route path="/admindashboard" element={<ProtectedRoute element={<Admindashboard />} allowedRoles={[1]} />} />
        <Route path="/usertable" element={<ProtectedRoute element={<UserTable />} allowedRoles={[1]} />} />
        <Route path="/adminproducts" element={<ProtectedRoute element={<ProductPage />} allowedRoles={[1]} />} />
        <Route path="/shopui" element={<Shop_ui />} />
        <Route path="/cartview" element={<CartView />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/complete" element={<Complete />} />
        <Route path="/footercontent" element={<FooterContent />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/ordersmodal" element={<OrdersModal />} />
        <Route path="/prodmodal" element={<ProdModal />} />
        <Route path="/about" element={<AboutUs />} />


        <Route
          path="/adminsetting"
          element={<ProtectedRoute element={<AdminRegister />} allowedRoles={[1]} />}
        />
        <Route
          path="/product/:id"
          element={<ProtectedRoute element={<ProductDetails />} allowedRoles={[2]} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} allowedRoles={[1, 2]} />}
        />
        <Route
          path="/addresses"
          element={<ProtectedRoute element={<MyAddresses />} allowedRoles={[1, 2]} />}
        />
        <Route
          path="/purchases"
          element={<ProtectedRoute element={<MyPurchases />} allowedRoles={[1, 2]} />}
        /> {/* New protected route */}
      </Routes>
    </Router>
  );
}

if (document.getElementById("root")) {
  ReactDOM.render(<Routers />, document.getElementById("root"));
}