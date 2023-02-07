const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

app.set('view engine', 'ejs');
app.use(express.json());

// mounting the routes

app.get('/', (req, res) => {
  res.send('SUCCESS');
});

module.exports = app;
