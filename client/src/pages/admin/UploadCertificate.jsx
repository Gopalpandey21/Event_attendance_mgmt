import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const UploadCertificate = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [certificateFile, setCertificateFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  // 1. Fetch all events to populate the dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Failed to load events.');
      }
    };
    fetchEvents();
  }, []);

  const handleFileChange = (e) => {
    setCertificateFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !certificateFile) {
      setError('Please select an event and a certificate template file.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    // This key 'template' must match the backend multer middleware
    formData.append('template', certificateFile); 

    try {
      const response = await fetch(`http://localhost:5000/api/events/${selectedEvent}/upload-template`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed.');
      }

      setMessage('Certificate template uploaded successfully!');
      setSelectedEvent('');
      setCertificateFile(null);
      document.getElementById('file-input').value = null; // Clear file input
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    header: { fontSize: '28px', marginBottom: '25px', color: '#343a40' },
    formContainer: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxWidth: '700px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontWeight: 'bold', color: '#495057' },
    input: { padding: '12px', borderRadius: '5px', border: '1px solid #ced4da', fontSize: '16px' },
    select: { padding: '12px', borderRadius: '5px', border: '1px solid #ced4da', fontSize: '16px', backgroundColor: 'white' },
    button: { padding: '15px', border: 'none', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', fontSize: '16px', cursor: 'pointer', marginTop: '10px' },
    errorText: { color: 'red', textAlign: 'center' },
    messageText: { color: 'green', textAlign: 'center' }
  };

  return (
    <div>
      <h1 style={styles.header}>Upload Certificate Template</h1>
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="event" style={styles.label}>Select Event</label>
            <select id="event" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} style={styles.select} required>
              <option value="">-- Choose an event --</option>
              {events.map(event => (
                <option key={event._id} value={event._id}>{event.title}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="file-input" style={styles.label}>Template Image (PNG/JPG)</label>
            <input type="file" id="file-input" onChange={handleFileChange} style={styles.input} accept="image/png, image/jpeg" required />
          </div>
          
          {error && <p style={styles.errorText}>{error}</p>}
          {message && <p style={styles.messageText}>{message}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Template'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadCertificate;