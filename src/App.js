// App.js
import './index.css';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import TaskList from './components/TaskList';
import PrivateRoute from './routes/PrivateRoute';

// Reemplaza '<project>' y '<your-anon-key>' por los valores correspondientes de tu proyecto Supabase
const supabase = createClient('https://ckgnzzhzdczpgawidzvs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZ256emh6ZGN6cGdhd2lkenZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MTI1MTAsImV4cCI6MjA1NDI4ODUxMH0.XzlmYA17X9qw_9ty5parrx_ziu3bFI4aDN1CbIU8GjY');

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Obtiene la sesión actual al montar el componente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Suscribirse a los cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup: cancelar la suscripción al desmontar el componente
    return () => subscription.unsubscribe();
  }, []);

  // Si no hay sesión, muestra la interfaz de autenticación de Supabase
  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
      />
    );
  } else {
    // Si hay sesión, se muestran las rutas protegidas
    return (
      <Router>
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LandingPage />} />

          {/* Rutas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/Dashboard" element={<TaskList />} />
          </Route>
        </Routes>
      </Router>
    );
  }
}
