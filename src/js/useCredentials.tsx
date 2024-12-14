import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function useCheckCredentials() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
}
