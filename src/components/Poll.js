import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Poll.css';

function Poll() {
  const [poll, setPoll] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    axios.get('https://taps-backend.onrender.com/poll/')
      .then(response => {
        setPoll(response.data);
        const voted = localStorage.getItem(`voted_poll_${response.data.id}`);
        if (voted) {
          setHasVoted(true);
        }
      })
      .catch(error => console.error('Error fetching poll:', error));
  }, []);

  const handleVote = () => {
    if (!selectedMovie || !poll || hasVoted) return;

    axios.put(`https://taps-backend.onrender.com/poll/${poll.id}/vote/`, { movie: selectedMovie })
      .then(response => {
        setPoll(response.data);
        setHasVoted(true);
        setSelectedMovie(null);
        localStorage.setItem(`voted_poll_${poll.id}`, 'true');
      })
      .catch(error => console.error('Error voting:', error));
  };

  if (!poll) {
    return <div className="poll-loading-seats">Loading poll...</div>;
  }

  return (
    <div className="poll-page-container">
      <div className="poll-form-container">
        <div className="poll-header">
          <h2>Weekly Movie Poll</h2>
          <div className="poll-divider">
            <div className="pub-divider">
              <span></span>
              <div className="pub-icon"></div>
              <span></span>
            </div>
          </div>
          {poll.winning_movie && (
            <div className="poll-subtitle">The winning movie is: {poll.winning_movie}</div>
          )}
          {poll.winning_movie === null && (
            <div className="poll-subtitle">No votes yet.</div>
          )}
        </div>
        <div className="poll-reservation-form">
          {hasVoted ? (
            <div className="poll-seat-selection-notice">You have already voted.</div>
          ) : (
            <>
              <div className="poll-form-grid">
                <div className="poll-form-group">
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
                <div className="poll-form-group">
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
                <div className="poll-form-group">
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
              <div className="poll-submit-container">
                <button
                  className="poll-submit-button"
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