import React, { useEffect, useState } from "react";
import EditPersonalBlog from "../../component/single-blog-page/edit-personal-blog";
import "./personal.css";

function PersonalBlogs({ userDetails }) {
  const [personalBlogs, setPersonalBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [openModel, setOpenModel] = useState(false);
  const [wordCount, setWordCount] = useState([]);

  console.log(wordCount);

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

        const personalData = data.filter(
          (blog) => blog.author._id === userDetails.user._id
        );

        const content = data.map((d) => d.content.length);

        setWordCount(content);

        console.log("content", content);

        console.log("pD:", personalData);

        console.log("blog:", data);

        setPersonalBlogs(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error.message);
      });
  }, []);

  const modelState = () => {
    setOpenModel(!openModel);
  };

  return (
    <main>
      <section>
        <div className={`${openModel ? "edit-model-container" : ""}`}>
          {openModel && <EditPersonalBlog />}
        </div>
        <div className={`${openModel ? "personal-blogs" : ""}`}>
          {personalBlogs.map((p) => (
            <div key={p._id}>
              <h1>{p.title}</h1>
              {/* <img
                src={`${imagePath}${p.image}`}
                alt={`Blog image for ${p.title}`}

              /> */}
              <p>{p.content}</p>
              <div>
                <p>{new Date(p.updatedAt).toLocaleString()}</p>
                
              </div>
              <button onClick={modelState}>Edit</button>
              <button>Delete</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default PersonalBlogs;
