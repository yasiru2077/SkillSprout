import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import axios from "axios";
import "./add-blog.css";

function AddBlogPage({ userDetails }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    selectedFile: null,
  });

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically updating state
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        selectedFile: file,
      }));
    }
  };

  const handleFileRemove = () => {
    setFormData((prevData) => ({
      ...prevData,
      selectedFile: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userDetails || !userDetails.user || !userDetails.user._id) {
      console.log(userDetails);
      console.log(userDetails.user);
      console.log(userDetails.user._id);

      console.log("User details are missing. Please log in.");
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("content", formData.content);
    submitData.append("category", formData.category);
    submitData.append("author", userDetails.user._id);
    if (formData.selectedFile) {
      submitData.append("image", formData.selectedFile);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/blogs",
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Blog added successfully!");
      console.log("Blog response:", response.data);

      // Reset form after submission
      setFormData({
        title: "",
        content: "",
        category: "",
        selectedFile: null,
      });
    } catch (error) {
      console.error("Error adding blog:", error);
      alert("Failed to add blog. Try again.");
    }
  };

  return (
    <main className="add-blog">
      <section className="file-upload-container">
        <form onSubmit={handleSubmit} className="blog-form-container">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            />
          </div>

          <div
            className="file-drop-zone"
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="file-input"
              onChange={handleFileChange}
              accept="image/*"
            />
            {!formData.selectedFile ? (
              <div className="drop-zone-content">
                <Upload className="upload-icon" />
                <p>Drag and drop your image here</p>
                <span>or</span>
                <button type="button" className="browse-button">
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="file-preview">
                <div className="file-info">
                  <p>{formData.selectedFile.name}</p>
                  <p className="file-size">
                    {(formData.selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  type="button"
                  className="remove-file-btn"
                  onClick={handleFileRemove}
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          <button type="submit" className="submit-button">
            Add Blog
          </button>
        </form>
      </section>
    </main>
  );
}

export default AddBlogPage;
