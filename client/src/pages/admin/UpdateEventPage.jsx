// pages/admin/UpdateEventPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UpdateEventPage = () => {
  const { id: eventId } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate();
  const { user } = useAuth();

  const [eventData, setEventData] = useState({
    title: '',
    duration: '',
    venue: '',
    teamType: 'Solo',
    maxTeamSize: '',
  });
  const [currentImage, setCurrentImage] = useState('');
  const [eventImage, setEventImage] = useState(null); // For the new file upload
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch the event's current data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch event details.');
        const data = await response.json();
        setEventData({
          title: data.title,
          duration: data.duration,
          venue: data.venue,
          teamType: data.teamType,
          maxTeamSize: data.maxTeamSize,
        });
        setCurrentImage(data.imageUrl); // To display the current image
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setEventImage(e.target.files[0]);
    }
  };

  // 2. Handle the update submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('duration', eventData.duration);
    formData.append('venue', eventData.venue);
    formData.append('teamType', eventData.teamType);
    if (eventData.teamType === 'Team') {
      formData.append('maxTeamSize', eventData.maxTeamSize);
    }
    // Only append the image if a new one was selected
    if (eventImage) {
      formData.append('image', eventImage);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update event.');
      }

      alert('Event updated successfully!');
      navigate('/admin/events/manage'); // Navigate back to the list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Styles are identical to AddEvent.js
  const styles = {
    header: { fontSize: '28px', marginBottom: '25px', color: '#343a40' },
    formContainer: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxWidth: '700px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontWeight: 'bold', color: '#495057' },
    input: { padding: '12px', borderRadius: '5px', border: '1px solid #ced4da', fontSize: '16px' },
    radioGroup: { display: 'flex', gap: '20px', alignItems: 'center' },
    radioLabel: { display: 'flex', alignItems: 'center', gap: '5px' },
    button: { padding: '15px', border: 'none', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', fontSize: '16px', cursor: 'pointer', marginTop: '10px' },
    errorText: { color: 'red', textAlign: 'center' },
    currentImage: { width: '200px', height: 'auto', borderRadius: '5px', border: '1px solid #ddd' }
  };

  if (loading && !eventData.title) return <p>Loading event data...</p>;

  return (
    <div>
      <h1 style={styles.header}>Update Event</h1>
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* All fields are pre-filled from eventData state */}
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>Event Title</label>
            <input type="text" id="title" name="title" value={eventData.title} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Current Image</label>
            <img src={`http://localhost:5000${currentImage}`} alt="Current event" style={styles.currentImage} />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="image" style={styles.label}>Upload New Image (Optional)</label>
            <input type="file" id="image" name="image" onChange={handleImageChange} style={styles.input} accept="image/*" />
          </div>

          <div style={{display: 'flex', gap: '20px'}}>
            <div style={{...styles.formGroup, flex: 1}}>
              <label htmlFor="duration" style={styles.label}>Duration</label>
              <input type="text" id="duration" name="duration" value={eventData.duration} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={{...styles.formGroup, flex: 1}}>
              <label htmlFor="venue" style={styles.label}>Venue</label>
              <input type="text" id="venue" name="venue" value={eventData.venue} onChange={handleChange} style={styles.input} required />
            </div>
          </div>
          
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

          {eventData.teamType === 'Team' && (
            <div style={styles.formGroup}>
              <label htmlFor="maxTeamSize" style={styles.label}>Max Team Members</label>
              <input type="number" id="maxTeamSize" name="maxTeamSize" value={eventData.maxTeamSize} onChange={handleChange} style={styles.input} min="2" required />
            </div>
          )}

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateEventPage;