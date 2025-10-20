import React, { useRef } from 'react'; // Removed useState
import html2canvas from 'html2canvas';
import CertificateTemplate from '../../components/admin/CertificateTemplate';

// This component is the "Template Designer"
const TemplateDesigner = () => {
  // 1. Removed the dummyName and dummyCourse state
  const certificateRef = useRef();

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    const canvas = await html2canvas(certificateRef.current);
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `blank-certificate-template.png`;
    link.click();
  };

  const styles = {
    header: { fontSize: '28px', marginBottom: '25px' },
    container: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
    button: { padding: '8px 15px', border: 'none', borderRadius: '5px', backgroundColor: '#28a745', color: 'white', cursor: 'pointer' },
    previewArea: { marginTop: '20px' },
    info: { fontStyle: 'italic', color: '#555', marginBottom: '15px' },
  };

  return (
    <div>
      <h1 style={styles.header}>Certificate Template Designer</h1>
      
      {/* 2. Removed the container with the input fields */}
      
      <div style={styles.container}>
        <h2 style={{...styles.header, fontSize: '22px'}}>Step 1: Download Your Template</h2>
        <p style={styles.info}>
          Click the button to download the blank template. This image will have empty spaces for the participant's name and event.
        </p>
        <button onClick={handleDownload} style={styles.button}>Download Template as PNG</button>
        
        <h2 style={{...styles.header, fontSize: '22px', marginTop: '20px'}}>Step 2: Upload Your Template</h2>
        <p>
          Go to the <strong>"Upload Certificate"</strong> page (in the sidebar) to attach this template to a real event.
        </p>
      </div>

      {/* 3. The Certificate Preview */}
      <div style={styles.previewArea}>
        <CertificateTemplate 
          ref={certificateRef}
          // Pass blank props to the template component
          name=""
          course=""
          eventName=""
          date=""
        />
      </div>
    </div>
  );
};

export default TemplateDesigner;