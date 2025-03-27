import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "../../component/comment-section/comment-section";

function BlogSinglePage({ userDetails }) {
  const { id } = useParams();
  const [singleBlog, setSingleBlog] = useState([]);

  console.log(singleBlog);

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
      <section>
        <div>
          <h1>{singleBlog.title}</h1>
          <img src={`${imagePath}${singleBlog.image}`} alt="" />
          <p>{singleBlog.content}</p>
        </div>
      </section>

      {userDetails && <CommentSection userDetails={userDetails} />}
    </main>
  );
}

export default BlogSinglePage;
