import React from 'react';
import './AddToListPopup.css';

const AddToListPopup = ({ movie, lists, onClose, onAddMovie , onRemoveMovie}) => {
    const isMovieInList = (list, movie) => list.movies.some(m => m.imdbID === movie.imdbID);
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3 className="popup-title">Add "{movie.Title}" to a list</h3>
        <ul className="popup-list">
          {lists.map((list) => (
            <li key={list.id} className="popup-list-item">
            <span className="popup-list-name">{list.name}</span>
              <button
                className={`popup-list-button ${isMovieInList(list, movie) ? 'added' : ''}`}
                onClick={() => {
                  if (isMovieInList(list, movie)) {
                    onRemoveMovie(list.id, movie); // Remove the movie from the list
                  } else {
                    onAddMovie(list.id, movie); // Add the movie to the list
                  }
                }}
              >
                {isMovieInList(list, movie) ? '-' : '+'}
              </button>
            </li>
          ))}
        </ul>
        <button className="popup-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AddToListPopup;
