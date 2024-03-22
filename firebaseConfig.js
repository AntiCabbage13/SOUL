import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, setDoc,getDoc } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCl7Yjh7VLin6TThK3mXUcvqhoflfMLpas",
  authDomain: "nurturecare-bb46e.firebaseapp.com",
  projectId: "nurturecare-bb46e",
  storageBucket: "nurturecare-bb46e.appspot.com",
  messagingSenderId: "1088026253421",
  appId: "1:1088026253421:web:fb833036e9ff53bb0a0764",
  measurementId: "G-CZ11QQ659X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);