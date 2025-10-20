import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // FIX: 1. Import useAuth

const AddEvent = () => {
  // State to hold all form data in a single object
  const [eventData, setEventData] = useState({
    title: '',
    duration: '',
    venue: '',
    teamType: 'Solo', // Default to 'Solo'
    maxTeamSize: '',
  });

  // Separate state for the image file
  const [eventImage, setEventImage] = useState(null);

  // New state for loading and error feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth(); // FIX: 2. Get the logged-in admin's user data

  // A single handler for all text and radio inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // A specific handler for the file input
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setEventImage(e.target.files[0]);
    }
  };

  // UPDATED: Handle the form submission to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // FIX: 3. Check if admin is logged in
    if (!user || !user.token) {
        setError('You must be logged in as an admin to create an event.');
        setLoading(false);
        return;
    }

    // Use FormData for multipart/form-data, which is required for file uploads
    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('duration', eventData.duration);
    formData.append('venue', eventData.venue);
    formData.append('teamType', eventData.teamType);
    if (eventData.teamType === 'Team') {
      formData.append('maxTeamSize', eventData.maxTeamSize);
    }
    if (eventImage) {
      // The key 'image' must match what the backend's multer middleware expects
      formData.append('image', eventImage);
    }

    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        // FIX: 4. Add the Authorization header
        headers: {
            'Authorization': `Bearer ${user.token}`,
        },
        body: formData, // The browser automatically sets the correct Content-Type for FormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create event.');
      }

      alert('Event created successfully!');
      // Reset the form after successful submission
      setEventData({ title: '', duration: '', venue: '', teamType: 'Solo', maxTeamSize: '' });
      setEventImage(null);
      document.getElementById('image').value = null; // Clear file input
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Styles (no changes) ---
  const styles = {
    header: { fontSize: '28px', marginBottom: '25px', color: '#343a40' },
    formContainer: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      maxWidth: '700px',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontWeight: 'bold', color: '#495057' },
    input: {
      padding: '12px',
      borderRadius: '5px',
      border: '1px solid #ced4da',
      fontSize: '16px',
    },
    radioGroup: { display: 'flex', gap: '20px', alignItems: 'center' },
    radioLabel: { display: 'flex', alignItems: 'center', gap: '5px' },
    button: {
      padding: '15px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#007bff',
      color: 'white',
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    errorText: {
        color: 'red',
        textAlign: 'center'
    }
  };

  return (
    <div>
      <h1 style={styles.header}>Add a New Event</h1>
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Event Title */}
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>Event Title</label>
            <input type="text" id="title" name="title" value={eventData.title} onChange={handleChange} style={styles.input} required />
          </div>

          {/* Event Image */}
          <div style={styles.formGroup}>
            <label htmlFor="image" style={styles.label}>Event Image/Banner</label>
            <input type="file" id="image" name="image" onChange={handleImageChange} style={styles.input} accept="image/*" required />
          </div>

          {/* Duration & Venue */}
          <div style={{display: 'flex', gap: '20px'}}>
            <div style={{...styles.formGroup, flex: 1}}>
              <label htmlFor="duration" style={styles.label}>Duration</label>
              <input type="text" id="duration" name="duration" placeholder="e.g., 3 Hours or 2 Days" value={eventData.duration} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={{...styles.formGroup, flex: 1}}>
              <label htmlFor="venue" style={styles.label}>Venue</label>
              <input type="text" id="venue" name="venue" placeholder="e.g., Auditorium" value={eventData.venue} onChange={handleChange} style={styles.input} required />
            </div>
          </div>
          
          {/* Team Size Radio Buttons */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Team Type</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input type="radio" name="teamType" value="Solo" checked={eventData.teamType === 'Solo'} onChange={handleChange} /> Solo
              </label>
              <label style={styles.radioLabel}>
                <input type="radio" name="teamType" value="Team" checked={eventData.teamType === 'Team'} onChange={handleChange} /> Team
              </label>
            </div>
          </div>

          {/* Conditional Input for Max Team Size */}
          {eventData.teamType === 'Team' && (
            <div style={styles.formGroup}>
              <label htmlFor="maxTeamSize" style={styles.label}>Max Team Members</label>
              <input type="number" id="maxTeamSize" name="maxTeamSize" value={eventData.maxTeamSize} onChange={handleChange} style={styles.input} placeholder="e.g., 4" min="2" required />
            </div>
          )}

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;