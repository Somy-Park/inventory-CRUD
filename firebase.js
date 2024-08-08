// Import the functions you need from the SDKs you need
import { getAutoHeightDuration } from "@mui/material/styles/createTransitions";
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKke5aj6xsWb3UxzJ93t0hJJ2p4Lt5iG0",
  authDomain: "inventory-management-15bee.firebaseapp.com",
  projectId: "inventory-management-15bee",
  storageBucket: "inventory-management-15bee.appspot.com",
  messagingSenderId: "10037063426", 
  appId: "1:10037063426:web:d85f4e6d7a55aaafac5c1b",
  measurementId: "G-YWQGCF46DY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();

// Export it to access firestore for other files
export {firestore}
export {auth, provider}