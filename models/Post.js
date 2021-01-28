const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  resource: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  comments: {
    type: Array,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  authorId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
