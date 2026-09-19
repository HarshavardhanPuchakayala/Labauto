import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, requiredRole }) {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Send users to the dashboard they are actually allowed to access.
    if (user?.role === "technician") {
      return <Navigate to="/dashboard" replace />;
    }

    if (user?.role === "owner") {
      return <Navigate to="/owner-dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;