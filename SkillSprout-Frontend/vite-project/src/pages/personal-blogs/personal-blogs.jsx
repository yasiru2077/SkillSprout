import React, { useEffect, useState } from "react";
import EditPersonalBlog from "../../component/single-blog-page/edit-personal-blog";
import "./personal.css";

function PersonalBlogs({ userDetails }) {
  const [personalBlogs, setPersonalBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [openModel, setOpenModel] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  const imagePath = "http://localhost:5000/";

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    fetch("http://localhost:5000/api/blogs", {
      method: "GET",
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status:${response.status}`);
        }

        const data = await response.json();
        // Filter blogs where the author's ID matches the current user's ID
        const personalData = data.filter(
          (blog) => blog.author._id === userDetails.id
        );

        setPersonalBlogs(personalData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error.message);
      });
  };

  const handleEditBlog = (blog) => {
    const goToTop = document.getElementById("model-scroll");
    setBlogToEdit(blog);
    setOpenModel(true);

    goToTop.scrollIntoView();
  };

  const handleCloseModal = () => {
    setOpenModel(false);
    setBlogToEdit(null);
  };

  const handleUpdateSuccess = (updatedBlog) => {
    // Update the blog in the list
    const updatedBlogs = personalBlogs.map((blog) =>
      blog._id === updatedBlog._id ? updatedBlog : blog
    );
    setPersonalBlogs(updatedBlogs);
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/blogs/${blogId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentUserId: userDetails.id }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status:${response.status}`);
      }

      // Remove the deleted blog from the list
      const updatedBlogs = personalBlogs.filter((blog) => blog._id !== blogId);
      setPersonalBlogs(updatedBlogs);
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete blog. Try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main id="model-scroll">
      <section>
        <div
          id="model-scroll"
          className={`${openModel ? "edit-model-container" : ""}`}
        >
          {openModel && (
            <EditPersonalBlog
              blogToEdit={blogToEdit}
              userDetails={userDetails}
              onClose={handleCloseModal}
              onUpdateSuccess={handleUpdateSuccess}
            />
          )}
        </div>
        <div
          className={`${
            openModel ? "personal-blogs blurred" : "personal-blogs"
          }`}
        >
          {personalBlogs.length === 0 ? (
            <p>No blogs found. Start writing your first blog!</p>
          ) : (
            personalBlogs.map((p) => (
              <div key={p._id} className="blog-item">
                <h1>{p.title}</h1>
                {p.image && (
                  <img
                    src={`${imagePath}${p.image}`}
                    alt={`Blog image for ${p.title}`}
                    className="blog-image"
                  />
                )}
                <p>{p.content}</p>
                <div className="blog-metadata">
                  <p>
                    Last updated: {new Date(p.updatedAt).toLocaleString()}
                    <span> | </span>
                    Word count: {p.content.length}
                  </p>
                </div>
                <div className="blog-actions">
                  <button onClick={() => handleEditBlog(p)}>Edit</button>
                  <button onClick={() => handleDeleteBlog(p._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default PersonalBlogs;
