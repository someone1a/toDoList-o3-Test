// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';

const PrivateRoute = ({ children }) => {
  const user = supabase.auth.user();
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
