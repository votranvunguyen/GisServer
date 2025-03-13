import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Xóa token và dữ liệu trong localStorage
    localStorage.removeItem("vbd_token");

    // Xóa toàn bộ cache trong localStorage nếu cần
    localStorage.clear();

    // Chuyển hướng về trang đăng nhập
    navigate("/login");
  }, [navigate]);

  return null; // Không cần giao diện
};

export default LogoutComponent;
