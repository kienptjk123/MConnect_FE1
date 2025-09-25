import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBOWHZzK5_xM2OsPqqQ1WR5cwmCJAG-lhU",
  authDomain: "mconnectnotification.firebaseapp.com",
  projectId: "mconnectnotification",
  storageBucket: "mconnectnotification.firebasestorage.app",
  messagingSenderId: "1030936788684",
  appId: "1:1030936788684:web:899ab2df064f064b6f4c69",
  measurementId: "G-0Z3JLXXL6Z",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Your VAPID key from Firebase Console
const VAPID_KEY =
  "BP-ilQL7XBW3evB_RI4-mwQaRoIMs9z5OQFtBMhlqS3la4skx8PDsXD2rzHGmI7jHzzCUNfDKYwNKuokiiW9YlM	";

export { messaging, VAPID_KEY };
