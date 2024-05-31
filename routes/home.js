require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const {loginUser, registerUser,verifyToken} = require('../services/firebase')
const {sendEmail} = require('../services/mailer')

router.get('/', (req, res) => {
  res.render('index');
});

router.put("/update-job", async (req, res) => {
  const { url, hoursTime, minutesTime } = req.body;
  const token = "cvQ1UehtttwzRbOVxWVb1YLYjlqScpmBLWO09wSqGBY="; // Token bearer

  try {
    const response = await axios.put(
      `https://api.cron-job.org/jobs`,
      {
        job: {
          url,
          enabled: true,
          saveResponses: true,
          schedule: {
            timezone: "Asia/Jakarta",
            expiresAt: 0,
            hours: [hoursTime],
            mdays: [-1],
            minutes: [minutesTime],
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
    res.send(response.data);
  } catch (error) {
    res.status(500).send({ error: "Failed to update job" });
  }
});

// Route untuk mengirim email
router.get('/send-email', async (req, res) => {
  const { to,subject,text} = req.query;

  const result = await sendEmail(to,subject,text);
  if (result.success) {
      res.status(200);
  } else {
      res.status(500).json(result);
  }
});


router.post('/register',async (req, res) => {
  try {
    const { email, password, name} = req.body;
    const result = await registerUser(email, password)
    res.status(200).send("berhasil");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login',async (req, res) => {
  try {
    const { email, password} = req.body;
    const result = await loginUser(email, password)
    res.status(200).send({message : result});
  } catch (error) {
    res.status(400).send(error)
  }
});

router.post('/verify-token',async (req, res) => {
  const idToken = req.body.idToken;
  try {
    const result = await verifyToken(idToken)
    res.status(200).send({ message: 'User authenticated', result});
  } catch (error) {
    res.send(error)
  }
});


module.exports = router;

