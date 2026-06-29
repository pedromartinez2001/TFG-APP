import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import userService from "../services/userService";

const ProtectedRoute = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      const user = localStorage.getItem("user");
      if (!user) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      try {
        await userService.profileUser();
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    verifySession();
  }, []);

  if (isChecking) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;
