// src/Signup.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import "./Register.css";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signUpWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      console.error("Google sign-up error", error);
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error("Email/password sign-up error", error);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-heading">Sign Up</h2>
      <form onSubmit={registerUser} className="register-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit" className="register-button">Sign Up</button>
      </form>
      <button onClick={signUpWithGoogle} className="register-button">Sign up with Google</button>
      <p>
        Already registered? <a onClick={() => navigate('/login')}>Login here</a>
      </p>
    </div>
  );
};

export default Signup;
