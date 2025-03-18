import React, {useState, useEffect} from 'react'
import axios from 'axios'

const MoviePoll = () => {

  const [movies, setMovies] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8000/polls/')
      .then(res => {
        setMovies(res.data)
        console.log(res.data)
      })
      .catch(err => console.log(err))
  }, [])

  const handleVote = (movieId) => {
    axios.put(`http://localhost:8000/polls/${movieId}/vote/`)
      .then(res => {
        setMovies(movies.map(movie => 
            movie.id === movieId ? res.data : movie
        ))
      })
      .catch(err => console.log(err))
  }

  return (
    <div>
         <h2>Weekly Movie Poll</h2>
                <ul>
                    {movies.map(movie => (
                        <li key={movie.id}>
                            {movie.title} - Votes: {movie.votes}
                            <button onClick={() => handleVote(movie.id)}>Vote</button>
                        </li>
                    ))}
                </ul>
    </div>
  )
}

export default MoviePoll