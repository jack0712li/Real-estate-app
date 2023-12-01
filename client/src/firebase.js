// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FILEBASE_API_KEY,
  authDomain: "real-estate-app-dab8b.firebaseapp.com",
  projectId: "real-estate-app-dab8b",
  storageBucket: "real-estate-app-dab8b.appspot.com",
  messagingSenderId: "107814478663",
  appId: "1:107814478663:web:6d547402e662a2a67f2262"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);