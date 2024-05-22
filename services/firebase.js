// Import statements
const { getDoc,getDocs,addDoc,setDoc, doc, writeBatch,collection, query, collectionGroup,where} = require('firebase/firestore');
const { getFirestore } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const admin = require('firebase-admin'); // path to your serviceAccountKey.json file

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "arif-9e465",
    "private_key_id": "01c3a2633f39b0c627a521da04493982564def93",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2FOjdZwuEfkcq\nbibA/+U49dzu/G1WuE1mb+A95JgYgyx4gRdcdHHbnDdgrSZJA7dw4v9sDS20Lzwm\nyyRnDgHEWRXV4AUpn9FE62XeOdxmqf2J/wwt9mjVBS1NGm0CQ7g/KjxnFhjb8ktk\n8+dpqTuXptbfALBj7Mhmounmd9iUQNBpxzQmzT9ewWyx5B05x7x1lHjy7Pak5k8i\nNVtp9S2AKVqxkoN99cJ4N0XLks/ZB8gITi60xO15iHgF8hEtY8IhaadsLHhVBkW3\nM0PjzR8SdJ0X8ROye4wAdDoyxG1OFbyGuZd4sNtVsgtQwawv00fp8TC/xrjkvNJ+\n27gYCtCNAgMBAAECggEAH4ftb3HJv87yWfmrQl7N/hgtg0E5Wfwegy+6gF1WrWAB\n0nhgaEVN9j7OJDK334sCOE1G+BosIPjRDNK+4g295peavWfG3Rds8Odmw533edvU\nKRJ+tHLoYoM7/g8mc27wuBeDUEK2WVhTEA9gsp540GE28nU3FobJiWSK5rs4SSvI\n2Lx41bGQZaIpncMUv8AVUIx8a4eFowZE2wh+9C6yFCjjSi7OEl1fBTaClm4WxIdL\nz/NBcYRTaLVGEqSb2p3JKduzfneUrjNYS1JXJrpBv+kJZqjD7vZ1UzTm6CVjPThp\nF6H8Ex7tO267NjWFkG1bC6UbRZUHettyaok2M+MEYQKBgQDzqqN/eTVjuaG2BQ1n\n/Z92oJsSJznZupwBQCuJ7qHS+ODC5TIna+xDbNhTYhpXRl731zr0v5CO4v9Tlj9X\nbQhbx3ZnqqsCtQnWp9cp82L/prBsUWUnG+cBamuZou/JPedCFeMf47BiImzq1tjP\neT7oCY9kdKaiQwWXk3JSw3nA2QKBgQC/TEWS1rpvl59EoN4j51i5T049RI/I7EcD\ne6Taa+1SepWuzhDocG2p2DMT9Ken5/3HKc9pOFEnaaeCUhaBvLX+cGXDZSIEaoCy\nfZTvNusu9YEqn9W9czl411qTDJCCh5tDjvjlUdl23mlFctUsyrmPeMvuS0D/bE1i\n5BySiE681QKBgGrQfbWus6nQwUPieRsCAjplczUE/wYkGKkvsSZY9pVeRmEJSfAg\nDkUMXNRIqBVkItNwhUavBzar6ZOBxKiVglmBWbVeCnM4W2S+1MJuEBLTxnjlQXtg\nbuae+SYzV/wW595/a74Z+MM8JhTYM9jXZK0hK7u0qytsR/JHT5FaYXAZAoGAMHRJ\nSyBIqOtm1CNLIR0ARC/qSWqMYQA4HJG89/ZObo3OTDC156pSnKq+hVd6//SrOz9D\n4gr5w1nnrALO4J3EG2as4AlFzIiNgKh+iPkIKSTWSs2hfhMpg4pIzuZn1Cg1E6+r\nK6rHwmwjjgvAI1BWIBkgzoMRO6FbGKle817DUuECgYEAp22PQ4vV54so68E6pL1U\np4pomn2kx4xJy3zE+IApB0baDum9GI0dpTh4NB4f7LWxk+60WV3m8yC9uQiJEWnA\nTh6nMWiG69UfO9kQnYkoH1WR+xpFnlHFOkkOE5ENnfOUY1a9ydlMaWpqoD5Xtegc\nfkDaByPmoTVHGZ+fC8H4wL8=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-38rwh@arif-9e465.iam.gserviceaccount.com",
    "client_id": "104277397664783188006",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-38rwh%40arif-9e465.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
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
  