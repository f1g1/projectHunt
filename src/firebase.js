import firebase from 'firebase';


var firebaseConfig = {
    apiKey: "AIzaSyAueqYGiXRddw8fmqzkN01aBJXu_SbkAnA",
    authDomain: "projecthunt-2644e.firebaseapp.com",
    databaseURL: "https://projecthunt-2644e.firebaseio.com",
    projectId: "projecthunt-2644e",
    storageBucket: "projecthunt-2644e.appspot.com",
    messagingSenderId: "735459026668",
    appId: "1:735459026668:web:8184ca2004dbd2433d67c9",
    measurementId: "G-VPQY1Q2HBB"
};


firebase.initializeApp(firebaseConfig)
export const fireStore = firebase.firestore()
export const fireStorage = firebase.storage()