import React, { useState, useEffect } from 'react';
import EventCard from '../components/participant/EventCard';

const Dashboard = () => {
  // State to hold events, loading status, and any errors
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events from the server.');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // The empty array [] means this effect runs only once

  const styles = {
    header: {
      fontSize: '24px',
      marginBottom: '20px',
    },
    eventsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
    },
    message: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#6c757d',
    },
    errorText: {
        textAlign: 'center',
        fontSize: '18px',
        color: 'red',
    }
  };

  // Conditional rendering based on the state
  if (loading) {
    return <p style={styles.message}>Loading events...</p>;
  }

  if (error) {
    return <p style={styles.errorText}>Error: {error}</p>;
  }

  return (
    <>
      <h1 style={styles.header}>Upcoming Events</h1>
      <div style={styles.eventsGrid}>
        {events.length > 0 ? (
            events.map((event) => (
            // The key should be the unique _id from MongoDB
            // The image URL needs the base path of your backend server
            <EventCard
              key={event._id}
              event={{ ...event, image: `http://localhost:5000${event.imageUrl}` }}
            />
          ))
        ) : (
            <p style={styles.message}>No upcoming events found.</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;