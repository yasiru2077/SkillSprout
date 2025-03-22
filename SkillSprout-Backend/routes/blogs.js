const express = require("express");
const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();

// Multer setup for blog images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Create a Blog Post (Requires Authentication)
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ error: "Title and Content are required!" });
    }

    const newBlog = new Blog({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id, // Token ensures user is logged in
      image: req.file ? req.file.path : "",
    });

    const blog = await newBlog.save();
    res.status(201).json({ message: "Blog post created successfully!", blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get All Blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username");
    res.json(blogs);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
