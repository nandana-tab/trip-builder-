import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  projectId: "soy-atrium-wf6jr",
  appId: "1:105298230520:web:a141e594cdb67fc5674f0d",
  apiKey: "AIzaSyC0QiQ86x8_SORrJqBOk9bluJXvr-KVaYI",
  authDomain: "soy-atrium-wf6jr.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-tripbuilder-7f2b02d7-6a5c-45d9-bee0-4b2c39daaad3",
  storageBucket: "soy-atrium-wf6jr.firebasestorage.app",
  messagingSenderId: "105298230520",
  measurementId: "",
  oAuthClientId: "105298230520-o61evd5h0lmate2318cah108g8ccr71e.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore with configured databaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

export default app;
