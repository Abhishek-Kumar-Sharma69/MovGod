import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AddToListPopup from './AddToListPopup';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchLists = async () => {
    if (user) {
      const listsSnapshot = await getDocs(collection(db, 'users', user.uid, 'lists'));
      const listsData = listsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setLists(listsData);
    }
  };

  useEffect(() => {
    fetchLists();
  }, [user,lists]);

  const addMovieToList = async (listId, movie) => {
    if (user) {
      try {
        const listDocRef = doc(db, 'users', user.uid, 'lists', listId);
        const listDoc = await getDoc(listDocRef);
        const listData = listDoc.data();
        await updateDoc(listDocRef, {
          movies: [...listData.movies, movie],
        });
        fetchLists(); // Refresh the list after adding the movie
      } catch (error) {
        console.error("Error adding movie to list: ", error);
      }
    }
  };

  const removeMovieFromList = async (listId, movie) => {
    if (user) {
      try {
        const listDocRef = doc(db, 'users', user.uid, 'lists', listId);
        const listDoc = await getDoc(listDocRef);
        const listData = listDoc.data();
        const updatedMovies = listData.movies.filter(m => m.imdbID !== movie.imdbID);
        await updateDoc(listDocRef, {
          movies: updatedMovies,
        });
        handleClosePopup();
        fetchLists(); // Refresh the list after removing the movie
      } catch (error) {
        console.error("Error removing movie from list: ", error);
      }
    }
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie.imdbID}`);
  };

  const handleAddList = () => {
    setSelectedMovie(movie);
    setShowPopup(true);
    document.body.classList.add('body-overlay'); // Add class to body to prevent background scroll
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedMovie(null);
    document.body.classList.remove('body-overlay'); // Remove class from body to allow background scroll
  };

  return (
    <div className="movie-card" key={movie.imdbID}>
  <div className="movie" onClick={handleCardClick}>
    <div>
      <p>{movie.Year}</p>
    </div>

    <div className="movie-card-image">
      <img src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400"} alt={movie.Title} />
    </div>

    <div className="movie-card-details">
      <span className="movie-card-type">{movie.Type}</span>
      <h3 className="movie-card-title">{movie.Title}</h3>
    </div>
  </div>
  <div className='add-to-list' onClick={handleAddList}>
    <button>Add to List</button>
  </div>

  {showPopup && (
    <AddToListPopup
      movie={selectedMovie}
      lists={lists}
      onClose={handleClosePopup}
      onAddMovie={addMovieToList}
      onRemoveMovie={removeMovieFromList}
    />
  )}
</div>
  );
};

export default MovieCard;
