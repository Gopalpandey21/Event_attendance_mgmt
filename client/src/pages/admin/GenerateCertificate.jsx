import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import CertificateTemplate from '../../components/admin/CertificateTemplate';

// DUMMY DATA: In a real app, this would come from your backend.
const completedEvents = [
  { id: '1', title: 'React Workshop', date: '2025-10-10' },
  { id: '3', title: 'UI/UX Design Principles', date: '2025-09-25' },
];

const participantsByEvent = {
  '1': [
    { id: 'p1', name: 'Alice Johnson', course: 'BCA' },
    { id: 'p2', name: 'Bob Williams', course: 'MCA' },
  ],
  '3': [
    { id: 'p3', name: 'Charlie Brown', course: 'B.Tech CSE' },
  ],
};

const GenerateCertificate = () => {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const certificateRef = useRef();

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    const canvas = await html2canvas(certificateRef.current);
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `certificate-${selectedParticipant.name.replace(' ', '-')}.png`;
    link.click();
  };

  const currentEvent = completedEvents.find(e => e.id === selectedEventId);
  const participants = selectedEventId ? participantsByEvent[selectedEventId] : [];
  
  const styles = {
    // ... (styles defined below)
  };

  return (
    <div>
      <h1 style={styles.header}>Generate Certificates</h1>
      
      {/* Event Selection */}
      <div style={styles.container}>
        <label htmlFor="event-select" style={styles.label}>1. Select an Event:</label>
        <select id="event-select" value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)} style={styles.select}>
          <option value="">-- Choose an event --</option>
          {completedEvents.map(event => (
            <option key={event.id} value={event.id}>{event.title}</option>
          ))}
        </select>
      </div>

      {/* Participant List */}
      {selectedEventId && (
        <div style={styles.container}>
          <h2 style={styles.subHeader}>2. Select a Participant to Generate Certificate</h2>
          <div style={styles.list}>
            {participants.map(p => (
              <div key={p.id} style={styles.listItem}>
                <span>{p.name} ({p.course})</span>
                <button onClick={() => setSelectedParticipant(p)} style={styles.button}>Generate</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {selectedParticipant && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <CertificateTemplate 
              ref={certificateRef}
              name={selectedParticipant.name}
              course={selectedParticipant.course}
              eventName={currentEvent.title}
              date={currentEvent.date}
            />
            <div style={styles.modalActions}>
              <button onClick={handleDownload} style={styles.button}>Download as PNG</button>
              <button onClick={() => setSelectedParticipant(null)} style={{...styles.button, backgroundColor: '#6c757d'}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// Styles for the GenerateCertificate component
const styles = {
  header: { fontSize: '28px', marginBottom: '25px' },
  subHeader: { fontSize: '22px', marginBottom: '15px' },
  container: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
  label: { fontWeight: 'bold', marginRight: '10px' },
  select: { padding: '10px', fontSize: '16px', minWidth: '300px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' },
  button: { padding: '8px 15px', border: 'none', borderRadius: '5px', backgroundColor: '#28a745', color: 'white', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  modalActions: { marginTop: '20px', display: 'flex', gap: '15px' },
};

export default GenerateCertificate;