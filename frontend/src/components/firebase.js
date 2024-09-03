// firebase.js
import firebase from 'firebase/compat/app'; // Change this line
import 'firebase/compat/auth'; // Add this line

const firebaseConfig = {
  apiKey: "AIzaSyBeRarnr0bnFvvUvnvJMEAoJ-dywWE6Vmw",
  authDomain: "wardrobe-1fbe5.firebaseapp.com",
  projectId: "wardrobe-1fbe5",
  storageBucket: "wardrobe-1fbe5.appspot.com",
  messagingSenderId: "819138229625",
  appId: "1:819138229625:web:14b6be3660ec29f4b8aba8",
  measurementId: "G-WC2WPRE9TP"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
