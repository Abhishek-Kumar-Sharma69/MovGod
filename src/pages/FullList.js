// FullList.js
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import './FullList.css'; // Import the CSS file for styling
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import NavBar from './Navbar';
import MovieCard from './MovieCard';
import Loading from './Loading';

const FullList = () => {
  const { listid } = useParams();
  const [movies, setMovies] = useState([]);
  const [listName, setListName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [flag, setFlag] = useState(1);
  const [user] = useAuthState(auth);
  const [loading,setLoading]=useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(1);
        const listDocRef = doc(db, 'users', user.uid, 'lists', listid);
        const listDoc = await getDoc(listDocRef);
        
        if (listDoc.exists()) {
          const listData = listDoc.data();
          setFlag(1);
          setListName(listData.name);
          setMovies(listData.movies);
          setIsPublic(listData.public);
        } else {
          setFlag(0);
          console.error("List does not exist!");
        }
      } catch (error) {
        setFlag(0);
        console.error("Error fetching list: ", error);
      }
      finally{
        setLoading(0);

      }
    };

    fetchList();
  }, [listid, user, movies]);

  const togglePublic = async () => {
    try {
      const listRef = doc(db, 'users', user.uid, 'lists', listid);
      const listDoc = await getDoc(listRef);
      if (listDoc.exists()) {
        const listData = listDoc.data();
        await updateDoc(listRef, {
          public: !listData.public,
        });
        setIsPublic(!listData.public);
      } else {
        console.error("Document does not exist!");
      }
    } catch (error) {
      console.error("Error toggling public status: ", error);
    }
  };

  const shareList = async () => {
    try {
      const listDocRef = doc(db, 'users', user.uid, 'lists', listid);
      const listDoc = await getDoc(listDocRef);
      if (listDoc.exists()) {
        await updateDoc(listDocRef, { public: true });
        setIsPublic(true);
        const shareableLink = `${window.location.origin}/share/${user.uid}/${listid}`;
        navigator.clipboard.writeText(shareableLink).then(() => {
        alert('Shareable link copied to clipboard!');});
      } else {
        console.error("List does not exist!");
      }
    } catch (error) {
      console.error("Error sharing list: ", error);
    }
  };

  const deleteList = async () => {
    try {
        setLoading(1);
      const listDocRef = doc(db, 'users', user.uid, 'lists', listid);
      await deleteDoc(listDocRef);
      navigate('/');
    } catch (error) {
      console.error("Error deleting list: ", error);
    }finally{
        setLoading(0);
    }
  };
//   if(loading)
//     return <><NavBar/><Loading/></>
  return (
    <div>
      <NavBar />
      <div className="list-movies-container">
        <h2>List: {listName}</h2>
        <p>Status: {isPublic ? 'Public' : 'Private'}</p>
        <button onClick={togglePublic}>{isPublic ? 'Make Private' : 'Make Public'}</button>
        <button onClick={shareList}>Share List</button>
        <button onClick={deleteList} className="delete-button">Delete List</button>
        <div className="search-results">
          {flag ? movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          )) : <div className="no-results">No such movies</div>}
        </div>
      </div>
    </div>
  );
};

export default FullList;
