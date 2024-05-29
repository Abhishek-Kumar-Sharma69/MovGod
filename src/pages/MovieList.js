import React, { useEffect, useState } from "react";
import NavBar from './Navbar';
import MovieCard from './MovieCard';
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import "./MovieList.css"

const MovieList = () => {
    const {searchTerm}=useParams();
    const [loading,setLoading]=useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const [flag,setFlag]=useState(1);
    useEffect(()=>{
        setLoading(1);
        const fetchMovies=async ()=>{
        if (searchTerm) {
        try {
          const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=fb85210e`);
          const data = await response.json();
          if (data.Search) {
            setFlag(1);
            setSearchResults(data.Search);
          }
          else
          setFlag(0);
          
        } catch (error) {
            setFlag(0);
            setSearchResults([]);
          console.error("Error searching movies: ", error);
        }
        finally{
            setLoading(0);
        }
    }
    }
    fetchMovies();
    },[searchTerm]);
    if(loading)

        return <div><NavBar/><Loading/></div>
    else    
    return (<div><NavBar/><div className="search-results">
    {flag ? searchResults.map((movie) => (
      <MovieCard key={movie.imdbID} movie={movie}  />
    )):<div className="no-results">No such movies</div>}</div></div>);



  };

  export default MovieList;