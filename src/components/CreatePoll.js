import React, { useState } from 'react';
import axios from 'axios';
import './CreatePoll.css'; // Assuming you'll create this CSS file

function CreatePoll() {
  const [movie1, setMovie1] = useState('');
  const [movie2, setMovie2] = useState('');
  const [movie3, setMovie3] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    axios.post('http://localhost:8000/poll/create/', {
      movie1: movie1,
      movie2: movie2,
      movie3: movie3,
    })
      .then(response => {
        setMessage('Poll created successfully!');
        setMovie1('');
        setMovie2('');
        setMovie3('');
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError('Failed to create poll. Please try again.');
        }

      });
  };

  return (
    <div className="create-poll-container">
      <div className="create-poll-form-container">
        <div className="create-poll-header">
          <h2>Create New Movie Poll</h2>
          <div className="create-poll-divider">
            <div className="pub-divider">
              <span></span>
              <div className="pub-icon"></div>
              <span></span>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="create-poll-form">
          <div className="create-poll-form-group">
            <label htmlFor="movie1">Movie 1:</label>
            <input
              type="text"
              id="movie1"
              value={movie1}
              onChange={(e) => setMovie1(e.target.value)}
              required
              className="create-poll-input"
            />
          </div>
          <div className="create-poll-form-group">
            <label htmlFor="movie2">Movie 2:</label>
            <input
              type="text"
              id="movie2"
              value={movie2}
              onChange={(e) => setMovie2(e.target.value)}
              required
              className="create-poll-input"
            />
          </div>
          <div className="create-poll-form-group">
            <label htmlFor="movie3">Movie 3:</label>
            <input
              type="text"
              id="movie3"
              value={movie3}
              onChange={(e) => setMovie3(e.target.value)}
              required
              className="create-poll-input"
            />
          </div>
          <div className="create-poll-submit-container">
            <button type="submit" className="create-poll-submit-button">Create Poll</button>
          </div>
        </form>
        {message && <div className="create-poll-message">{message}</div>}
        {error && <div className="create-poll-error">{error}</div>}
      </div>
    </div>
  );
}

export default CreatePoll;