import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAqvSpIYEk68CazVlP0gTv-pQZRJWqHnCQ",
  authDomain: "mobiiliprojekti-ee10f.firebaseapp.com",
  projectId: "mobiiliprojekti-ee10f",
  storageBucket: "mobiiliprojekti-ee10f.appspot.com",
  messagingSenderId: "1022912506300",
  appId: "1:1022912506300:web:6742017a171ebaf98363b9",
  measurementId: "G-7P4Z0JGEWS"
}

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export {firebase}