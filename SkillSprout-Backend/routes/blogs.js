const express = require("express");
const Blog = require("../models/Blog");
const multer = require("multer");

const router = express.Router();

// Multer setup for blog images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Create a Blog Post
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Check if author is provided
    if (!req.body.author) {
      return res.status(400).json({ error: "Author ID is required" });
    }

    const newBlog = new Blog({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author, // Use author from request body
      image: req.file ? req.file.path : "",
      category: req.body.category,
    });

    const savedBlog = await newBlog.save();

    // Populate the author information before returning
    const blog = await Blog.findById(savedBlog._id).populate(
      "author",
      "username"
    );

    res.status(201).json(blog);
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get All Blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username"
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Blog
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the user is the author of the blog using author from request body
    if (
      req.body.currentUserId &&
      blog.author.toString() !== req.body.currentUserId
    ) {
      return res
        .status(403)
        .json({ message: "You can only update your own blogs" });
    }

    const updatedBlog = {
      title: req.body.title || blog.title,
      content: req.body.content || blog.content,
      category: req.body.category || blog.category,
    };

    // Update image if a new one is uploaded
    if (req.file) {
      updatedBlog.image = req.file.path;
    }

    const result = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: updatedBlog },
      { new: true }
    ).populate("author", "username");

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Blog
router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the user is the author of the blog using author from request body
    if (
      req.body.currentUserId &&
      blog.author.toString() !== req.body.currentUserId
    ) {
      return res
        .status(403)
        .json({ message: "You can only delete your own blogs" });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: "Blog has been deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Blogs by Author
router.get("/author/:authorId", async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.authorId }).populate(
      "author",
      "username"
    );

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
