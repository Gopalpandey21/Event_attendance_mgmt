import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import EventsListPage from '../pages/EventsListPage';
import LoginPage from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import RegistrationPage from '../pages/RegistrationPage';

import Certificates from '../pages/Certificates';
import MyRegistrations from '../pages/MyRegistrations'; // <-- 1. Import the new page

const ParticipantRoutes = () => {
  return (
    <Routes>
      {/* Routes without the sidebar */}
      <Route path="login" element={<LoginPage />} />
      <Route path="register/:eventId" element={<RegistrationPage />} />
      {/* <Route path="qr-code" element={<QRCodePage />} /> */}
      <Route index element={<EventsListPage />} />

      {/* Routes that share the sidebar layout */}
      <Route element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="certificates" element={<Certificates />} />
        {/* 2. Add the new route for registrations */}
        <Route path="my-registrations" element={<MyRegistrations />} />
      </Route>
    </Routes>
  );
};

export default ParticipantRoutes;