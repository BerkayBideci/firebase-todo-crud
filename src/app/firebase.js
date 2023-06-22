// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBayeb20UKZ-U5GKsKBtYwthy3zAkvIUcE",
    authDomain: "fir-todo-crud-91709.firebaseapp.com",
    projectId: "fir-todo-crud-91709",
    storageBucket: "fir-todo-crud-91709.appspot.com",
    messagingSenderId: "1057781512611",
    appId: "1:1057781512611:web:2e3eb15aacad44af3b0216",
    measurementId: "G-5QVCLNE6TZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)