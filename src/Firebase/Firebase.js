import firebase from "firebase";
import "firebase/auth";
require("firebase/firestore");

const config = {
  apiKey: "AIzaSyAnZzf9a-H3n3KNY2ODz_aCcjYUxt8x-vY",
  authDomain: "crud-cfc3c.firebaseapp.com",
  databaseURL: "https://crud-cfc3c-default-rtdb.firebaseio.com",
  projectId: "crud-cfc3c",
  storageBucket: "crud-cfc3c.appspot.com",
  messagingSenderId: "701337082568",
  appId: "1:701337082568:web:210b14c935abe7739223fd",
  measurementId: "G-WF37WBW7BK",
};

const firebaseConf = firebase.initializeApp(config);
export const db = firebase.firestore();
export const auth = firebase.auth();
