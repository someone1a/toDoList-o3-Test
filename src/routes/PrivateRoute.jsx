import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';

const PrivateRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para obtener el usuario actual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Suscribirse a los cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    // Cleanup: cancelar la suscripción al desmontar el componente
    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  // Si hay usuario, renderiza las rutas hijas; de lo contrario, redirige a /login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
