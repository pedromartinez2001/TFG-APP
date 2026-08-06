import { useCallback, useEffect, useMemo, useState } from "react";
import AuthContext from "./authContext";
import api from "../services/axios";
import userService from "../services/userService";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const establishSession = useCallback((authenticatedUser) => {
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await userService.logoutUser();
    } catch {
      // Local cleanup must always happen, even if the API is unavailable.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    let isActive = true;

    const verifySession = async () => {
      if (!localStorage.getItem("user")) {
        if (isActive) setIsChecking(false);
        return;
      }

      try {
        const response = await userService.profileUser();
        if (isActive) establishSession(response.data);
      } catch {
        if (isActive) clearSession();
      } finally {
        if (isActive) setIsChecking(false);
      }
    };

    verifySession();
    return () => {
      isActive = false;
    };
  }, [clearSession, establishSession]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) clearSession();
        return Promise.reject(error);
      },
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [clearSession]);

  const value = useMemo(
    () => ({ user, isChecking, establishSession, clearSession, logout }),
    [clearSession, establishSession, isChecking, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
