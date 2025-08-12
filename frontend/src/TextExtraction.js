// Assuming the file name is text_extraction.js, rename the component to TextExtraction
import React, { useState } from 'react';
import axios from 'axios';
import './TextExtraction.css'

function TextExtraction() {
  const [selectedFile, setSelectedFile] = useState();
  const [extractedText, setExtractedText] = useState('');

  // Generate a preview of the file
  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };

  // Handle file upload and text extraction
  const onExtractText = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/extract-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setExtractedText(response.data.text);
    } catch (error) {
      console.error('Error extracting text:', error);
      setExtractedText('Failed to extract text.');
    }
  };

  return (
    <div className="App">
      <input type="file" onChange={onSelectFile} accept=".pdf" />
      <button onClick={onExtractText}>Extract</button>
      <textarea value={extractedText} readOnly />
    </div>
  );
}

export default TextExtraction;
