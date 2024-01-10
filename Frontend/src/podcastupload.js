import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; 
import './PodcastUpload.css'
function PodcastUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select an audio file to upload.');
      return;
    }

    

    const apiUrl = `${process.env.REACT_APP_API}/podcastupload`;

    try {
      // Step 1: Request a pre-signed URL from your Lambda function
      const urlResponse = await fetch(apiUrl, {
        method: 'POST' // or 'POST', depending on your Lambda setup
      });

      const { url } = await urlResponse.json();
      console.log(url); 
      if (urlResponse.ok && url) {
        // Step 2: Use the pre-signed URL to upload the file directly to S3
        const uploadResponse = await fetch(url, {
          method: 'PUT',
          body: selectedFile
        });

        if (uploadResponse.ok) {
          setMessage('File uploaded successfully!');
          navigate('/podcast');
        } else {
          setMessage('Error during file upload.');
        }
      } else {
        setMessage('Error fetching pre-signed URL.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('An error occurred during upload.');
    }
  };

  return (
    <>
      <Navbar />
    <div className="upload-container">
      <h2 className="upload-heading">Upload Your Podcast</h2>
      <p className="upload-paragraph">Choose an audio file to transcribe into text:</p>
      <input type="file" className="upload-file-input" onChange={handleFileChange} />
      <button className="upload-button" onClick={handleUpload}>Upload</button>
      <div className="upload-message">{message}</div>
    </div>
    </>
  );
  
}

export default PodcastUpload;
