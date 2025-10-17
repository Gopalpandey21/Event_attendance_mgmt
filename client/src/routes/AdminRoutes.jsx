import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from '../components/admin/AdminLayout';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AddEvent from '../pages/admin/AddEvent';
import DeleteEvent from '../pages/admin/DeleteEvent';
import GenerateCertificate from '../pages/admin/GenerateCertificate';
import AllAttendees from '../pages/admin/AllAttendees';
import CheckInScanner from '../pages/admin/CheckInScanner'; // 1. Import the new component

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Standalone login page */}
      <Route path="login" element={<AdminLoginPage />} />

      {/* Pages that share the admin layout */}
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        
        {/* 2. Add the route for the scanner page */}
        <Route path="scanner" element={<CheckInScanner />} />

        <Route path="attendees" element={<AllAttendees />} />
        <Route path="events/add" element={<AddEvent />} />
        <Route path="events/delete" element={<DeleteEvent />} />
        <Route path="certificates/generate" element={<GenerateCertificate />} />
      </Route>

      {/* Redirect from the base /admin path to the dashboard */}
      <Route path="/" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;