const router = require("express").Router();

const {
  addPost,
  getPosts,
  getSearchPosts,
  getProfilePosts,
  getAccountDetails,
} = require("../controllers/api");
const checkAuth = require("../middlewares/checkAuth");

router.post("/post/add", checkAuth, addPost);
router.get("/posts", checkAuth, getPosts);
router.get("/posts/:search", checkAuth, getSearchPosts);
router.get("/user/posts", checkAuth, getProfilePosts);
router.get("/account/:id", checkAuth, getAccountDetails);

module.exports = router;
