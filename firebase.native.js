import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtm_qQnPjvSf_KTt1i7q2zDU8QhL_SFIM",
  authDomain: "movie-explore-appp.firebaseapp.com",
  projectId: "movie-explore-appp",
  storageBucket: "movie-explore-appp.firebasestorage.app",
  messagingSenderId: "157373101889",
  appId: "1:157373101889:web:d9f2dd13e7b480ccd2d3c0",
  measurementId: "G-CJZNS9Z3CC",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);