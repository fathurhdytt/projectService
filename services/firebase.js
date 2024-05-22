// Import statements
require('dotenv').config();
const { getDoc,getDocs,addDoc,setDoc, doc, writeBatch,collection, query, collectionGroup,where} = require('firebase/firestore');
const { getFirestore } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const admin = require('firebase-admin'); // path to your serviceAccountKey.json file

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
  }),
  databaseURL: 'https://arif-9e465-default-rtdb.firebaseio.com' // Replace with your database URL
});

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

const verifyToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    // Here you can handle the authenticated user, e.g., create a session, save to database, etc.
    return uid;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(401).send({ error: 'Invalid ID token' });
  }
};


module.exports = {loginUser,registerUser,verifyToken};
  