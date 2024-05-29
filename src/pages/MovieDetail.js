// src/components/MovieDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetail.css';
import NavBar from './Navbar';
import Loading from './Loading';
import "./MovieList.css"

const MovieDetail = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  let error =0;
  const [loading,setLoading]=useState(1);
  useEffect(() => {
    setLoading(1);
    const fetchMovieDetails = async () => {
        try{
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=396e9320`);
      const data = await response.json();
      setMovie(data);
      
      }
        finally{
            setLoading(0);
        }
    };
    
    fetchMovieDetails();
    
  }, [imdbID]);
  if(loading)
    return <Loading/>;
 
    return (
    <div>
    <NavBar />
    <div className="movie-detail">
      {movie ? <div><h1>{movie.Title}</h1>
      <img src={movie.Poster} alt={movie.Title} />
      <p><strong>Actors:</strong> {movie.Actors}</p>
      <p><strong>Genre:</strong> {movie.Genre}</p>
      <p><strong>Plot:</strong> {movie.Plot}</p>
      <p><strong>Released:</strong> {movie.Released}</p>
      <p><strong>Runtime:</strong> {movie.Runtime}</p>
      <p><strong>Director:</strong> {movie.Director}</p>
      <p><strong>Writer:</strong> {movie.Writer}</p>
      <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
    </div>:<div> No such movie available </div>}
    </div>
    </div>
  );
  

};

export default MovieDetail;
