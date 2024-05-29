import React, { useState } from 'react';
import { Link,useNavigate ,  } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import './Navbar.css';

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSearch  =  () => {
    navigate(`/search/${searchTerm}`)
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">MovGod</Link>
      </div>
      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="navbar-right">
        <Link to="/" className="my-lists-button">My Lists</Link>
      </div>
      <div className="logout" >
        <button onClick={handleLogout} >Logout</button>
      </div>
    </nav>
  );
};

export default NavBar;
