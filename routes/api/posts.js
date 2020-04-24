const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// route: POST api/posts
// description: Create a post
// access: Private

router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // don't include the password. User is the schema model
      const user = await User.findById(req.user.id).select("-password");
      //populate the post fields. Post is the schema model
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      // save to database
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// route: GET api/posts
// description: Get all posts
// access: private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json({ posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// route: GET api/post/:id
// description: Get post by ID
// access: private

router.get("/:id", auth, async (req, res) => {
  try {
    /* getting the id (req.params.id) by the URL */
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json({ post });
  } catch (err) {
    console.error(err.message);
    if (err.name === "CastError") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// route: DELETE api/posts/:id
// description: Delete a post
// access: private

router.delete("/:id", auth, async (req, res) => {
  try {
    /* ensure that the user owns the post that he wants to delete*/
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await post.remove();
    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.name === "CastError") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// route: PUT api/posts/like/:id
// description: Like a post
// access: private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check if the post has already been liked by this user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// route: PUT api/posts/unlike/:id
// description: unLike a post
// access: private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    /*you can only undo a like. You cannot unlike
      a post if you did not like it before. Therefore, you need to check if the post 
      has already been liked by this user */
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    // get the index of the like you want to remove
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// route: POST api/posts/comment/:id
// description: Comment on a post
// access: Private

router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      /* saving the parent post (instead of the comment directly*/
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// route: DELETE api/posts/comment/:id/:comment_id     (you need the id of the post and comment
// to determine which comment to delete)
// description: Delete a comment
// access: Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // identify comment from post
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // make sure comments exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // check that the user who made the comment is the one who is deleting the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    // get the index of the comment you want to remove
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
