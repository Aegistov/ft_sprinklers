import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAiPg4F4t0kVQ4AqLZISYeJhOlQ8yf15pw",
    authDomain: "ft-sprinklers.firebaseapp.com",
    databaseURL: "https://ft-sprinklers.firebaseio.com",
    projectId: "ft-sprinklers",
    storageBucket: "ft-sprinklers.appspot.com",
    messagingSenderId: "324804803769"
};

const kConfig = {
    apiKey: "aAxhPEhI5yKEcsQJ1AXjufYehiZ7Nm0RwdpCCBIn",
    authDomain: "sprink-3680f.firebaseapp.com",
    databaseURL: "https://sprink-3680f.firebaseio.com",
    projectId: "sprink-3680f",
    storageBucket: "sprink-3680f.appspot.com",
    messagingSenderId: "492472444407"
}

let fire = firebase.initializeApp(kConfig);

module.exports.fireDB = fire.database();
