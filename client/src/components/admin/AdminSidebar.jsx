import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Import useAuth

const AdminSidebar = () => {
  const [openDropdown, setOpenDropdown] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth(); // 2. Get the global logout function

  const logoutHandler = () => {
    logout(); // 3. Call the context logout function
    navigate('/admin/login');
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? '' : dropdownName);
  };

  const styles = {
    // ... (your existing styles are all correct)
    sidebarContainer: {
      width: '240px',
      backgroundColor: '#343a40',
      color: 'white',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    nav: {
      flexGrow: 1,
    },
    navList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    navItem: {
      cursor: 'pointer',
      borderBottom: '1px solid #495057',
    },
    navLink: {
      color: '#adb5bd',
      textDecoration: 'none',
      fontSize: '16px',
      display: 'block',
      padding: '18px 25px',
    },
    activeLink: {
      color: 'white',
      fontWeight: 'bold',
      backgroundColor: '#495057',
    },
    dropdownHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dropdownArrow: {
      transition: 'transform 0.3s',
      transform: 'rotate(0deg)',
    },
    arrowOpen: {
      transform: 'rotate(90deg)',
    },
    submenu: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      backgroundColor: '#495057',
      maxHeight: '0',
      overflow: 'hidden',
      transition: 'max-height 0.4s ease-out',
    },
    submenuOpen: {
      maxHeight: '200px',
    },
    submenuLink: {
      color: '#adb5bd',
      textDecoration: 'none',
      display: 'block',
      padding: '15px 35px',
      fontSize: '15px',
    },
    activeSubmenuLink: {
      color: 'white',
      fontWeight: 'bold',
    },
    logoutButton: {
      cursor: 'pointer',
      color: '#adb5bd',
      textDecoration: 'none',
      fontSize: '16px',
      display: 'block',
      padding: '18px 25px',
      borderTop: '1px solid #495057',
      backgroundColor: '#343a40',
    }
  };

  return (
    <aside style={styles.sidebarContainer}>
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          {/* Dashboard Link */}
          <li style={styles.navItem}>
            <NavLink
              to="/admin/dashboard"
              style={({ isActive }) =>
                isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink
              }
            >
              Dashboard
            </NavLink>
          </li>
          
          {/* Scanner Link */}
          <li style={styles.navItem}>
            <NavLink
              to="/admin/scanner"
              style={({ isActive }) =>
                isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink
              }
            >
              Check-in Scanner
            </NavLink>
          </li>

          {/* FIX: ADDED "All Attendees" LINK */}
          <li style={styles.navItem}>
            <NavLink
              to="/admin/attendees"
              style={({ isActive }) =>
                isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink
              }
            >
              All Attendees
            </NavLink>
          </li>

          {/* Manage Events Dropdown */}
          <li style={styles.navItem}>
            <div
              style={{ ...styles.navLink, ...styles.dropdownHeader }}
              onClick={() => toggleDropdown('events')}
            >
              Manage Events
              <span style={{...styles.dropdownArrow, ...(openDropdown === 'events' && styles.arrowOpen)}}>▶</span>
            </div>
            <ul style={{ ...styles.submenu, ...(openDropdown === 'events' && styles.submenuOpen) }}>
              <li>
                <NavLink to="/admin/events/add" style={({isActive}) => isActive ? {...styles.submenuLink, ...styles.activeSubmenuLink} : styles.submenuLink}>Add Event</NavLink>
              </li>
              <li>
                {/* FIX: Changed this link to point to the new Manage page */}
                <NavLink to="/admin/events/manage" style={({isActive}) => isActive ? {...styles.submenuLink, ...styles.activeSubmenuLink} : styles.submenuLink}>Manage Events</NavLink>
              </li>
            </ul>
          </li>

          {/* Certificates Dropdown */}
          <li style={styles.navItem}>
            <div
              style={{ ...styles.navLink, ...styles.dropdownHeader }}
              onClick={() => toggleDropdown('certificates')}
            >
              Certificates
              <span style={{...styles.dropdownArrow, ...(openDropdown === 'certificates' && styles.arrowOpen)}}>▶</span>
            </div>
            <ul style={{ ...styles.submenu, ...(openDropdown === 'certificates' && styles.submenuOpen) }}>
              <li>
                <NavLink to="/admin/certificates/generate" style={({isActive}) => isActive ? {...styles.submenuLink, ...styles.activeSubmenuLink} : styles.submenuLink}>Generate Certificate</NavLink>
              </li>
              <li>
                <NavLink to="/admin/certificates/upload" style={({isActive}) => isActive ? {...styles.submenuLink, ...styles.activeSubmenuLink} : styles.submenuLink}>Upload Certificate</NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div>
        <div
          style={styles.logoutButton}
          onClick={logoutHandler}
          onMouseOver={(e) => e.currentTarget.style.color = 'white'}
          onMouseOut={(e) => e.currentTarget.style.color = '#adb5bd'}
        >
          Logout
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;