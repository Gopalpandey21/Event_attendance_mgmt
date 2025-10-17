import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // To get the logged-in user's token

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Get user info from your AuthContext

  useEffect(() => {
    const fetchRegistrations = async () => {
      // Don't fetch if the user isn't logged in
      if (!user || !user.token) {
        setLoading(false);
        setError('Please log in to see your registrations.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/users/my-registrations', {
          headers: {
            // Send the token to prove who we are
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch your registrations.');
        }

        const data = await response.json();
        setRegistrations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [user]); // Re-run this effect if the user state changes

  const handleViewQr = (eventTitle) => {
    alert(`Function to show QR for "${eventTitle}" is not implemented yet.`);
  };

  const styles = {
    header: { fontSize: '24px', marginBottom: '20px' },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    item: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '18px', fontWeight: 'bold' },
    button: { padding: '10px 15px', border: 'none', borderRadius: '5px', backgroundColor: '#007BFF', color: 'white', fontSize: '14px', cursor: 'pointer' },
    message: { textAlign: 'center', color: '#6c757d', fontSize: '18px' },
  };

  if (loading) {
    return <p style={styles.message}>Loading your registrations...</p>;
  }

  if (error) {
    return <p style={{ ...styles.message, color: 'red' }}>Error: {error}</p>;
  }

  return (
    <>
      <h1 style={styles.header}>My Registrations</h1>
      <div style={styles.list}>
        {registrations.length > 0 ? (
          registrations.map((reg) => (
            <div key={reg._id} style={styles.item}>
              <div>
                {/* Because we used .populate(), we can access reg.event.title */}
                <h3 style={styles.title}>{reg.event.title}</h3>
                <p style={{ color: '#666' }}>
                  {/* Format the date for better readability */}
                  Registered on: {new Date(reg.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => handleViewQr(reg.event.title)} style={styles.button}>
                View QR Code
              </button>
            </div>
          ))
        ) : (
          <p style={styles.message}>You have not registered for any events yet.</p>
        )}
      </div>
    </>
  );
};

export default MyRegistrations;