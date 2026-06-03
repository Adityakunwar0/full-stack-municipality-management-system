import React, { useContext } from "react";
import { AuthContext } from "../backend/context/Auth";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RequireAuth;