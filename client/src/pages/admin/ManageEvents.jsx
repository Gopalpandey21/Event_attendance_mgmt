// pages/admin/ManageEvents.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate
import { useAuth } from '../../context/AuthContext';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate(); // <-- Get navigate function

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        if (!response.ok) throw new Error('Failed to fetch events.');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"? This will also delete all registrations for it.`)) {
      if (!user || !user.token) {
        alert('You are not authorized. Please log in again.');
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${user.token}` },
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to delete event.');
        }
        setEvents(currentEvents => currentEvents.filter(event => event._id !== eventId));
        alert(`Event "${eventTitle}" has been successfully deleted.`);
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  // --- NEW FUNCTION ---
  // Navigate to the UpdateEventPage with the event's ID
  const handleUpdate = (eventId) => {
    navigate(`/admin/events/update/${eventId}`);
  };

  const styles = {
    header: { fontSize: '28px', marginBottom: '25px', color: '#343a40' },
    container: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxWidth: '800px' },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    eventItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #e9ecef', borderRadius: '5px' },
    eventInfo: { flexGrow: 1 }, // Added to push buttons to the right
    eventTitle: { margin: 0, fontSize: '18px', fontWeight: 'bold' },
    eventDuration: { margin: '5px 0 0 0', color: '#6c757d' },
    buttonGroup: { display: 'flex', gap: '10px' }, // Group for buttons
    updateButton: { // Style for the new button
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#007bff', // Blue color for update
      color: 'white',
      fontSize: '14px',
      cursor: 'pointer',
    },
    deleteButton: {
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#dc3545',
      color: 'white',
      fontSize: '14px',
      cursor: 'pointer',
    },
    message: { textAlign: 'center', fontSize: '18px', color: '#6c757d' },
  };

  if (loading) return <p style={styles.message}>Loading events...</p>;
  if (error) return <p style={{...styles.message, color: 'red'}}>Error: {error}</p>;

  return (
    <div>
      <h1 style={styles.header}>Manage Events</h1>
      <div style={styles.container}>
        <div style={styles.list}>
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event._id} style={styles.eventItem}>
                <div style={styles.eventInfo}>
                  <h3 style={styles.eventTitle}>{event.title}</h3>
                  <p style={styles.eventDuration}>Duration: {event.duration}</p>
                </div>
                {/* --- ADDED BUTTON GROUP --- */}
                <div style={styles.buttonGroup}>
                  <button 
                    onClick={() => handleUpdate(event._id)} 
                    style={styles.updateButton}
                  >
                    Update
                  </button>
                  <button 
                    onClick={() => handleDelete(event._id, event.title)} 
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.message}>No events found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Don't forget to change the export name
export default ManageEvents;