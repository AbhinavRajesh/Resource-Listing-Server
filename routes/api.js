const router = require("express").Router();

const {
  addPost,
  getPosts,
  getSearchPosts,
  getProfilePosts,
  getAccountDetails,
  getSavedPosts,
  toggleSaved,
} = require("../controllers/api");
const checkAuth = require("../middlewares/checkAuth");

router.post("/post/add", checkAuth, addPost);
router.get("/posts", checkAuth, getPosts);
router.get("/posts/:search", checkAuth, getSearchPosts);
router.get("/user/posts", checkAuth, getProfilePosts);
router.get("/account/:id", checkAuth, getAccountDetails);
router.get("/post/toggleSaved/:id", checkAuth, toggleSaved);
router.get("/savedPost", checkAuth, getSavedPosts);

module.exports = router;
