import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import Sidebar from './Sidebar';

const Layout = () => {
  const styles = {
    layoutContainer: {
      display: 'flex',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
    },
    // The main content area will now be part of the layout
    mainContent: {
      flexGrow: 1,
      padding: '20px',
      backgroundColor: '#f4f7f6',
    },
  };

  return (
    <div style={styles.layoutContainer}>
      <Sidebar />
      <main style={styles.mainContent}>
        <Outlet /> {/* Child pages will be rendered here */}
      </main>
    </div>
  );
};

export default Layout;