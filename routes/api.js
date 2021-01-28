const router = require("express").Router();

const { addPost, getPosts } = require("../controllers/api");
const checkAuth = require("../middlewares/checkAuth");

router.post("/post/add", checkAuth, addPost);
router.get("/posts", checkAuth, getPosts);

module.exports = router;
