require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const { loginUser, registerUser, verifyToken, addDataToCollection, cekDataToCollection,
checkEmailByUid, checkNamaByUid,addProfileToCollection,getCollectionCron} = require('../services/firebase')
const { sendEmail } = require('../services/mailer')
const he = require('he');
const axios = require('axios');

router.get('/', (req, res) => {
  res.render('index');
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
      const url = `https://project-service-two.vercel.app/send-email?to=${email}&subject=${encodeURIComponent(namaObat)}`;

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
    const result = await registerUser(email, password)
    res.status(200).send("berhasil");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password)
    res.status(200).send({ message: result });
  } catch (error) {
    res.status(400).send(error)
  }
});

router.post('/verify-token', async (req, res) => {
  const idToken = req.body.idToken;
  try {
    const result = await verifyToken(idToken);
    const email = await checkEmailByUid(result);
    const nama = await checkNamaByUid(result);
    const result2 = await addProfileToCollection(result,nama, email);
    res.status(200).send({ message: result2 });
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
    res.status(400);
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
    res.status(400);
  } catch (error) {
    res.status(400).send(error)
  }
});
module.exports = router;

