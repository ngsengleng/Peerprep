import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

export default function PrivateRoutes() {
  const { getAuthToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getAuthToken()) {
      console.log("no entry");
      navigate("/login");
    }
  }, [navigate, getAuthToken]);
  return <Outlet />;
}
