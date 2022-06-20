// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpeR1sIWpxB2hCGPnZwP_XZp_iKu1nqak",
  authDomain: "instagram-2-1f813.firebaseapp.com",
  projectId: "instagram-2-1f813",
  storageBucket: "instagram-2-1f813.appspot.com",
  messagingSenderId: "720290829041",
  appId: "1:720290829041:web:4da173463e77e62dafcf50",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
