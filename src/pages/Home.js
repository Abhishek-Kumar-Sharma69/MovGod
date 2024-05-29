import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, doc, onSnapshot, addDoc, updateDoc, getDoc, orderBy } from 'firebase/firestore';
import NavBar from './Navbar';
import MovieCard from './MovieCard';
import { useNavigate } from 'react-router-dom';
import './Home.css';


const Home = () => {
  const [user] = useAuthState(auth);
  const [lists, setLists] = useState([]);
  const navigate=useNavigate();
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    if (user) {
      const listsCollectionRef = collection(db, 'users', user.uid, 'lists');
      const orderedListsQuery = query(listsCollectionRef, orderBy('createdAt', 'desc')); // Order by createdAt field
      const unsubscribe = onSnapshot(orderedListsQuery, (snapshot) => {
        const listsData = [];
        snapshot.forEach((doc) => listsData.push({ ...doc.data(), id: doc.id }));
        setLists(listsData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const createList = async () => {
    if (newListName && user) {
      try {
        const listsCollectionRef = collection(db, 'users', user.uid, 'lists');
        const createdAt = new Date(); // Get the current timestamp
        await addDoc(listsCollectionRef, {
          name: newListName,
          owner: user.uid,
          public: false,
          movies: [],
          createdAt: createdAt, // Add a createdAt field
        });
        setNewListName('');
      } catch (error) {
        console.error("Error creating list: ", error);
      }
    }
  };
 
  const togglePublic = async (listId) => {
    try {
      const listRef = doc(db, 'users', user.uid, 'lists', listId);
      const listDoc = await getDoc(listRef);
      if (listDoc.exists()) {
        const listData = listDoc.data();
        await updateDoc(listRef, {
          public: !listData.public,
        });
      } else {
        console.error("Document does not exist!");
      }
    } catch (error) {
      console.error("Error toggling public status: ", error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="home">
        <div className="create-list">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New List Name"
          />
          <button onClick={createList}>Create List</button>
        </div>
        <div className="lists">
          {lists.map((list) => (
            <div key={list.id} className="list">
              <h2>{list.name}</h2>
              <button className="make-public-button" onClick={() => togglePublic(list.id)}>
                {list.public ? 'Make Private' : 'Make Public'}
              </button>
              <div className="movies">
                {list.movies.slice(0, 3).map((movie, index) => (
                  <MovieCard key={index} movie={movie} />
                ))}
                <button className="view-full-list" onClick={() => navigate(`/list/${list.id}`)}>
                  View Full List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
