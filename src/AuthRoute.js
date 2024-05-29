// AuthRoute.js
import React from 'react';
import { useNavigate, Route } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = ({ user,...rest}) => {
  


  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRoute;