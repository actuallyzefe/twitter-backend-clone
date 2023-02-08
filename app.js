const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const passport = require('passport');
const PassportLocal = require('passport-local');
const router = require('./routes/authRoutes');

// app.set('view engine', 'ejs');
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SUCCESS');
});

app.use('/auth', authRoutes);

module.exports = app;
