import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ResumeForm from './ResumeForm';
import Resume from './Resume';
import { useState } from 'react';

function ResumeGenerator() {
  const [resumeData, setResumeData] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const resumeRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
  });

  // Use onResumeReady for compatibility
  const handleResumeReady = (data) => {
    setResumeData(data);
    setShowReview(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa', padding: 0, margin: 0 }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '2rem 0' }}>
        <ResumeForm onResumeReady={handleResumeReady} />
        {showReview && (
          <div style={{ marginTop: 40, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0002', padding: '2rem', width: '100%' }}>
            <h2 style={{ color: '#2196F3', textAlign: 'center', marginBottom: 24 }}>Resume Preview</h2>
            <div style={{ background: '#f7f8f8', borderRadius: 12, padding: 32, minHeight: 400 }}>
              <Resume ref={resumeRef} data={resumeData || {}} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button onClick={handlePrint} style={{ background: '#2196F3', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 18, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>
                Download / Print Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeGenerator;
