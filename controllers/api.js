const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Post = require("../models/Post");
const User = require("../models/User");
const { post } = require("../routes/api");

exports.addPost = (req, res) => {
  console.log("HERE: ", req.body);
  let newPost = new Post({
    title: req.body.title,
    resource: req.body.resource,
    tags: req.body.tags,
    authorId: req.userData._id,
  });
  User.findById({ _id: req.userData._id }, (err, user) => {
    if (err)
      return res
        .status(200)
        .send({ error: "Some Error Occured! Try again later" });
    if (user) {
      newPost
        .save()
        .then((result) => {
          user.posts.push(result._id);
          user
            .save()
            .then((result) => console.log(result))
            .catch((err) => console.log(err));
          const token = jwt.sign({ user: user }, process.env.PASSWORD_HASH);
          return res.status(200).send({ token: token });
        })
        .catch((err) => console.log(err));
    }
  });
};

const getAuthorLinks = async (post) => {
  const user = await User.findOne({
    _id: mongoose.Types.ObjectId(post.authorId),
  });
  post._doc = {
    ...post._doc,
    author: user.displayName,
    image: user.image,
    userId: user._id,
  };
  console.log(post);
  return post;
};

exports.getPosts = (req, res) => {
  Post.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .exec(async (err, posts) => {
      if (err)
        return res
          .status(200)
          .send({ error: "Some Error Occured While fetching the posts :(" });
      let updatedPosts = [];
      if (posts) {
        console.log("-------TESTING-------");
        const updatedPosts = posts.map(async (post) => {
          const updatedPost = await getAuthorLinks(post);
          return updatedPost;
        });
        const result = await Promise.all(updatedPosts);
        console.log("RESULT: ", result);
        console.log("-------TESTING-------");
        return res.status(200).send({ posts: result });
      }
    });
};
