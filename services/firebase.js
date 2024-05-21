// Import statements
const { getDoc,getDocs,addDoc,setDoc, doc, writeBatch,collection, query, collectionGroup,where} = require('firebase/firestore');
const { getFirestore } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDY55K4D6ggvqSSD3h4jwB7VOU7zbSyd64",
    authDomain: "arif-9e465.firebaseapp.com",
    databaseURL: "https://arif-9e465-default-rtdb.firebaseio.com",
    projectId: "arif-9e465",
    storageBucket: "arif-9e465.appspot.com",
    messagingSenderId: "700412186025",
    appId: "1:700412186025:web:a6a6c98813b3ac702948b8",
    measurementId: "G-KDLQTCNSSR"
  };
  

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

// Get a reference to the Firestore database
const db = getFirestore(appFirebase);

const loginUser = async (email, password) => {
    try {
        const userDocRef = doc(db, 'users', email);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.password === password) {
                return 'berhasil';
            } else {
                return 'Invalid password';
            }
        } else {
            return 'User not found';
        }
    } catch (error) {
        throw new Error('Failed to login: ' + error.message);
    }
  };

  // Function to add data to Firebase with document ID as email
const registerUser = async (email, nama, password) => {
    try {
      await setDoc(doc(db, "users", email), {
        nama,
        email,
        password,
      });
      return "berhasil";
    } catch (error) {
      throw error;
    }
};

module.exports = {loginUser,registerUser};
  