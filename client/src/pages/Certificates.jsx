import React from 'react';

// DUMMY DATA: In a real app, you'd fetch this from your backend.
// It would only include events the user has actually attended.
const attendedEvents = [
  {
    id: '1',
    title: 'React Workshop',
    completionDate: '2025-10-10',
  },
  {
    id: '3',
    title: 'UI/UX Design Principles',
    completionDate: '2025-09-25',
  },
];

const Certificates = () => {
  // This function is a placeholder for the actual download logic
  const handleDownload = (eventTitle) => {
    alert(`Certificate download for "${eventTitle}" is not implemented yet.`);
  };

  const styles = {
    container: {
      flexGrow: 1,
      padding: '20px',
      backgroundColor: '#f4f7f6',
    },
    header: {
      fontSize: '24px',
      marginBottom: '20px',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    item: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
    button: {
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#17A2B8',
      color: 'white',
      fontSize: '14px',
      cursor: 'pointer',
    },
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.header}>Your Certificates</h1>
      <div style={styles.list}>
        {attendedEvents.length > 0 ? (
          attendedEvents.map((event) => (
            <div key={event.id} style={styles.item}>
              <div>
                <h3 style={styles.title}>{event.title}</h3>
                <p style={{ color: '#666' }}>Completed on: {event.completionDate}</p>
              </div>
              <button onClick={() => handleDownload(event.title)} style={styles.button}>
                Download
              </button>
            </div>
          ))
        ) : (
          <p>You have not attended any events yet.</p>
        )}
      </div>
    </main>
  );
};

export default Certificates;