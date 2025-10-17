import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    // Navigate to the registration page using the event's unique database ID
    navigate(`/events/register/${event._id}`);
  };

  return (
    <div style={styles.card}>
      <img src={event.image} alt={event.title} style={styles.image} />
      <div style={styles.content}>
        <h3 style={styles.title}>{event.title}</h3>
        <p style={styles.duration}>Duration: {event.duration}</p>
        <button onClick={handleRegister} style={styles.button}>
          Register
        </button>
      </div>
    </div>
  );
};

// ... (your styles)
// --- Added CSS Styles ---
const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden', // Ensures the image corners are rounded
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover', // Prevents the image from being stretched
  },
  content: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1, // Allows content to fill the remaining space
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0', // Removes default margin
  },
  duration: {
    fontSize: '0.9rem',
    color: '#6c757d',
    margin: '0 0 1rem 0',
    flexGrow: 1, // Pushes the button to the bottom
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
};

export default EventCard;