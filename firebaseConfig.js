import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, setDoc,getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCl7Yjh7VLin6TThK3mXUcvqhoflfMLpas",
  authDomain: "nurturecare-bb46e.firebaseapp.com",
  projectId: "nurturecare-bb46e",
  storageBucket: "nurturecare-bb46e.appspot.com",
  messagingSenderId: "1088026253421",
  appId: "1:1088026253421:web:fb833036e9ff53bb0a0764",
  measurementId: "G-CZ11QQ659X"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);