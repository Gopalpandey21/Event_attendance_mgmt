import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return; // Don't fetch if user is not logged in

    const fetchCertificates = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/my-certificates', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch certificates.');
        }
        const data = await response.json();
        setCertificates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user]);

  const styles = {
    container: { flexGrow: 1, padding: '20px', backgroundColor: '#f4f7f6' },
    header: { fontSize: '24px', marginBottom: '20px' },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    item: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '18px', fontWeight: 'bold' },
    button: { padding: '10px 15px', border: 'none', borderRadius: '5px', backgroundColor: '#17A2B8', color: 'white', fontSize: '14px', cursor: 'pointer', textDecoration: 'none' }, // Added textDecoration
    message: { textAlign: 'center', color: '#6c757d', fontSize: '18px' },
  };

  if (loading) {
    return <p style={styles.message}>Loading your certificates...</p>;
  }

  if (error) {
    return <p style={{...styles.message, color: 'red'}}>Error: {error}</p>;
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.header}>Your Certificates</h1>
      <div style={styles.list}>
        {certificates.length > 0 ? (
          certificates.map((event) => (
            <div key={event._id} style={styles.item}>
              <div>
                <h3 style={styles.title}>{event.title}</h3>
              </div>
              {/* This link points directly to the backend download route! */}
              <a 
                href={`http://localhost:5000/api/certificate/download/${event._id}?token=${user.token}`}
                style={styles.button}
                target="_blank" // Opens in a new tab
                rel="noopener noreferrer"
              >
                Download
              </a>
            </div>
          ))
        ) : (
          <p style={styles.message}>You have not earned any certificates yet. Attend an event and get checked in!</p>
        )}
      </div>
    </main>
  );
};

export default Certificates;