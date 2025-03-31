import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "../../component/comment-section/comment-section";
import "./blog-single-page.css";

function BlogSinglePage({ userDetails }) {
  const { id } = useParams();
  const [singleBlog, setSingleBlog] = useState([]);

  const imagePath = "http://localhost:5000/";

  console.log(id);

  useEffect(() => {
    fetch(`http://localhost:5000/api/blogs/${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status:${response.status}`);
        }
        const data = await response.json();
        console.log("blogs:", data);
        setSingleBlog(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        // setError(err.message); // Set error state
      });
  }, []);

  return (
    <main>
      <section className="single-blog-page">
        <div className="single-blog-container-1">
          <div>
            <h1>{singleBlog.author?.username}</h1>
            <h2>Posted on {new Date(singleBlog.updatedAt).toDateString()}</h2>
          </div>
          <h3>{singleBlog.title}</h3>
          <p>✧ {singleBlog.category}</p>
        </div>
        <div className="single-blog-container-2">
          <img src={`${imagePath}${singleBlog.image}`} alt="" />
          <p>{singleBlog.content}</p>
        </div>
      </section>
      <section className="comment-section">
        {userDetails && <CommentSection userDetails={userDetails} />}
      </section>
    </main>
  );
}

export default BlogSinglePage;
