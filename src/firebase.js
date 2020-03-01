import firebase from 'firebase';


export const firebaseConfig = {
    apiKey: "AIzaSyBqc4G-r6iQmC0RBEq6XfcCDJKmGMj6_Cw",
    authDomain: "projecthunt-3268c.firebaseapp.com",
    databaseURL: "https://projecthunt-3268c.firebaseio.com",
    projectId: "projecthunt-3268c",
    storageBucket: "projecthunt-3268c.appspot.com",
    messagingSenderId: "633870399945",
    appId: "1:633870399945:web:1c0a42e8de96238e4f1018",
    measurementId: "G-MR3N35GFZS"
};


firebase.initializeApp(firebaseConfig)
export const fireStore = firebase.firestore()
export const fireStorage = firebase.storage()