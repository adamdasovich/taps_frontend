import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Poll.css';

function Poll() {
  const [poll, setPoll] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [hasVoted, setHasVoted] = useState(false); // Track if user has voted

  useEffect(() => {
    axios.get('http://localhost:8000/poll/')
      .then(response => {
        setPoll(response.data);
        // Check local storage to see if user has already voted
        const voted = localStorage.getItem(`voted_poll_${response.data.id}`);
        if (voted) {
          setHasVoted(true);
        }
      })
      .catch(error => console.error('Error fetching poll:', error));
  }, []);

  const handleVote = () => {
    if (!selectedMovie || !poll || hasVoted) return;

    axios.put(`http://localhost:8000/poll/${poll.id}/vote/`, { movie: selectedMovie })
      .then(response => {
        setPoll(response.data);
        setHasVoted(true);
        setSelectedMovie(null);
        // Store in local storage that user has voted
        localStorage.setItem(`voted_poll_${poll.id}`, 'true');
      })
      .catch(error => console.error('Error voting:', error));
  };

  if (!poll) {
    return <div className="loading-seats">Loading poll...</div>;
  }

  return (
    <div className="booking-page-container">
      <div className="booking-form-container booking-animated">
        <div className="booking-header">
          <h2>Weekly Movie Poll</h2>
          <div className="booking-divider">
            <div className="pub-divider">
              <span></span>
              <div className="pub-icon"></div>
              <span></span>
            </div>
          </div>
          {poll.winning_movie && (
            <div className="booking-subtitle">The winning movie is: {poll.winning_movie}</div>
          )}
          {poll.winning_movie === null && (
            <div className="booking-subtitle">No votes yet.</div>
          )}
        </div>
        <div className="reservation-form">
          {hasVoted ? (
            <div className="seat-selection-notice">You have already voted.</div>
          ) : (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <input
                      type="radio"
                      value={poll.movie1}
                      checked={selectedMovie === poll.movie1}
                      onChange={() => setSelectedMovie(poll.movie1)}
                    />
                    {poll.movie1} ({poll.movie1_votes} votes)
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="radio"
                      value={poll.movie2}
                      checked={selectedMovie === poll.movie2}
                      onChange={() => setSelectedMovie(poll.movie2)}
                    />
                    {poll.movie2} ({poll.movie2_votes} votes)
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="radio"
                      value={poll.movie3}
                      checked={selectedMovie === poll.movie3}
                      onChange={() => setSelectedMovie(poll.movie3)}
                    />
                    {poll.movie3} ({poll.movie3_votes} votes)
                  </label>
                </div>
              </div>
              <div className="submit-container">
                <button
                  className="submit-button"
                  onClick={handleVote}
                  disabled={!selectedMovie}
                >
                  Vote
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Poll;