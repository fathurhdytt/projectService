require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const {loginUser, registerUser,verifyToken} = require('../services/firebase')

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/register',async (req, res) => {
  try {
    const { email,nama, password} = req.body;
    const result = await registerUser(email, nama, password)
    res.send(result);
  } catch (error) {
    res.send(error)
  }
});

router.post('/login',async (req, res) => {
  try {
    const { email, password} = req.body;
    const result = await loginUser(email, password)
    res.send(result);
  } catch (error) {
    res.send(error)
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

