import React, { useState } from 'react';
import axios from 'axios';

function AdminMoviePollReset() {
  const [movieTitles, setMovieTitles] = useState(['', '', '', '', '']); // Initialize with 5 empty strings
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState(null);

  const handleTitleChange = (index, value) => {
    const newTitles = [...movieTitles];
    newTitles[index] = value;
    setMovieTitles(newTitles);
  };

  const handleResetPoll = () => {
    axios.post('http://localhost:8000/polls/reset/', { movies: movieTitles }) // Replace with your API URL
      .then(() => {
        setResetSuccess(true);
        setResetError(null);
        // Clear inputs after successful reset
        setMovieTitles(['', '', '', '', '']);
      })
      .catch(error => {
        setResetSuccess(false);
        setResetError(error.response ? error.response.data : error.message);
      });
  };

  return (
    <div>
      <h2>Reset Weekly Movie Poll (Admin Only)</h2>
      {resetSuccess && <p style={{ color: 'green' }}>Poll reset successfully!</p>}
      {resetError && <p style={{ color: 'red' }}>Error: {JSON.stringify(resetError)}</p>}
      <ol>
        {movieTitles.map((title, index) => (
          <li key={index}>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(index, e.target.value)}
              placeholder={`Movie ${index + 1} Title`}
            />
          </li>
        ))}
      </ol>
      <button onClick={handleResetPoll}>Reset Poll</button>
    </div>
  );
}

export default AdminMoviePollReset;