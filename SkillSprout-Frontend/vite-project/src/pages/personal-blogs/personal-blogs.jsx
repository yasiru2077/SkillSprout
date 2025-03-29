import React, { useEffect, useState } from "react";
import { ChevronDown, Edit, Trash2 } from "lucide-react";
import EditPersonalBlog from "../../component/single-blog-page/edit-personal-blog";
import "./personal.css";

function PersonalBlogs({ userDetails }) {
  const [personalBlogs, setPersonalBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [openModel, setOpenModel] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const imagePath = "http://localhost:5000/";

  useEffect(() => {
    fetchBlogs();
    // Add event listener to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest(".blog-metadata-dropdown")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    setOpenDropdownId(null);
    goToTop.scrollIntoView();
  };

  const handleCloseModal = () => {
    setOpenModel(false);
    setBlogToEdit(null);
  };

  const handleUpdateSuccess = (updatedBlog) => {
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

      const updatedBlogs = personalBlogs.filter((blog) => blog._id !== blogId);
      setPersonalBlogs(updatedBlogs);
      setOpenDropdownId(null);
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete blog. Try again.");
    }
  };

  const toggleDropdown = (blogId) => {
    setOpenDropdownId(openDropdownId === blogId ? null : blogId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main id="model-scroll">
      <section>
        <div className={`${openModel ? "edit-model-container" : ""}`}>
          {openModel && (
            <EditPersonalBlog
              blogToEdit={blogToEdit}
              userDetails={userDetails}
              onClose={handleCloseModal}
              onUpdateSuccess={handleUpdateSuccess}
            />
          )}
        </div>
        <div className="personal-info">
          <div className="greeting personal-page-container">
            <div className="greeting-container-1">
              <img
                src={`${imagePath}${userDetails.profilePic}`}
                alt={`profile picture user`}
                className="profile-pic"
              />
            </div>
            <div className="greeting-container-2">
              <h1>
                Hey welcome back {userDetails.username}! This is your sanctuary
                of stories,
              </h1>
              <p>
                Your voice matters. Each post, a unique perspective shared with
                the world. Don't let your stories fade. Write on, explore, and
                connect. Your words have the power to inspire, comfort, and
                ignite change. Keep sharing your journey.
              </p>
              <div>
                <p>Your Topics,</p>
                <div className="c-list">
                  {[...new Set(personalBlogs.map((p) => p.category))].map(
                    (category) => (
                      <p key={category}>{category}</p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="color-lines">
            <div className="color-line-1"></div>
            <div className="color-line-2"></div>
          </div>
        </div>
        <div
          className={`personal-page-container ${
            openModel ? "personal-blogs blurred" : "personal-blogs"
          }`}
        >
          <h2>My Stories</h2>
          {personalBlogs.length === 0 ? (
            <p>No blogs found. Start writing your first blog!</p>
          ) : (
            personalBlogs.map((p) => (
              <div key={p._id} className="blog-item">
                <h2>{p.title}</h2>
                <p>{p.content}</p>
                <div className="blog-metadata">
                  <p>
                    Last updated: {new Date(p.updatedAt).toLocaleString()}
                    <span> </span>
                    Word count: {p.content.length}
                    <span className="blog-metadata-dropdown">
                      <ChevronDown
                        onClick={() => toggleDropdown(p._id)}
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                        size={16}
                      />
                      {openDropdownId === p._id && (
                        <div className="dropdown-menu">
                          <div
                            className="dropdown-item"
                            onClick={() => handleEditBlog(p)}
                          >
                            <Edit size={16} /> Edit
                          </div>
                          <div
                            className="dropdown-item"
                            onClick={() => handleDeleteBlog(p._id)}
                          >
                            <Trash2 size={16} /> Delete
                          </div>
                        </div>
                      )}
                    </span>
                  </p>
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
