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

map.get('/to-forgetPassword', (req, res) => {
  res.render('forgetPassword');
});


map.get('/to-profile', (req, res) => {
  res.render('profile');
});

map.get('/to-article', (req, res) => {
  res.render('article');
});

module.exports = map;

