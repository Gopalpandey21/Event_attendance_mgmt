import React, { useState } from 'react';

// DUMMY DATA: This represents the events currently in your system.
const initialEvents = [
  {
    id: '1',
    title: 'React Workshop',
    duration: '3 Hours',
  },
  {
    id: '2',
    title: 'Node.js Backend Basics',
    duration: '2 Days',
  },
  {
    id: '3',
    title: 'UI/UX Design Principles',
    duration: '1 Day',
  },
  {
    id: '4',
    title: 'Database Management with SQL',
    duration: '5 Hours',
  },
];

const DeleteEvent = () => {
  // State to manage the list of events, so we can update it on deletion
  const [events, setEvents] = useState(initialEvents);

  // Handle the delete action
  const handleDelete = (eventId, eventTitle) => {
    // Show a confirmation dialog to prevent accidental deletion
    if (window.confirm(`Are you sure you want to delete the event "${eventTitle}"? This action cannot be undone.`)) {
      // Filter the events array, keeping all events except the one with the matching ID
      setEvents(currentEvents => currentEvents.filter(event => event.id !== eventId));
      
      // In a real app, you would also make an API call to the backend here.
      console.log(`Event with ID: ${eventId} deleted.`);
      alert(`Event "${eventTitle}" has been successfully deleted.`);
    }
  };

  const styles = {
    header: { fontSize: '28px', marginBottom: '25px', color: '#343a40' },
    container: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      maxWidth: '800px',
    },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    eventItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      border: '1px solid #e9ecef',
      borderRadius: '5px',
    },
    eventTitle: { margin: 0, fontSize: '18px', fontWeight: 'bold' },
    eventDuration: { margin: '5px 0 0 0', color: '#6c757d' },
    deleteButton: {
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#dc3545', // Red color for delete
      color: 'white',
      fontSize: '14px',
      cursor: 'pointer',
    },
  };

  return (
    <div>
      <h1 style={styles.header}>Delete an Event</h1>
      <div style={styles.container}>
        <div style={styles.list}>
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} style={styles.eventItem}>
                <div>
                  <h3 style={styles.eventTitle}>{event.title}</h3>
                  <p style={styles.eventDuration}>Duration: {event.duration}</p>
                </div>
                <button 
                  onClick={() => handleDelete(event.id, event.title)} 
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>All events have been deleted.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteEvent;