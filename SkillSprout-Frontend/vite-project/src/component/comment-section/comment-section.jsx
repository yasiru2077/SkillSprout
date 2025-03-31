import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./comment-section.css";

function CommentSection({ userDetails }) {
  const { id: blogId } = useParams();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingComment, setEditingComment] = useState(null);

  const NumberOfComments = comments.length;

  // Fetch comments when component mounts or blog changes
  useEffect(() => {
    fetchComments();
  }, [blogId]);

  // Fetch comments for the current blog
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/blog/${blogId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Create a new comment
  const handleCreateComment = async (e) => {
    e.preventDefault();

    if (!newCommentText.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newCommentText,
          blogId: blogId,
          author: userDetails.id, // Assuming you have user ID
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newComment = await response.json();
      setComments([newComment, ...comments]);
      setNewCommentText("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  // Update a comment
  const handleUpdateComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: editingComment.text,
            currentUserId: userDetails.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedComment = await response.json();
      setComments(
        comments.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        )
      );
      setEditingComment(null);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentUserId: userDetails.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Render the comment section
  return (
    <section className="comment-section-container">
      {/* Comment Input Form */}
      <h1>{NumberOfComments} Comments</h1>
      <form onSubmit={handleCreateComment} className="comment-form">
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Write a comment..."
          rows="3"
        />
        <div>
          <button type="submit">Comment</button>
        </div>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            {editingComment && editingComment._id === comment._id ? (
              // Edit Mode
              <div>
                <textarea
                  value={editingComment.text}
                  onChange={(e) =>
                    setEditingComment({
                      ...editingComment,
                      text: e.target.value,
                    })
                  }
                />
                <div>
                  <button onClick={() => handleUpdateComment(comment._id)}>
                    Save
                  </button>
                  <button onClick={() => setEditingComment(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <p>{comment.text}</p>
                <div className="comment-meta">
                  <span>By {comment.author.username}</span>
                  <p className="posted-date">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                  {userDetails.id === comment.author._id && (
                    <div className="comment-actions">
                      <button onClick={() => setEditingComment(comment)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteComment(comment._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default CommentSection;
