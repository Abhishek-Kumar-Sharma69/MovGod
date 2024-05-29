// src/App.js

import React from 'react';
import { BrowserRouter , Route , Navigate, Routes} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import MovieList from './pages/MovieList'
import { auth } from './firebase/firebase';
import './App.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import AuthRoute from './AuthRoute';
import FullList from './pages/FullList';
import SharedList from './pages/SharedList';

const App = () => {
  const [user] = useAuthState(auth);
 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/"/> : <Login/> } />
        <Route path="/register" element={user ? <Navigate to="/" />: <Register/> } />
        <Route path="/*" element={<AuthRoute />} user={user}/>
        <Route path="/movie/:imdbID" element={<MovieDetail />}/>
        <Route path="/search/:searchTerm" element={ <MovieList />} />
        <Route path="/list/:listid" element={ <FullList/>} />
        <Route path="/share/:userId/:listId" element={<SharedList />} />
        <Route path="/" element={<Home /> } />
      </Routes>
    </BrowserRouter>
  );


};

export default App;
