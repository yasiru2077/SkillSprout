const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
