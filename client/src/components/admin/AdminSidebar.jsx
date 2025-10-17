import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  // State to manage which dropdown is open
  const [openDropdown, setOpenDropdown] = useState(''); // Can be 'events' or 'certificates'

  const toggleDropdown = (dropdownName) => {
    // If the clicked dropdown is already open, close it. Otherwise, open it.
    setOpenDropdown(openDropdown === dropdownName ? '' : dropdownName);
  };

  const styles = {
    sidebarContainer: {
      width: '240px',
      backgroundColor: '#343a40',
      color: 'white',
      height: '100vh',
    },
    navList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    // Main navigation item style
    navItem: {
      cursor: 'pointer',
      borderBottom: '1px solid #495057',
    },
    // The clickable part of a nav item
    navLink: {
      color: '#adb5bd',
      textDecoration: 'none',
      fontSize: '16px',
      display: 'block',
      padding: '18px 25px',
    },
    // Style for the active NavLink (top-level only)
    activeLink: {
      color: 'white',
      fontWeight: 'bold',
      backgroundColor: '#495057',
    },
    // Style for the dropdown header (e.g., "Manage Events ▼")
    dropdownHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    // The dropdown arrow
    dropdownArrow: {
      transition: 'transform 0.3s',
      transform: 'rotate(0deg)', // Default state
    },
    // Rotate the arrow when the dropdown is open
    arrowOpen: {
      transform: 'rotate(90deg)',
    },
    // Container for the sub-menu links
    submenu: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      backgroundColor: '#495057', // Slightly different background
      maxHeight: '0', // Collapsed by default
      overflow: 'hidden',
      transition: 'max-height 0.4s ease-out',
    },
    // Expand the submenu when open
    submenuOpen: {
      maxHeight: '200px', // Animate opening
    },
    // Individual link within the submenu
    submenuLink: {
      color: '#adb5bd',
      textDecoration: 'none',
      display: 'block',
      padding: '15px 35px', // Indented padding
      fontSize: '15px',
    },
    activeSubmenuLink: {
      color: 'white',
      fontWeight: 'bold',
    }
  };

  return (
    <aside style={styles.sidebarContainer}>
      <nav>
        <ul style={styles.navList}>
          {/* Dashboard Link (No Dropdown) */}
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
          
          {/* ✅ ADDED: Scanner Link */}
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

          {/* All Attendees Link */}
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
                <NavLink to="/admin/events/delete" style={({isActive}) => isActive ? {...styles.submenuLink, ...styles.activeSubmenuLink} : styles.submenuLink}>Delete Event</NavLink>
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
    </aside>
  );
};

export default AdminSidebar;