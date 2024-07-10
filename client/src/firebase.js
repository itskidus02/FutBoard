// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "soccerboardpro.firebaseapp.com",
  projectId: "soccerboardpro",
  storageBucket: "soccerboardpro.appspot.com",
  messagingSenderId: "928611599383",
  appId: "1:928611599383:web:8d3728d280e8db84d04852"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
