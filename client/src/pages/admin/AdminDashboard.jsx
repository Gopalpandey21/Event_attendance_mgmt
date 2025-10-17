import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // To get the admin's token

const AdminDashboard = () => {
  // State to hold the stats, loading status, and any errors
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalAttendees: 0,
    totalEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Get the logged-in admin's token

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.token) return; // Don't fetch if not logged in

      try {
        const response = await fetch('http://localhost:5000/api/admin/stats', {
          headers: {
            // Send the token to prove the user is an authorized admin
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard statistics.');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]); // Re-run if the user object changes

  const styles = {
    header: { fontSize: '28px', marginBottom: '25px', color: '#343a40' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' },
    statCard: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    statValue: { fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px 0' },
    statLabel: { fontSize: '16px', color: '#6c757d' },
    message: { textAlign: 'center', fontSize: '18px', color: '#6c757d' },
  };

  if (loading) {
    return <p style={styles.message}>Loading dashboard statistics...</p>;
  }

  if (error) {
    return <p style={{ ...styles.message, color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div>
      <h1 style={styles.header}>Admin Dashboard</h1>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={{...styles.statValue, color: '#007bff'}}>{stats.totalRegistrations}</p>
          <p style={styles.statLabel}>Total Registrations</p>
        </div>
        <div style={styles.statCard}>
          <p style={{...styles.statValue, color: '#28a745'}}>{stats.totalAttendees}</p>
          <p style={styles.statLabel}>Total Attendees</p>
        </div>
        <div style={styles.statCard}>
          <p style={{...styles.statValue, color: '#17a2b8'}}>{stats.totalEvents}</p>
          <p style={styles.statLabel}>Total Events Created</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;