import { useEffect, useState } from "react";
import Login from "./pages/login";
import AppLayout from "./pages/Applayout";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ AUTO LOGIN AFTER REFRESH
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ LOGIN HANDLER
  const handleLogin = (data) => {
    const authData = data.data ? data.data : data;
    localStorage.setItem("token", authData.token);
    localStorage.setItem("userId", authData.id);
    localStorage.setItem("role", authData.role);
    setIsAuthenticated(true);
  };

  // ✅ LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f4f4" }}>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <AppLayout onLogout={handleLogout} />
      )}
    </div>
  );
}