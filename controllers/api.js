const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Post = require("../models/Post");
const User = require("../models/User");

exports.addPost = (req, res) => {
  console.log("HERE: ", req.body);
  let tags_lower = [];
  req.body.tags.map((tag) => {
    tags_lower.push(tag.toLowerCase());
  });
  let newPost = new Post({
    title: req.body.title,
    resource: req.body.resource,
    tags: req.body.tags,
    tags_lower: tags_lower,
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
  let links = [];
  let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  post.resource.replace(urlRegex, (url) => {
    links.push(url);
  });
  post._doc = {
    ...post._doc,
    links: links,
    author: user.displayName,
    image: user.image,
    userId: user._id,
  };
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
        const updatedPosts = posts.map(async (post) => {
          const updatedPost = await getAuthorLinks(post);
          return updatedPost;
        });
        const result = await Promise.all(updatedPosts);
        return res.status(200).send({ posts: result });
      }
    });
};

exports.getSearchPosts = (req, res) => {
  Post.find({ tags_lower: { $in: [req.params.search.toLowerCase()] } })
    .sort({ createdAt: -1 })
    .limit(20)
    .exec(async (err, posts) => {
      if (err)
        return res
          .status(200)
          .send({ error: "Some Error Occured While fetching the posts :(" });
      if (posts) {
        const updatedPosts = posts.map(async (post) => {
          const updatedPost = await getAuthorLinks(post);
          return updatedPost;
        });
        const result = await Promise.all(updatedPosts);
        return res.status(200).send({ posts: result });
      }
    });
};

const getPost = async (id) => {
  const post = await Post.findById({ _id: mongoose.Types.ObjectId(id) });
  if (post !== null) {
    const updatedPost = await getAuthorLinks(post);
    return updatedPost;
  }
};

exports.getProfilePosts = (req, res) => {
  User.findById({ _id: req.userData._id }, async (err, user) => {
    if (err)
      return res.status(200).send({
        error:
          "Some Error Occured while fetching the posts. Please Try Again Later!",
      });
    if (user) {
      const result = user.posts.map(async (postId) => {
        const updatedPost = await getPost(postId);
        return updatedPost;
      });
      const posts = await Promise.all(result);
      return res.status(200).send({
        posts: posts,
      });
    }
  });
};

exports.getAccountDetails = (req, res) => {
  User.findById({ _id: req.params.id }, async (err, user) => {
    if (err)
      return res.status(200).send({
        error:
          "Some Error Occured while fetching the posts. Please Try Again Later!",
      });
    if (user) {
      const result = user.posts.map(async (postId) => {
        const updatedPost = await getPost(postId);
        return updatedPost;
      });
      const posts = await Promise.all(result);
      return res.status(200).send({
        user: user,
        posts: posts,
      });
    }
  });
};
