import React, { forwardRef } from 'react';

// We use forwardRef to pass a 'ref' from the parent component down to the DOM element.
// This allows the parent to get a direct handle on the certificate div for html2canvas.
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
    participantName: { fontSize: '36px', fontWeight: 'bold', color: '#785E2F', margin: '20px 0', borderBottom: '2px solid #ccc' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    signatureBlock: { textAlign: 'center' },
    signatureLine: { borderTop: '2px solid #333', width: '200px', margin: '0 auto' },
    signatureLabel: { marginTop: '5px' },
  };

  return (
    // The ref is attached here
    <div ref={ref} style={styles.certificateWrapper}>
      <header style={styles.header}>
        <h1 style={styles.title}>Certificate of Completion</h1>
        <h2 style={styles.subtitle}>This certificate is proudly presented to</h2>
      </header>
      
      <main style={styles.body}>
        <div style={styles.participantName}>{name}</div>
        <p style={styles.mainText}>
          for successfully completing the <strong>{eventName}</strong>.<br />
          This demonstrates their commitment and skills in the field.
        </p>
      </main>
      
      <footer style={styles.footer}>
        <div style={styles.signatureBlock}>
          <div style={styles.signatureLine}></div>
          <p style={styles.signatureLabel}>Event Coordinator</p>
        </div>
        <div>
          <p>Date: {date}</p>
        </div>
      </footer>
    </div>
  );
});

export default CertificateTemplate;