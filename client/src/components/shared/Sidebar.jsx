import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Import useAuth

const Sidebar = () => {
  const { user, logout } = useAuth(); // 2. Get user and logout from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/events/login'); // Redirect to login page after logout
  };

  const styles = {
    sidebarContainer: {
      width: '220px',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '0', // Changed to 0 to allow full-width sections
      height: '100vh',
      display: 'flex', // Added for layout
      flexDirection: 'column', // Added for layout
    },
    // 3. Added styles for user info and logout button
    userInfo: {
      padding: '20px',
      textAlign: 'center',
      borderBottom: '1px solid #4a5a70',
      color: '#fff',
    },
    userName: {
      margin: 0,
      fontWeight: 'bold',
    },
    logoutButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '12px',
      width: '80%',
      margin: '20px auto',
      borderRadius: '5px',
      display: 'block',
      cursor: 'pointer',
      fontSize: '15px',
    },
    // Original styles
    navList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      flexGrow: 1, // Makes the nav list take available space
    },
    navItem: {
      padding: '15px 20px',
      cursor: 'pointer',
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '16px',
    },
  };

  return (
    <aside style={styles.sidebarContainer}>
      {/* Display user info if logged in */}
      {user && (
        <div style={styles.userInfo}>
          <p style={{margin: '0 0 5px 0'}}>Welcome,</p>
          <h3 style={styles.userName}>{user.name}</h3>
        </div>
      )}

      <nav style={{flexGrow: 1}}>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/events/dashboard" style={styles.navLink}>Events</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/events/my-registrations" style={styles.navLink}>My Registrations</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/events/certificates" style={styles.navLink}>Get Certificate</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/events/report" style={styles.navLink}>Report</Link>
          </li>
        </ul>
      </nav>

      {/* Display logout button if logged in */}
      {user && (
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      )}
    </aside>
  );
};

export default Sidebar;