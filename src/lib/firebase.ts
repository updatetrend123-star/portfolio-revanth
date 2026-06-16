import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDImNHD1TDZUvEN17gPy4_POATh6h2AmWU",
  authDomain: "revanth-profile.firebaseapp.com",
  projectId: "revanth-profile",
  storageBucket: "revanth-profile.firebasestorage.app",
  messagingSenderId: "32777971537",
  appId: "1:32777971537:web:5f80b8e3848a9070515570",
  measurementId: "G-N5V8YBYS2Q"
};

// Initialize Firebase client
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
