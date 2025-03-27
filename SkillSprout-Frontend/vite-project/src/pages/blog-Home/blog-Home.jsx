import React, { useEffect, useState } from "react";
import WriteIcon from "../../component/write-icon/write";
import "./home.css";
import { useNavigate } from "react-router-dom";

function BlogHomePage() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const imagePath = "http://localhost:5000/";

  useEffect(() => {
    fetch("http://localhost:5000/api/blogs", {
      method: "GET",
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status:${response.status}`);
        }
        const data = await response.json();
        console.log("blogs:", data);
        setBlogs(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message); // Set error state
      });
  }, []);

  const handleSingle = (_id) => {
    console.log(_id);
    navigate(`/BlogSinglePage/${_id}`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="all-blogs">
      <section>
        <WriteIcon />
        <div>
          {blogs.map((blog) => (
            <div
              key={blog._id}
              onClick={() => {
                handleSingle(blog._id);
              }}
            >
              <h1>{blog.title}</h1>
              <img
                src={`${imagePath}${blog.image}`}
                alt={`Blog image for ${blog._id}`}
              />
              <p>{blog.content}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default BlogHomePage;
