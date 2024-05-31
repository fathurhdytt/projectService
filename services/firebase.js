// Import statements
require('dotenv').config();
const { getDoc, getDocs, addDoc, setDoc, doc, writeBatch, collection, query, collectionGroup, where } = require('firebase/firestore');
const { getFirestore } = require('firebase/firestore');
const admin = require('firebase-admin');
const firebase = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { isSupported, getAnalytics } = require('firebase/analytics');

// Initialize Firebase Admin SDK
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
  databaseURL: 'https://arif-9e465-default-rtdb.firebaseio.com'
});

// Your web app's Firebase configuration
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

// Initialize Firebase client app
firebase.initializeApp(firebaseConfig);

let analytics;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics();
  }
});
const auth = getAuth();

// Function to register user with email and password using Admin SDK
const registerUser = async (email, password) => {
    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password
        });
        console.log('Successfully created new user:', userRecord.uid);
        return userRecord.uid;
    } catch (error) {
        console.error('Error creating new user:', error);
        throw error;
    }
};

// Function to log in user with email and password using Client-side SDK
const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Now you have userCredential containing user information
        return userCredential.user.uid;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
};

// Function to verify ID token using Admin SDK
const verifyToken = async (idToken) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        // Here you can handle the authenticated user, e.g., create a session, save to database, etc.
        return uid;
    } catch (error) {
        console.error('Error verifying ID token:', error);
        throw error;
    }
};

module.exports = { registerUser, loginUser, verifyToken };
