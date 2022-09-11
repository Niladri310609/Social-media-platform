const express = require("express");
const router = express.Router();
const { authentication, authorization } = require("../middleware/auth");
const {
  createUser,
  loginUser,
  getById,
  updateUser,
  followUser,
  unfollowUser,
} = require("../controllers/userController");

const {
  createPost,
  deletePostById,
  likePostById,
  UnlikePostById,
  writeComment,
  getPostById,
  getAllposts
} = require("../controllers/postController");

//register User

router.post("/register", createUser);

//Login User

router.post("/login", loginUser);

// get userDetails

router.get("/user/:userId/profile", authentication, getById);

// update userDetails

router.put("/user/:userId/profile", authentication, authorization, updateUser);

//followUser

router.put("/user/:userId/follow", authentication, authorization, followUser);

//unfollow User

router.put(
  "/user/:userId/unfollow",
  authentication,
  authorization,
  unfollowUser
);

//===========================================================================================

//Create Post

router.post("/posts/:userId", authentication, authorization, createPost);

//Delete Post

router.delete(
  "/deleteposts/:userId",
  authentication,
  authorization,
  deletePostById
);

//like the post
router.post("/like/:userId", authentication, likePostById);

//Unlike the post

router.post("/unlike/:userId", authentication, UnlikePostById);

//write a comment

router.post("/comments/:postId", authentication, writeComment);

//get a specific post

router.get("/posts/:postId",authentication,getPostById)


//get all posts of the user

router.get("/posts/allposts",authentication,getAllposts)




//===============================================================================

router.all("/*", function (req, res) {
  res
    .status(404)
    .send({ status: false, message: "The api you requested is not available" });
});

module.exports = router;
