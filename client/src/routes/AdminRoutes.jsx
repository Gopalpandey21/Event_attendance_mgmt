import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from '../components/admin/AdminLayout';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AddEvent from '../pages/admin/AddEvent';
// import DeleteEvent from '../pages/admin/DeleteEvent'; // <-- Change this
import ManageEvents from '../pages/admin/ManageEvents'; // <-- To this
import UpdateEventPage from '../pages/admin/UpdateEventPage'; // <-- Import new page
import GenerateCertificate from '../pages/admin/TemplateDesigner';
import AllAttendees from '../pages/admin/AllAttendees';
import CheckInScanner from '../pages/admin/CheckInScanner';
import UploadCertificate from '../pages/admin/UploadCertificate'; // <-- 1. Import new page
import TemplateDesigner from '../pages/admin/TemplateDesigner';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="scanner" element={<CheckInScanner />} />
        <Route path="attendees" element={<AllAttendees />} />
        
        <Route path="events/add" element={<AddEvent />} />
        {/* <Route path="events/delete" element={<DeleteEvent />} /> {/* <-- Change this */}
        <Route path="events/manage" element={<ManageEvents />} /> {/* <-- To this */}
        <Route path="events/update/:id" element={<UpdateEventPage />} /> {/* <-- ADD THIS */}

        <Route path="certificates/generate" element={<TemplateDesigner />} />
        <Route path="certificates/upload" element={<UploadCertificate />} />
      </Route>
      <Route path="/" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;