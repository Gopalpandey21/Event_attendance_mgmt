import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import qrcode from 'qrcode-generator'; // 1. Import the new library

const QRCodePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 2. State to hold the generated image data URL
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  const { registrationData } = location.state || {};

  // 3. useEffect to generate the QR code when the component gets data
  useEffect(() => {
    if (registrationData) {
      // The data to encode in the QR code
      const dataString = JSON.stringify(registrationData);

      // Create a new QR code instance
      // '0' means auto-detect type, 'H' means high error correction
      const qr = qrcode(0, 'H');
      qr.addData(dataString);
      qr.make();

      // Generate the image as a base64 data URL
      // (cellSize = 10px, margin = 4 cells)
      const dataUrl = qr.createDataURL(10, 4);
      setQrCodeDataUrl(dataUrl);
    }
  }, [registrationData]); // Re-run only if registrationData changes

  // 4. Simplified download function
  const handleDownload = () => {
    if (qrCodeDataUrl) {
      const anchor = document.createElement('a');
      anchor.href = qrCodeDataUrl;
      anchor.download = `event-qr-${registrationData.name.replace(/\s+/g, '-')}.png`;
      anchor.click();
    }
  };
    
  // --- Styles remain mostly the same ---
  const styles = {
    container: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center', backgroundColor: '#f4f7f6' },
    qrWrapper: { padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'},
    header: { marginBottom: '10px', fontSize: '2rem' },
    info: { color: '#666', marginBottom: '20px', fontSize: '1rem' },
    button: { padding: '12px 20px', marginTop: '20px', border: 'none', borderRadius: '5px', backgroundColor: '#007BFF', color: 'white', fontSize: '16px', cursor: 'pointer' },
    qrImage: { border: '5px solid #007BFF', borderRadius: '5px' } // Style for the image
  };
  
  // If a user lands here directly without data, redirect them
  if (!registrationData) {
    return (
        <div style={styles.container}>
            <p>No registration data found. Please register first.</p>
            <button onClick={() => navigate('/events/dashboard')} style={styles.button}>Back to Dashboard</button>
        </div>
    );
  }

  return (
    <div style={styles.container}>
        <div style={styles.qrWrapper}>
            <h1 style={styles.header}>Registration Successful!</h1>
            <p style={styles.info}>Scan this QR code at the event entrance.</p>
            {/* 5. Display the QR code using a standard <img> tag */}
            {qrCodeDataUrl && (
              <img src={qrCodeDataUrl} alt="Registration QR Code" style={styles.qrImage} />
            )}
        </div>
      <button onClick={handleDownload} style={styles.button}>
        Download QR Code
      </button>
    </div>
  );
};

export default QRCodePage;