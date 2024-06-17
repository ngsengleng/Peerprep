import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PrivateRoutes() {
  const { getAuthToken } = useAuth();
  if (!getAuthToken) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
}
