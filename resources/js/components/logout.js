import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      console.log("Logout token:", authToken);

      if (!authToken) {
        message.warning("You are already logged out.");
        navigate("/homepagecontent");
        return;
      }

      const response = await axios.post(
        "/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log("Logout response:", response.data);

      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("guestCart");
      message.success("Logout successful!");
      navigate("/homepagecontent");
    } catch (error) {
      console.error("Logout failed:", error.response?.data);
      message.error("Logout failed. Please try again.");
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        navigate("/homepagecontent");
      }
    }
  };

  return handleLogout;
};

export default useLogout;