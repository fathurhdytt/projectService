require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const {loginUser, registerUser,verifyToken} = require('../services/firebase')
const {sendEmail} = require('../services/mailer')

router.get('/', (req, res) => {
  res.render('index');
});

// Route untuk mengirim email
router.get('/send-email', async (req, res) => {
  const { to,subject,text} = req.query;

  const result = await sendEmail(to,subject,text);
  if (result.success) {
      res.status(200).send("berhasil");
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

