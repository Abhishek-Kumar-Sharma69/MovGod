// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-EJFyGMvWiL0A0N1kjJr5X29KNWsWMg4",
  authDomain: "movgod-77191.firebaseapp.com",
  projectId: "movgod-77191",
  storageBucket: "movgod-77191.appspot.com",
  messagingSenderId: "94866415024",
  appId: "1:94866415024:web:ddd94fd77d8e257bafca75",
  measurementId: "G-G3Z3G500ZK"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service

export const googleProvider = new GoogleAuthProvider();
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(firebaseApp);  // Ensure this line initializes Firestore
export const auth = getAuth(firebaseApp);

export default firebaseApp;


