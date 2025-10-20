import React, { forwardRef } from 'react';

// This component is now just a VISUAL PREVIEW for the admin
const CertificateTemplate = forwardRef(({ name, course, eventName, date }, ref) => {
  const styles = {
    certificateWrapper: {
      width: '800px',
      height: '565px',
      padding: '40px',
      border: '10px solid #785E2F',
      backgroundColor: '#f4f0e6',
      fontFamily: "'Georgia', serif",
      color: '#333',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
    },
    header: { textAlign: 'center' },
    title: { fontSize: '48px', color: '#1a3a6e', margin: '0' },
    subtitle: { fontSize: '20px', margin: '10px 0' },
    body: { textAlign: 'center', margin: '40px 0' },
    mainText: { fontSize: '18px', lineHeight: '1.6' },
    
    // --- FIX: Styles for the blank spaces ---
    participantName: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#785E2F',
      margin: '20px 0',
      borderBottom: '2px solid #ccc',
      minHeight: '40px' // Ensures the line is visible
    },
    participantCourse: {
      fontSize: '20px',
      color: '#555',
      margin: '0',
      minHeight: '25px' // Ensures space is visible
    },
    eventNameText: { // Style for the static text
      fontSize: '18px', 
      lineHeight: '1.6'
    },
    
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    signatureBlock: { textAlign: 'center' },
    signatureLine: { borderTop: '2px solid #333', width: '200px', margin: '0 auto' },
    signatureLabel: { marginTop: '5px' },
  };

  return (
    <div ref={ref} style={styles.certificateWrapper}>
      <header style={styles.header}>
        <h1 style={styles.title}>Certificate of Completion</h1>
        <h2 style={styles.subtitle}>This certificate is proudly presented to</h2>
      </header>
      
      <main style={styles.body}>
        {/* --- FIX: We show blank spaces, NOT dummy text --- */}
        <div style={styles.participantName}>&nbsp;</div>
        <div style={styles.participantCourse}>&nbsp;</div> 
        
        <p style={styles.eventNameText}>
          for successfully completing the <strong>EVENT NAME WILL BE HERE</strong>.
        </p>
      </main>
      
      <footer style={styles.footer}>
        <div style={styles.signatureBlock}>
          <div style={styles.signatureLine}></div>
          <p style={styles.signatureLabel}>Event Coordinator</p>
        </div>
        <div>
          {/* We can leave the date text here as a placeholder */}
          <p>Date: Date will be added here</p>
        </div>
      </footer>
    </div>
  );
});

export default CertificateTemplate;