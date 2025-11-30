import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminProtected({ children }) {
  const user = JSON.parse(localStorage.getItem("user")); // your stored login data

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/" replace />; // or agent dashboard
  }

  return children;
}
