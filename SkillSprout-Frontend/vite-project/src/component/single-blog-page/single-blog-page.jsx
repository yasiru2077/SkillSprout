import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import "./add-blog.css";

function SingleBlogPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
      } else {
        alert("Please upload a valid image file.");
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <main className="add-blog">
      <section className="file-upload-container">
        <div
          className={`file-drop-zone ${isDragActive ? "drag-active" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="file-input"
            onChange={handleFileChange}
            accept="image/*"
          />
          {!selectedFile ? (
            <div className="drop-zone-content">
              <Upload className="upload-icon" />
              <p>Drag and drop your image here</p>
              <span>or</span>
              <button
                type="button"
                className="browse-button"
                onClick={triggerFileInput}
              >
                Browse Files
              </button>
            </div>
          ) : (
            <div className="file-preview">
              <div className="file-info">
                <p>{selectedFile.name}</p>
                <p className="file-size">
                  {(selectedFile.size / 1024).toFixed(2)} KB
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
      </section>
    </main>
  );
}

export default SingleBlogPage;
