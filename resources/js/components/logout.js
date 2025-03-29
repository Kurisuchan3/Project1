import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      console.log("Logout token:", authToken); // Debug

      if (!authToken) {
        message.warning("You are already logged out.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "/api/logout",
        {},
        {
          headers: { Authorization: authToken }, // ✅ Use token as stored
        }
      );
      console.log("Logout response:", response.data); // Debug

      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      message.success("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data);
      message.error("Logout failed. Please try again.");
    }
  };

  return handleLogout;
};

export default useLogout;