import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // <-- Import
import HomePage from './pages/Home';
import AdminRoutes from './routes/AdminRoutes';
import ParticipantRoutes from './routes/ParticipantRoutes';

function App() {
  return (
    <AuthProvider> {/* <-- Wrap your routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/*" element={<ParticipantRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;