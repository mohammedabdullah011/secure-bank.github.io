// firebase.js


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCxKkY-WQvyEdJ41w32DTGisclLLWkbXp8",
    authDomain: "bank-system-3c6d1.firebaseapp.com",
    projectId: "bank-system-3c6d1",
  // Add other config options here
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export the authentication module
export const auth = firebase.auth();

export const firestore = firebase.firestore(); // Export Firestore

export const signup = (email, password, userData) => {
  return auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      // Store additional user data in Firestore
      return firestore.collection('users').doc(user.uid).set(userData);
    });
};