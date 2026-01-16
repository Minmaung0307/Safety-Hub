const firebaseConfig = {
    apiKey: "AIzaSyDuG5l6RwgpC05s9ru7tOlXM1IdrGetJzg",
  authDomain: "safety-hub1.firebaseapp.com",
  projectId: "safety-hub1",
  storageBucket: "safety-hub1.firebasestorage.app",
  messagingSenderId: "64942037168",
  appId: "1:64942037168:web:8a7aca904a10f3319d0375",
  measurementId: "G-R0ETES1KCY"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var storage = firebase.storage();