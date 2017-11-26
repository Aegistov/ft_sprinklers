import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAiPg4F4t0kVQ4AqLZISYeJhOlQ8yf15pw",
    authDomain: "ft-sprinklers.firebaseapp.com",
    databaseURL: "https://ft-sprinklers.firebaseio.com",
    projectId: "ft-sprinklers",
    storageBucket: "ft-sprinklers.appspot.com",
    messagingSenderId: "324804803769"
  };
let fire = firebase.initializeApp(config);

module.exports.fireDB = fire.database();
