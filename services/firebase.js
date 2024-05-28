// Import statements
require('dotenv').config();
const { getDoc,getDocs,addDoc,setDoc, doc, writeBatch,collection, query, collectionGroup,where} = require('firebase/firestore');
const { getFirestore } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const admin = require('firebase-admin');

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

// Function to register user with email and password
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

const loginUser = async (email, password) => {
  try {
      const userCredential = await admin.auth().signInWithEmailAndPassword(email, password);
      // Now you have userCredential containing user information
      return userCredential.user.uid;
  } catch (error) {
      console.error('Error signing in:', error);
      throw error;
  }
};

// Function to verify ID token
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
