import { Navigate, Outlet } from "react-router";
import Navbar from "./navbar";
import { useEffect, useState } from "react";

export default function Auth() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.token);

  useEffect(() => {
    const checkTokenExpiration = () => {
      try {
        const token = localStorage.token;
        if (!token) return setIsAuthenticated(false);

        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        const isExpired = payload.exp * 1000 < Date.now(); // Cek expire time
        
        if (isExpired) {
          localStorage.removeItem("token"); // Hapus token jika expired
          setIsAuthenticated(false);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    };

    checkTokenExpiration();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

