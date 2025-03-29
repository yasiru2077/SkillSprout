import React, { useState, useRef, useEffect } from "react";
import { Upload, X } from "lucide-react";
import axios from "axios";
import "./edit-modal.css";

function EditPersonalBlog({
  blogToEdit,
  userDetails,
  onClose,
  onUpdateSuccess,
}) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    selectedFile: null,
    existingImage: "",
  });

  const fileInputRef = useRef(null);

  // Populate form with existing blog data when component mounts
  useEffect(() => {
    if (blogToEdit) {
      setFormData({
        title: blogToEdit.title || "",
        content: blogToEdit.content || "",
        category: blogToEdit.category || "",
        selectedFile: null,
        existingImage: blogToEdit.image || "",
      });
    }
  }, [blogToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        selectedFile: file,
        existingImage: "", // Clear existing image when a new file is selected
      }));
    }
  };

  const handleFileRemove = () => {
    setFormData((prevData) => ({
      ...prevData,
      selectedFile: null,
      existingImage: blogToEdit?.image || "", // Restore existing image if available
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userDetails || !userDetails.id) {
      alert("User details are missing. Please log in.");
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("content", formData.content);
    submitData.append("category", formData.category);
    submitData.append("currentUserId", userDetails.id);

    // Add image if a new file is selected or keep existing image
    if (formData.selectedFile) {
      submitData.append("image", formData.selectedFile);
    } else if (formData.existingImage) {
      submitData.append("existingImage", formData.existingImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/blogs/${blogToEdit._id}`,
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Blog updated successfully!");
      onUpdateSuccess(response.data); // Callback to update parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog. Try again.");
    }
  };

  return (
    <div className="edit-personal-blog">
      <form onSubmit={handleSubmit} className="edit-blog-form-container">
        <button type="button" className="close-modal-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="edit-form-group">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title"
            required
          />
        </div>

        <div className="edit-form-group">
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Content"
            required
          ></textarea>
        </div>

        <div className="edit-form-group">
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Category"
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
          {!formData.selectedFile && !formData.existingImage ? (
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
                <p>
                  {formData.selectedFile
                    ? formData.selectedFile.name
                    : blogToEdit.image.split("/").pop()}
                </p>
                <p className="file-size">
                  {formData.selectedFile
                    ? `${(formData.selectedFile.size / 1024).toFixed(2)} KB`
                    : "Existing Image"}
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
          Update Blog
        </button>
      </form>
    </div>
  );
}

export default EditPersonalBlog;
