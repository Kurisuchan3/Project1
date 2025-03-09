import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("authToken");
  const role = parseInt(localStorage.getItem("userRole"));

  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
