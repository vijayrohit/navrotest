import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUYMO5P9Vbu2HI5ccKr8IZn7rngI3UJhU",
  authDomain: "test-c8b12.firebaseapp.com",
  projectId: "test-c8b12",
  storageBucket: "test-c8b12.appspot.com",
  messagingSenderId: "471546468868",
  appId: "1:471546468868:web:77950a406a4a78bbc2b351",
  measurementId: "G-TK89DM300V"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
