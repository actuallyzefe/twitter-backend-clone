const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    tweet: {
      type: String,
      required: [true, 'A tweet can not be empty'],
    },
    likes: {
      type: Array,
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A tweet needs to belong an user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'nickname',
  });
  next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
