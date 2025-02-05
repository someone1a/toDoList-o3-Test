// src/App.jsy
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import TaskList from './components/TaskList';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  return (
    <Router>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/tasks" element={
      <PrivateRoute>
        <TaskList />
      </PrivateRoute>
    } />
    {/* Agrega más rutas según sea necesario */}
  </Routes>
</Router>

  );
};

export default App;
