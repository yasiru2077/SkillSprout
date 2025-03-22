const express = require("express");
const Comment = require("../models/Comment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add Comment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newComment = new Comment({
      text: req.body.text,
      blogId: req.body.blogId,
      author: req.user.id,
    });

    const comment = await newComment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Comments for a Blog
router.get("/:blogId", async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId }).populate(
      "author",
      "username"
    );
    res.json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
