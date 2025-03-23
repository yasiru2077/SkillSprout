const express = require("express");
const Comment = require("../models/Comment");
const router = express.Router();

// Add Comment
router.post("/", async (req, res) => {
  try {
    // Check if required fields are provided
    if (!req.body.text || !req.body.blogId || !req.body.author) {
      return res.status(400).json({ error: "Text, blogId, and author are required" });
    }

    const newComment = new Comment({
      text: req.body.text,
      blogId: req.body.blogId,
      author: req.body.author, // Use author from request body instead of req.user.id
    });

    const savedComment = await newComment.save();
    
    // Populate author information before returning
    const comment = await Comment.findById(savedComment._id).populate("author", "username");
    
    res.status(201).json(comment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get Comments for a Blog
router.get("/blog/:blogId", async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId })
      .populate("author", "username")
      .sort({ createdAt: -1 }); // Sort by newest first
      
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Comment by ID
router.get("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate("author", "username");
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Comment
router.put("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Check if the user is the author of the comment (optional)
    if (req.body.currentUserId && comment.author.toString() !== req.body.currentUserId) {
      return res.status(403).json({ message: "You can only update your own comments" });
    }
    
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: { text: req.body.text } },
      { new: true }
    ).populate("author", "username");
    
    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Comment
router.delete("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Check if the user is the author of the comment (optional)
    if (req.body.currentUserId && comment.author.toString() !== req.body.currentUserId) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }
    
    await Comment.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Comment has been deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Comments by User
router.get("/user/:userId", async (req, res) => {
  try {
    const comments = await Comment.find({ author: req.params.userId })
      .populate("author", "username")
      .populate("blogId", "title")
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;