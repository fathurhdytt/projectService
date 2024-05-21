require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const {loginUser, registerUser} = require('../services/firebase')

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







module.exports = router;

