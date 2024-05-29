import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, doc, getDoc,getDocs, query,where } from 'firebase/firestore';
import './FullList.css'; // Import the CSS file for styling
import { useParams } from 'react-router-dom';
import NavBar from './Navbar';
import MovieCard from './MovieCard';
import Loading from './Loading';

const SharedList = () => {
  const { userId, listId } = useParams(); // URL is /share/:userId/:listId
  const [movies, setMovies] = useState([]);
  const [listName, setListName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [flag, setFlag] = useState(1);
  const[loading,setLoading]=useState(0);
  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(1);
        const listDocRef = doc(db, 'users', userId, 'lists', listId);
        const listDoc = await getDoc(listDocRef);

        if (listDoc.exists()) {
          const listData = listDoc.data();
          console.log('Found list data:', listData);

          if (listData.public) {
            setListName(listData.name);
            setMovies(listData.movies);
            setIsPublic(listData.public);
          } else {
            setFlag(0);
            console.error("List is private!");
          }
        } else {
          setFlag(0);
          console.error("List does not exist!");
        }
      } catch (error) {
        setFlag(0);
        console.error("Error fetching list:", error);
      }finally{
        setLoading(0);
      }
    };

    fetchList();
  }, [userId, listId]);
  if(loading)
    return <><NavBar/><Loading/></>
  return (
    <div>
      <NavBar />
      <div className="list-movies-container">
        <h2>List: {listName}</h2>
        {isPublic ? (
          flag ? (
            <div className="search-results">
              {movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
          ) : (
            <div className='no-results'>No movies in this list</div>
          )
        ) : (
          <div className="no-results">This list is private or may does not exist</div>
        )}
      </div>
    </div>
  );
};

export default SharedList;
