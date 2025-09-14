import { Navigate, Outlet } from "react-router-dom";

export default function RoleRoute({ roles }) {
  const user = JSON.parse(localStorage.getItem("lmsUser"));

  if (!user) return <Navigate to="/auth/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
