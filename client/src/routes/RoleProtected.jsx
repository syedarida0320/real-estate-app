import { Navigate } from "react-router-dom";

const RoleProtected = ({ allowedRoles, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;

  // check user.role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/properties" />; // redirect if not allowed
  }

  return children;
};

export default RoleProtected;
