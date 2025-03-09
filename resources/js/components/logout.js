import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd"; // ✅ Import Ant Design notifications

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // ✅ Get token from localStorage
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        message.warning("You are already logged out.");
        return;
      }

      await axios.post(
        "/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` }, // ✅ Send correct authorization header
        }
      );

      // ✅ Remove token & role
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");

      message.success("Logout successful!"); // ✅ Show success message
      navigate("/login"); // ✅ Redirect to login page
    } catch (error) {
      console.error("Logout failed", error);
      message.error("Logout failed. Please try again."); // ✅ Show error message
    }
  };

  return handleLogout;
};

export default useLogout;
