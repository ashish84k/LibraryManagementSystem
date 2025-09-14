import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const token = localStorage.getItem("lmsToken");
  return token ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
