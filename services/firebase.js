// Import statements
require('dotenv').config();
const { getDoc, getDocs, addDoc, updateDoc, setDoc, doc, writeBatch, collection, query, collectionGroup, where, arrayRemove } = require('firebase/firestore');
const { getFirestore } = require('firebase/firestore');
const admin = require('firebase-admin');
const firebase = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail } = require('firebase/auth');
const { isSupported, getAnalytics } = require('firebase/analytics');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const multer = require('multer');

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
const db = getFirestore();
const storage = getStorage();

// Multer configuration for file upload
const upload = multer({
  storage: multer.memoryStorage()
});

const uploadFile = async (file, uid) => {
  try {
    // Determine the content type based on file extension or other methods
    let contentType = 'application/octet-stream'; // Default content type

    // Example: Check if the file extension indicates an image
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (imageExtensions.includes(fileExtension)) {
      contentType = `image/${fileExtension}`; // Set content type for image
    }

    // Storage reference
    const storageRef = ref(storage, 'images/' + file.originalname);

    // Upload bytes with content type
    await uploadBytes(storageRef, file.buffer, { contentType });

    // Get the download URL
    const url = await getDownloadURL(storageRef);

    // Update Firestore document
    const profileRef = doc(db, 'profiles', uid);
    await setDoc(profileRef, { image: url }, { merge: true }); // Merge true to update existing document

    return "berhasil"; // Return the download URL and content type
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};
const addProfileToCollection = async (uid, nama, email) => {
  try {
    // Referensi ke dokumen di koleksi 'profiles' dengan UID sebagai ID dokumen
    const docRef = doc(db, 'profiles', uid);

    // Menambahkan data profil ke dokumen
    await setDoc(docRef, {
      nama: nama,
      email: email,
      phoneNumber: "",
      birthDate: ""
    });

    console.log('Profile successfully added:', uid);
    return 'berhasil';
  } catch (error) {
    console.error('Error adding profile:', error);
    return 'error';
  }
};

const updateProfileToCollection = async (uid, nama, phoneNumber, birthDate) => {
  try {
    // Referensi ke dokumen di koleksi 'profiles' dengan UID sebagai ID dokumen
    const docRef = doc(db, 'profiles', uid);

    // Mengambil data profil yang ada untuk mendapatkan nilai email
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error('No such document!');
      return 'error';
    }
    const email = docSnap.data().email; // Mendapatkan nilai email dari data profil yang ada

    // Memperbarui data profil di dokumen, termasuk nilai email
    await updateDoc(docRef, {
      nama: nama,
      email: email, // Menggunakan nilai email yang ada
      phoneNumber: phoneNumber,
      birthDate: birthDate
    });

    console.log('Profile successfully updated:', uid);
    return 'berhasil';
  } catch (error) {
    console.error('Error updating profile:', error);
    return 'error';
  }
};


const getProfileById = async (docId) => {
  try {
    // Reference to the specific document in the 'profiles' collection
    const docRef = doc(db, 'profiles', docId);

    // Fetch the document
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Document data is found
      console.log('Document data:', docSnap.data());
      return docSnap.data();
    } else {
      // No such document
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
}

// Function to check email by UID
const checkEmailByUid = async (uid) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    if (userRecord.email) {
      console.log('Email:', userRecord.email);
      return userRecord.email;
    } else {
      console.log('No email found for this UID.');
      return null;
    }
  } catch (error) {
    console.error('Error checking email:', error);
    return null;
  }
};

