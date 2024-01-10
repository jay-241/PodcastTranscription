import React, { useState } from 'react';
import Navbar from './Navbar'; 
import './Podcast.css';
function Podcast() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTranscriptions = async () => {
    setLoading(true);
    try {
      // Use the `fetch` function to make a network request to the API.
      const response = await fetch(`${process.env.REACT_APP_API}/show`);
      // Once the response is received, parse the JSON body of the response.
      const data = await response.json();
      if (response.ok) {
        // If the response is successful, set the transcriptions state with the data.
        setTranscriptions(data.transcripts);
      } else {
        // Log an error if the response is not successful.
        console.error('Failed to fetch transcriptions:', data);
      }
    } catch (error) {
      // Catch any errors that occur during the fetch operation.
      console.error('Error fetching transcriptions:', error);
    } finally {
      // Set the loading state to false once the operation is complete.
      setLoading(false);
    }
  };
  
  return (
    <>
      <Navbar />
    <div className="podcast-container"> {/* Added class name for the main container */}
      <h1>Transcriptions</h1>
      <button 
        onClick={fetchTranscriptions} 
        disabled={loading}
        className="fetch-button" 
      >
        {loading ? 'Loading...' : 'Fetch Results'}
      </button>
      <div>
        {transcriptions.length > 0 ? (
          <ul className="transcription-list"> {/* Added class name for the list */}
            {transcriptions.map((transcript, index) => (
              <li key={index}>
                <h2>Transcript {index + 1}</h2>
                <p>{transcript}</p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="message">No transcriptions to display.</p> 
        )}
      </div>
    </div>
  </>
  );
  
}

export default Podcast;
