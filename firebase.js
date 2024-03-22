import { firebase } from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const firebaseConfig = {
  // Your Firebase project configuration
  apiKey: "AIzaSyBfeCY_ZFAyQ0vo8I7fTtKKQJByD5SUEzM",
  authDomain: "nurturecare-bb46e.firebaseapp.com",
  projectId: "nurturecare-bb46e",
  storageBucket: "nurturecare-bb46e.appspot.com",
  messagingSenderId: "1088026253421",
  appId: "1:1088026253421:android:358ab6d0beb27c820a0764"
  
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
