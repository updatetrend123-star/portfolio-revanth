import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDImNHD1TDZUvEN17gPy4_POATh6h2AmWU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "revanth-profile.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "revanth-profile",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "revanth-profile.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "32777971537",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:32777971537:web:5f80b8e3848a9070515570",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-N5V8YBYS2Q"
};

// Initialize Firebase client
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
