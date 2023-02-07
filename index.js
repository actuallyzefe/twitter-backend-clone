const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

const start = async () => {
  if (!process.env.URI) throw new Error('MONGO_URI must be defined');
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.URI);
    mongoose.set('strictQuery', false);
    console.log('Successfully connected to db');
  } catch (error) {
    console.log(error);
  }
};

start();

app.listen(3000, () => {
  console.log('heard on http://localhost:3000');
});
