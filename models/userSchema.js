import { strict } from 'assert';
import mongoose, { Schema } from 'mongoose';
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have name'],
  },
});
