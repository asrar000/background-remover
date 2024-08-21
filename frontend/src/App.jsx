import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { FaDownload } from 'react-icons/fa';

function App() { 
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalImage(URL.createObjectURL(file));
      setProcessedImage(null);
    }
  };

  const handleRemoveBackground = async () => {
    if (fileInputRef.current.files.length > 0) {
      setLoading(true);
  
      const formData = new FormData();
      formData.append('file', fileInputRef.current.files[0]);
  
      try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/remove-background/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        });
  
        const imageUrl = URL.createObjectURL(response.data);
        setProcessedImage(imageUrl);
      } catch (error) {
        console.error('Error removing background:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'processed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <h1 className="heading">Background Remover</h1> {/* Added Heading */}
      
      <div className="image-wrapper">
        <div
          className="image-container clickable"
          onClick={() => fileInputRef.current.click()}
        >
          {originalImage ? (
            <img src={originalImage} alt="Original" className="image" />
          ) : (
            <div className="placeholder">Click to Select Image</div>
          )}
        </div>

        <button 
          className="remove-bg-button" 
          onClick={handleRemoveBackground}
          disabled={!originalImage || loading}
        >
          {loading ? 'Processing...' : 'Remove Background'}
        </button>

        <div className="image-container">
          {processedImage ? (
            <>
              <img src={processedImage} alt="Processed" className="image" />
              <button className="download-button" onClick={handleDownload}>
                <FaDownload />
              </button>
            </>
          ) : (
            <div className="placeholder">Output Image</div>
          )}
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="file-input"
      />
    </div>
  );
}

export default App;
