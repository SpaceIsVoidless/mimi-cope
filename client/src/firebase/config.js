// Firebase configuration
// Replace these values with your Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps > Web app

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCM-Heud0xFjMHKSulloNxtuEyA9IyvMIM",
  authDomain: "mimic---3d-visual-copilot.firebaseapp.com",
  projectId: "mimic---3d-visual-copilot",
  storageBucket: "mimic---3d-visual-copilot.firebasestorage.app",
  messagingSenderId: "690806172382",
  appId: "1:690806172382:web:ecdab566e32c53f5cf304f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
