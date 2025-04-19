import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";
import "./DescriptionBox.css";

const DescriptionBox = ({ productId }) => {
  const { user } = useContext(ShopContext); // Get the logged-in user
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviews([]);
      setError(null);

      if (!productId) {
        setError("Invalid product ID");
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/getreviews/${productId}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");

        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews");
      }
    };

    fetchReviews();
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) {
      setError("Review text cannot be empty");
      return;
    }

    if (!productId) {
      setError("Invalid product ID");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/addreview/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newReview, rating, username: user?.username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.message || "Failed to add review");
      }

      const updatedReviews = await response.json();
      setReviews(updatedReviews.reviews);
      setNewReview("");
      setRating(5);
    } catch (error) {
      console.error("Error adding review:", error);
      setError(error.message || "Failed to submit review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:4000/deletereview/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user?.username }), // Pass the username for validation
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.message || "Failed to delete review");
      }

      const updatedReviews = await response.json();
      setReviews(updatedReviews.reviews);
    } catch (error) {
      console.error("Error deleting review:", error);
      setError(error.message || "Failed to delete review");
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
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} ⭐
              </option>
            ))}
          </select>
          <button type="submit" disabled={!newReview.trim()}>
            Submit
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <h3>Reviews</h3>
        <ul>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <li key={review.id}>
                <strong>{review.username}:</strong> {review.text}
                {review.username === user?.username && ( // Show delete button only for the logged-in user's reviews
                  <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
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