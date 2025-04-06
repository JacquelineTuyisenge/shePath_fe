import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
// import Cookie from "js-cookie";
import axiosInstance from "../axiosInstance";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // const token = Cookie.get("token");
  // console.log('token from cookie', token);
  // const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/check', { withCredentials: true });
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <Loader />; // Or a loader component
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // if (!token) {
  //   return <Navigate to="/" replace />;
  // }

  if (!allowedRoles.includes(userRole || "")) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;