import firebase from "firebase";
import React from "react";
// import { collection, query, where, getDocs } from "firebase/firestore";

var config = {
  apiKey: "AIzaSyDW0ADXzeuNGOk6LtvTrGRDQF2nBOoOUX0",
  authDomain: "chennaigatedcommunity-ed001.firebaseapp.com",
  projectId: "chennaigatedcommunity-ed001",
  storageBucket: "chennaigatedcommunity-ed001.appspot.com",
  messagingSenderId: "1070534342549",
  appId: "1:1070534342549:web:3e8896218fb0a4678fe89c",
  measurementId: "G-5Y1CW3679D",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
  firebase.app(); // if already initialized, use that one
}

// Initialize Firebase

export var db = firebase.firestore();
// var db = ""
