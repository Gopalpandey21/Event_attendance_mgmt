import React, { useState, useEffect, useRef } from 'react'; // useRef for QR download
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react'; // <-- Import the QR code component

const RegistrationPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const qrRef = useRef(); // Ref to access the QR code canvas for download

  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({ phone: '', course: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // New state: will hold registration details ONLY AFTER successful submission
  const [registrationDetails, setRegistrationDetails] = useState(null);

  // Fetch the event's details to display the title
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true); // Set loading true at the start of fetch
      try {
        const response = await fetch('http://localhost:5000/api/events');
        const events = await response.json();
        const currentEvent = events.find(e => e._id === eventId);
        if (currentEvent) {
          setEvent(currentEvent);
        } else {
          setError('Event not found.');
        }
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false); // Set loading false at the end
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!user) {
      setError('You must be logged in to register.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }
      
      // ✅ SUCCESS! Store registration details and switch to QR code view
      setRegistrationDetails(data);
      // Optional: You can still show an alert if you want, but the QR code serves as confirmation.
      alert('Registration successful! Your QR code is ready.');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle QR code download
  const handleDownloadQr = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const image = canvas.toDataURL('image/png');
        const anchor = document.createElement('a');
        anchor.href = image;
        // Create a user-friendly filename
        const filename = `event-qr-${registrationDetails.eventName.replace(/\s/g, '-')}-${registrationDetails.userName.replace(/\s/g, '-')}.png`;
        anchor.download = filename;
        anchor.click();
      }
    }
  };

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6', padding: '20px' },
    wrapper: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px', textAlign: 'center' },
    header: { fontSize: '28px', marginBottom: '15px', color: '#333' },
    eventName: { fontSize: '22px', color: '#555', marginBottom: '20px' },
    userName: { fontSize: '16px', color: '#666', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px', margin: '0 auto', maxWidth: '300px' },
    input: { padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' },
    button: { padding: '12px', border: 'none', borderRadius: '5px', backgroundColor: '#28a745', color: 'white', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease' },
    secondaryButton: { backgroundColor: '#6c757d', marginLeft: '10px' },
    errorText: { color: 'red', textAlign: 'center', marginTop: '15px' },
    qrInfo: { marginBottom: '20px' },
    qrContainer: { margin: '20px auto', display: 'inline-block' } // Center the QR code
  };

  if (loading) return <p style={styles.wrapper}>Loading...</p>;
  if (!event) return <p style={{...styles.wrapper, color: 'red'}}>Error: Event not found.</p>;
  if (!user) return <p style={{...styles.wrapper, color: 'red'}}>Error: Please log in to register for events.</p>;


  // Conditional Rendering: Show QR code if registrationDetails are available
  if (registrationDetails) {
    // Data to embed in the QR code
    const qrData = JSON.stringify({
      registrationId: registrationDetails.registrationId,
      eventName: registrationDetails.eventName,
      userName: registrationDetails.userName,
      course: registrationDetails.course,
      phone: registrationDetails.phone,
    });

    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <h2 style={{color: '#28a745', fontSize: '2rem'}}>Registration Confirmed!</h2>
          <p style={styles.qrInfo}>Your QR code for <strong>{registrationDetails.eventName}</strong> is below.</p>
          <p style={styles.qrInfo}>Please save it for event check-in.</p>
          
          <div ref={qrRef} style={styles.qrContainer}>
            <QRCodeCanvas value={qrData} size={256} level={"H"} />
          </div>
          
          <div>
            <button onClick={handleDownloadQr} style={styles.button}>
              Download QR Code
            </button>
            <button onClick={() => navigate('/events/my-registrations')} style={{...styles.button, ...styles.secondaryButton}}>
              View My Registrations
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Else, show the registration form
  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h1 style={styles.header}>Register for {event.title}</h1>
        <p style={styles.userName}>Registering as: <strong>{user.name}</strong></p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="course" placeholder="Your Course (e.g., BCA)" value={formData.course} onChange={handleChange} style={styles.input} required />
          <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} style={styles.input} required />
          {error && <p style={styles.errorText}>{error}</p>}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Submitting...' : 'Confirm Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;