// Function to check email by UID
const checkNamaByUid = async (uid) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    if (userRecord.displayName) {
      console.log('Nama:', userRecord.displayName);
      return userRecord.displayName;
    } else {
      console.log('No email found for this UID.');
      return null;
    }
  } catch (error) {
    console.error('Error checking email:', error);
    return null;
  }
};

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
const getCollectionCron = async (email) => {
  try {
    // Query untuk mengambil dokumen dari koleksi 'cron' dengan email yang sesuai
    const q = query(collection(db, 'cron'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    // Array untuk menyimpan hasil dokumen
    const results = [];

    // Loop melalui hasil query dan tambahkan data ke array hasil
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    console.log('Data retrieved successfully');
    return results;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return [];
  }
};
const cekDataToCollection = async (namaObat, email, newHoursString) => {
  try {
    // Define the collection name
    const collectionName = 'cron'; // replace with your actual collection name

    // Query the collection to check if the document with the same namaObat and email exists
    const q = query(collection(db, collectionName), where('namaObat', '==', namaObat), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Document exists, check if the newHoursString already exists in any of the documents
      for (const doc of querySnapshot.docs) {
        const existingData = doc.data();
        const existingHours = existingData.Hours;

        // Check if the newHoursString already exists in the array
        const existingTimes = existingHours.map(hour => hour.time);
        if (existingTimes.includes(newHoursString)) {
          console.error(`Time ${newHoursString} already exists in the document.`);
          return "error";
        }
      }

      // If newHoursString does not exist in any document, return "berhasil"
      return "berhasil";
    } else {
      // If there are no documents with the same namaObat and email, return "berhasil"
      return "berhasil";
    }
  } catch (e) {
    console.error("Error checking document:", e.message);
    return "error";
  }
};

const addDataToCollection = async (namaObat, email, newHoursString, id) => {
  try {
    // Define the collection name
    const collectionName = 'cron'; // replace with your actual collection name

    // Convert the string of hours to an array
    const newHours = [{ id: id, time: newHoursString }];

    // Query the collection to check if the document with the same namaObat and email exists
    const q = query(collection(db, collectionName), where('namaObat', '==', namaObat), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Document exists, check and update the Hours array
      for (const doc of querySnapshot.docs) {
        const existingData = doc.data();
        const existingHours = existingData.Hours;

        // Check if the new hours already exist in the array
        const existingHourIds = existingHours.map(hour => hour.id);
        if (existingHourIds.includes(id)) {
          console.error(`Hour with ID ${id} already exists in the document.`);
          return "error";
        }

        // No duplicates, update the document
        const updatedHours = [...existingHours, ...newHours];
        await setDoc(doc.ref, { Hours: updatedHours }, { merge: true });
        console.log(`Document with ID ${doc.id} updated with new hours.`);
      }

      return "berhasil";
    } else {
      // Document doesn't exist, create a new one
      const docRef = await addDoc(collection(db, collectionName), {
        namaObat: namaObat,
        email: email,
        Hours: newHours
      });

      console.log("Document written with ID: ", docRef.id);
      return "berhasil";
    }
  } catch (e) {
    console.error("Error adding/updating document: ", e.message);
    return "error";
  }
};

const deleteJobs = async (namaObat, email) => {
  if (!namaObat || !email) {
    throw new Error('namaObat and email are required');
  }

  try {
    // Query the Firebase collection to find the documents with the specified namaObat and email
    const cronCollection = collection(db, 'cron');
    const cronQuery = query(cronCollection, where('namaObat', '==', namaObat), where('email', '==', email));
    const snapshot = await getDocs(cronQuery);

    if (snapshot.empty) {
      throw new Error('No jobs found with the specified namaObat and email');
    }

    // Extract the job IDs and document IDs
    const jobsToDelete = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.Hours) {
        data.Hours.forEach(hour => {
          jobsToDelete.push({ jobId: hour.id, docId: doc.id });
        });
      }
    });

    // Delete each job from the external API
    const authToken = 'OWNOzoFyX2GvLKaGBkAToOiAgM3Q+Erz8mAxnHmTA2s=';
    for (const { jobId } of jobsToDelete) {
      const url = `https://api.cron-job.org/jobs/${jobId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        const responseText = await response.text();
        let errorResponse;
        try {
          errorResponse = JSON.parse(responseText);
        } catch (e) {
          // Log the responseText for debugging purposes
          console.error('Error response from API:', responseText);
          throw new Error(responseText || 'Error deleting job');
        }
        throw new Error(errorResponse.message || 'Error deleting job');
      }
    }

    // Optionally, delete the documents from Firebase
    const batch = writeBatch(db);
    jobsToDelete.forEach(({ docId }) => {
      const docRef = doc(cronCollection, docId);
      batch.delete(docRef);
    });
    await batch.commit();

    console.log('Sukses menghapus pekerjaan');
    return "berhasil";
  } catch (error) {
    console.error('Error deleting jobs:', error);
    throw error;
  }
};

const deleteJobsDetail = async (namaObat, email, jam, menit) => {
  if (!namaObat || !email || jam == null || menit == null) {
    throw new Error('namaObat, email, jam, and menit are required');
  }

  // Format jam dan menit menjadi format waktu "HH:mm"
  const formattedTime = `${String(jam).padStart(2, '0')}:${String(menit).padStart(2, '0')}`;

  try {
    // Query the Firebase collection to find the documents with the specified namaObat and email
    const cronCollection = collection(db, 'cron');
    const cronQuery = query(
      cronCollection,
      where('namaObat', '==', namaObat),
      where('email', '==', email)
    );
    const snapshot = await getDocs(cronQuery);

    if (snapshot.empty) {
      throw new Error('No jobs found with the specified namaObat and email');
    }

    let timeExists = false;

    // Iterate over each document in the snapshot
    for (const snap of snapshot.docs) {
      const data = snap.data();
      const hours = data.Hours || [];

      // Check if the specified time exists in any of the hours
      for (const hour of hours) {
        if (hour.time === formattedTime) {
          timeExists = true;
          break;
        }
      }

      if (!timeExists) {
        throw new Error(`No jobs found with the specified time ${formattedTime}`);
      }
    }

    // Proceed with deletion if the time exists
    for (const snap of snapshot.docs) {
      const data = snap.data();
      const hours = data.Hours || [];

      // Check if there's only one entry in the Hours array
      if (hours.length === 1) {
        // If only one entry, delete the entire document
        await deleteJobs(namaObat, email); // Assuming deleteJobs function handles this case
      } else {
        // Find and delete the specific hour entry
        const jobsToDelete = [];
        hours.forEach(hour => {
          if (hour.time === formattedTime) {
            jobsToDelete.push({ jobId: hour.id, docId: snap.id, hourEntry: hour });
          }
        });

        // Delete each job from the external API
        const authToken = 'OWNOzoFyX2GvLKaGBkAToOiAgM3Q+Erz8mAxnHmTA2s=';
        for (const { jobId } of jobsToDelete) {
          const url = `https://api.cron-job.org/jobs/${jobId}`;
          const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            }
          });

          if (!response.ok) {
            const errorResponse = await response.json().catch(() => ({}));
            const errorMessage = errorResponse.message || 'Error deleting job';
            throw new Error(errorMessage);
          }
        }

        // Create a new batch for updating Firestore documents
        const batch = writeBatch(db);

        // Update the document to remove the specific hour entry
        jobsToDelete.forEach(({ docId, hourEntry }) => {
          const docRef = doc(cronCollection, docId);
          batch.update(docRef, {
            Hours: arrayRemove(hourEntry)
          });
        });

        // Commit the batch operation
        await batch.commit();
      }
    }

    console.log('Sukses menghapus pekerjaan');
    return 'berhasil';
  } catch (error) {
    console.error('Error deleting jobs:', error);
    throw error;
  }
};

const sendPasswordReset = async (email) => {
  try {
    // Cek apakah email ada di koleksi Firestore
    const profilesRef = collection(db, 'profiles');
    const q = query(profilesRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error('Email tidak terdaftar di Firestore');
      return 'email tidak terdaftar';
    }

    // Jika email terdaftar, lanjutkan dengan pengiriman email reset password
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent successfully');
    return 'berhasil';
  } catch (error) {
    console.error('Error sending password reset email:', error);
    if (error.code === 'auth/invalid-email') {
      return 'Email tidak valid';
    } else if (error.code === 'auth/user-not-found') {
      return 'Email tidak terdaftar';
    } else {
      return 'Terjadi kesalahan. Silakan coba lagi.';
    }
  }
};

module.exports = {
  deleteJobs,
  registerUser,
  loginUser,
  verifyToken,
  addDataToCollection,
  cekDataToCollection,
  getCollectionCron,
  addProfileToCollection,
  checkEmailByUid,
  checkNamaByUid,
  sendPasswordReset,
  deleteJobsDetail,
  getProfileById,
  updateProfileToCollection,
  upload,
  uploadFile
};