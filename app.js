const express = require('express');
const errorController = require('./controllers/errorController');
const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
// app.set('view engine', 'ejs');
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SUCCESS');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// app.use(errorController);

module.exports = app;
