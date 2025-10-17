import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const styles = {
    layoutContainer: {
      display: 'flex',
      minHeight: '100vh',
    },
    mainContent: {
      flexGrow: 1,
      padding: '25px',
      backgroundColor: '#e9ecef', // Light grey content area
    },
  };

  return (
    <div style={styles.layoutContainer}>
      <AdminSidebar />
      <main style={styles.mainContent}>
        <Outlet /> {/* Admin pages will render here */}
      </main>
    </div>
  );
};

export default AdminLayout;