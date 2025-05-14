import React, { useContext, useEffect, useState, useCallback } from "react";
import { ShopContext } from "../../Context/ShopContext";
import "./DescriptionBox.css";

const DescriptionBox = ({ productId }) => {
  const { user } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:4000/reviews/${productId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data);
      setError(null); 
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(error.message || "Failed to load reviews");
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.name) {
      setError("You must be logged in to submit a review.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/addreview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          username: user.name,
          text: newReview,
          rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add review");
      }

      setNewReview("");
      setRating(5);
      fetchReviews();
    } catch (error) {
      setError(error.message || "Failed to submit review");
    }
  };

  const handleReplySubmit = async (reviewId) => {
    if (!user || !user.name) {
      setError("You must be logged in to reply.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/addreply/${reviewId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.name,
          text: replyText,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Reply error response:", errorText);
        throw new Error("Failed to add reply");
      }

      setReplyText("");
      setReplyingTo(null);
      fetchReviews();
    } catch (error) {
      setError(error.message || "Failed to submit reply");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:4000/deletereview/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user?.name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete review");
      }

      const updatedReviews = await response.json();
      setReviews(updatedReviews.reviews);
    } catch (error) {
      setError(error.message || "Failed to delete review");
    }
  };

  const handleEditReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:4000/review/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user?.name,
          text: editText,
          rating: editRating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update review");
      }

      setEditingReviewId(null);
      setEditText("");
      setEditRating(5);
      fetchReviews();
    } catch (error) {
      setError(error.message || "Failed to update review");
    }
  };

  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box fade">
          Reviews ({reviews.length})
        </div>
      </div>

      <div className="descriptionbox-description">
        <form onSubmit={handleReviewSubmit}>
          <textarea
            name="Review"
            placeholder="Add a review..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <div className="rating-slider">
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
            <span>{rating} ⭐</span>
          </div>
          <button type="submit" disabled={!newReview.trim()}>
            Submit
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <h3>Reviews</h3>
        <ul>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <li key={review._id}>
                {editingReviewId === review._id ? (
                  <div className="edit-review-box">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="rating-slider">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={editRating}
                        onChange={(e) => setEditRating(Number(e.target.value))}
                      />
                      <span>{editRating} ⭐</span>
                    </div>
                    <button onClick={() => handleEditReview(review._id)} disabled={!editText.trim()}>
                      Save
                    </button>
                    <button onClick={() => setEditingReviewId(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <strong>{review.username}:</strong> {review.text} ({review.rating} ⭐)
                  </>
                )}
                {review.username === user?.name && (
                  <>
                    <button onClick={() => handleDeleteReview(review._id)}>Delete</button>
                    <button
                      onClick={() => {
                        setEditingReviewId(review._id);
                        setEditText(review.text);
                        setEditRating(review.rating);
                      }}
                    >
                      Edit
                    </button>
                  </>
                )}

                <button onClick={() => setReplyingTo(replyingTo === review._id ? null : review._id)}>
                  {replyingTo === review._id ? "Cancel" : "Reply"}
                </button>

                {review.replies && review.replies.length > 0 && (
                  <ul className="replies">Replies
                    {review.replies.map((reply, idx) => (
                      <li key={idx}>
                        <strong>{reply.username}:</strong> {reply.text}
                      </li>
                    ))}
                  </ul>
                )}

                {replyingTo === review._id && (
                  <div className="reply-box">
                    <textarea
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button onClick={() => handleReplySubmit(review._id)} disabled={!replyText.trim()}>
                      Send Reply
                    </button>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li>No reviews yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DescriptionBox;