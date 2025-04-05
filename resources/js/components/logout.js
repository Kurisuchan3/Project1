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
        navigate("/homepagecontent"); // Redirect to homepagecontent
        return;
      }

      const response = await axios.post(
        "/api/logout",
        {},
        {
          headers: { Authorization: authToken },
        }
      );
      console.log("Logout response:", response.data);

      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      message.success("Logout successful!");
      navigate("/homepagecontent"); // Redirect to homepagecontent
    } catch (error) {
      console.error("Logout failed:", error.response?.data);
      message.error("Logout failed. Please try again.");
      navigate("/homepagecontent"); // Redirect even on error
    }
  };

  return handleLogout;
};

export default useLogout;