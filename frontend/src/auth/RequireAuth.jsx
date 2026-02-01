import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ roles }) {
  const { user } = useAuth();
  // also allow childAuth flow (child PIN login) stored separately
  const childAuthRaw = typeof window !== "undefined" ? localStorage.getItem("childAuth") : null;
  const hasChildAuth = !!childAuthRaw;

  // if no standard user AND no childAuth, redirect to login
  if (!user && !hasChildAuth) return <Navigate to="/login" replace />;

  // If roles are specified, validate against either the main user or childAuth
  if (roles) {
    // check if child role required and we have childAuth
    if (roles.includes("child") && hasChildAuth) {
      return <Outlet />;
    }
    // otherwise require a main user and check their role
    if (!user) return <Navigate to="/" replace />;
    if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
