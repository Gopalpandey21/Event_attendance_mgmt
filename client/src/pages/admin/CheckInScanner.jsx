import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode'; // ✅ Import the correct library
import { useAuth } from '../../context/AuthContext';

const CheckInScanner = () => {
  const [result, setResult] = useState({ message: 'Please scan a QR code.', status: 'info' });
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let scanner;

    function onScanSuccess(decodedText) {
      if (!isProcessing) {
        setIsProcessing(true); // Lock to prevent multiple scans
        handleScanResult(decodedText);
      }
    }

    function onScanFailure(error) {
      // This is called frequently, so it's best to keep it quiet
    }

    // Initialize the scanner
    scanner = new Html5QrcodeScanner(
      'qr-reader-container', // The ID of the div where the scanner will render
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false // Verbose mode off
    );
    
    scanner.render(onScanSuccess, onScanFailure);

    // This stops the camera when you navigate away from the page
    return () => {
      if (scanner) {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5-qrcode-scanner.", error);
        });
      }
    };
  }, [isProcessing]);

  const handleScanResult = async (scanData) => {
    setResult({ message: 'Verifying...', status: 'info' });

    try {
      const qrContent = JSON.parse(scanData);
      const { registrationId } = qrContent;

      if (!registrationId) {
        throw new Error('Invalid QR code format.');
      }

      const response = await fetch(`http://localhost:5000/api/registrations/${registrationId}/check-in`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({ message: `Error: ${data.message}`, status: 'error' });
      } else {
        setResult({ message: `Success: ${data.message}`, status: 'success' });
      }
    } catch (err) {
      setResult({ message: 'Failed to process QR code. Please try again.', status: 'error' });
    }

    // Allow scanning again after a 3-second delay
    setTimeout(() => setIsProcessing(false), 3000);
  };
  
  const styles = {
    container: { maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '20px' },
    scannerContainer: { width: '100%', maxWidth: '500px', margin: '20px auto', border: '5px solid #333', borderRadius: '10px', overflow: 'hidden' },
    resultBox: { padding: '20px', marginTop: '20px', borderRadius: '5px', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' },
    info: { backgroundColor: '#007bff' },
    success: { backgroundColor: '#28a745' },
    error: { backgroundColor: '#dc3545' },
  };

  return (
    <div style={styles.container}>
      <h1>Event Check-In Scanner</h1>
      
      {/* This div is where the scanner will appear */}
      <div id="qr-reader-container" style={styles.scannerContainer}></div>
      <div style={{...styles.resultBox, ...styles[result.status]}}>
        <p>{result.message}</p>
      </div>
    </div>
  );
};

export default CheckInScanner;