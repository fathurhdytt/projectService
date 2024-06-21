require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const { loginUser, registerUser, verifyToken, addDataToCollection, cekDataToCollection,
checkEmailByUid, checkNamaByUid,addProfileToCollection,getCollectionCron, deleteJobs,
deleteJobsDetail,sendPasswordReset,getProfileById, updateProfileToCollection,upload,uploadFile} = require('../services/firebase')
const { sendEmail } = require('../services/mailer')
const he = require('he');
const axios = require('axios');

const apiKey = "4f4be2944983451b8d00be76dcc5e62b";
const apiUrl = `https://newsapi.org/v2/everything?apiKey=${apiKey}&q=health`;

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(400).send('Error fetching data from NewsAPI');
  }
});

router.put('/create-job', async (req, res) => {
  const { namaObat, hoursTime, minutesTime, email } = req.body;
  const token = 'cvQ1UehtttwzRbOVxWVb1YLYjlqScpmBLWO09wSqGBY='; // Token bearer

  try {
    // Parse hoursTime and minutesTime into integers
    const hours = parseInt(hoursTime);
    const minutes = parseInt(minutesTime);

    // Format the time string properly
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    const result = await cekDataToCollection(namaObat, email, timeString);

    if (result == "berhasil") {
      // Buat URL dengan email dan namaObat yang terdecode
      const url = `https://upn-sehat.vercel.app/send-email?to=${email}&subject=${encodeURIComponent(namaObat)}`;

      const response = await axios.put(
        'https://api.cron-job.org/jobs',
        {
          job: {
            url: url,
            enabled: true,
            saveResponses: true,
            schedule: {
              timezone: 'Asia/Jakarta',
              expiresAt: 0,
              hours: [hours],
              mdays: [-1],
              minutes: [minutes],
              months: [-1],
              wdays: [-1],
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jobId = response.data.jobId.toString();
      const result = await addDataToCollection(namaObat, email, timeString, jobId);
      res.status(200).send(jobId);
    } else {
      res.status(400).send({ error: 'Failed to create job' });
    }

  } catch (error) {
    console.error('Error creating job:', error.response ? error.response.data : error.message);
    res.status(400).send({ error: 'Failed to update job' });
  }
});

// Route untuk mengirim email
router.get('/send-email', async (req, res) => {
  const { to, subject } = req.query;
  const subjectDecode = he.decode(subject)
  const result = await sendEmail(to, subjectDecode, "This Is Reminder obat");
  if (result.success) {
    res.status(200).send("berhasil");
  } else {
    res.status(400).json(result);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const result = await registerUser(email, password); // Menggunakan resultString di sini juga jika perlu
    const result2 = await addProfileToCollection(result, name, email);
    res.status(200).send({ message: result });
  } catch (error) {
    res.status(400).send({ message: error.message || 'An error occurred' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const uid = await loginUser(email, password)
    res.status(200).send({ message: uid });
  } catch (error) {
    res.status(400).send(error)
  }
});

router.post('/verify-token', async (req, res) => {
  const idToken = req.body.idToken;
  try {
    const result = await verifyToken(idToken);
    const resultString = result.toString();
    const email = await checkEmailByUid(resultString);
    const nama = await checkNamaByUid(resultString); // Menggunakan resultString di sini juga jika perlu
    const result2 = await addProfileToCollection(resultString, nama, email);
    res.status(200).send({ result: resultString }); // Mengirimkan 'result' sebagai string
  } catch (error) {
    res.send(error)
  }
});

router.get('/cekEmail', async (req, res) => {
  const uid = req.query.uid;
  try {
    const result = await checkEmailByUid(uid)
    if (result != null) {
      res.status(200).send({ message: result });
    }
    res.status(200);
  } catch (error) {
    res.status(400).send(error)
  }
});

router.get('/cekNama', async (req, res) => {
  const uid = req.query.uid;
  try {
    const result = await checkNamaByUid(uid)
    if (result != null) {
      res.status(200).send({ message: result });
    }
    res.status(400);
  } catch (error) {
    res.status(400).send(error)
  }
});

router.get('/cekCron', async (req, res) => {
  const email = req.query.email;
  try {
    const result = await getCollectionCron(email)
    if (result != null) {
      res.status(200).send(result);
    }
    res.status(200);
  } catch (error) {
    res.status(400).send(error)
  }
});

router.get('/delete-job', async (req, res) => {
  const namaObat = req.query.namaObat;
  const email = req.query.email;
  try {
    const result = await deleteJobs(namaObat,email);
    if (result == "berhasil") {
      res.status(200).send("berhasil");
    }
    res.status(200);
  } catch (error) {
    res.status(400).send(error)
  }
})


router.get('/forgetPassword', async (req, res) => {
  const email = req.query.email;
  try {
    const result = await sendPasswordReset(email);
    if (result === 'berhasil') {
      res.status(200).send({ message: result });
    } else {
      res.status(400).send({ message: result });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get('/delete-detail-job', async (req, res) => {
  const email = req.query.email;
  const namaObat = req.query.namaObat;
  const jam = req.query.jam;
  const menit = req.query.menit;
  try {
    const result = await deleteJobsDetail(namaObat, email, jam, menit);
    if (result === "berhasil") {
      res.status(200).send("berhasil");
    } else {
      res.status(400).send(result); // Mengirim pesan error jika tidak berhasil
    }
  } catch (error) {
    console.error('Error deleting job detail:', error);
    res.status(400).send("Error deleting job detail"); // Mengirim pesan error jika terjadi kesalahan
  }
});

router.get('/cek-profile', async (req, res) => {
  const uid = req.query.uid;
  try {
    // Call the function to get profile data
    const profileData = await getProfileById(uid);
    
    if (profileData) {
      // Send profile data as response
      res.status(200).json(profileData);
    } else {
      // Send a 404 response if profile not found
      res.status(404).send('Profile not found');
    }
  } catch (error) {
    // Send a 400 response if there's an error
    res.status(400).send("Error fetching profile");
  }
});


router.get('/update-profile', async (req, res) => {
  try {
    const uid = req.query.uid;
    const nama = req.query.nama;
    const phoneNumber = req.query.phoneNumber;
    const birthDate = req.query.birthDate;

    // Memanggil fungsi untuk memperbarui profil
    const result = await updateProfileToCollection(uid, nama, phoneNumber, birthDate);

    if (result === 'berhasil') {
      res.status(200).send('Profile successfully updated');
    } else {
      res.status(400).send('Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).send('Internal server error');
  }
});

// POST /upload endpoint to handle file upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const uid = req.body.uid; // Get uid from request body

    if (!file || !uid) {
      throw new Error('File or UID not provided');
    }

    const result = await uploadFile(file, uid);
    res.status(200).json({ message: result }); // Return the download URL
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send(error.message);
  }
});

module.exports = router;

