require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const map = express.Router();

map.get('/to-login', (req, res) => {
  res.render('login');
});


map.get('/to-signup', (req, res) => {
    res.render('signup');
  });

map.get('/to-aboutus', (req, res) => {
  res.render('aboutus');
});


module.exports = map;

