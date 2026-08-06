import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { user, isChecking } = useAuth();

  if (isChecking) {
    return <div className="session-checking">Verificando sesión...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;
