import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Rate } from "antd";
import TopNav from "../topnav";
import AdminSideMenu from "../admin-sidemenu";
import ReviewsModal from "../../components/Reviews/ReviewsModal";
import "../../../sass/components/reviews.scss";
import moment from "moment";

const Reviews = ({ productId = 1 }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();

    const fetchReviews = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to view reviews");
        navigate("/login");
        return;
      }

      try {
        const userResponse = await axios.get("http://localhost:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
          cancelToken: source.token,
        });

        if (isMounted) {
          if (userResponse.data.data && userResponse.data.data.roles_id === 1) {
            setIsAdmin(true);
          } else {
            alert("Access denied. Admins only.");
            navigate("/homepagecontent");
            return;
          }
        }

        const response = await axios.get(
          `http://localhost:8000/api/ratings/product/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cancelToken: source.token,
          }
        );

        if (isMounted && response.data.success) {
          setReviews(response.data.data);
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error("Error fetching reviews:", error);
        if (isMounted && error.response?.status === 401) {
          localStorage.removeItem("authToken");
          alert("Session expired. Please log in again.");
          navigate("/login");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
      source.cancel("Component unmounted");
    };
  }, [navigate, productId]);

  const openModal = (review) => {
    setSelectedReview(review);
  };

  const closeModal = () => {
    setSelectedReview(null);
  };

  return (
    <div className="reviews-wrapper">
      <TopNav />
      <AdminSideMenu />
      <div className="reviews-content">
        <h1 className="reviews-title">Product Reviews</h1>
        <div className="reviews-list">
          {loading ? (
            <p className="reviews-empty">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="reviews-empty">No reviews found for this product.</p>
          ) : (
            reviews.map((review) => {
              const userProfileImage = review.profile_picture
                ? review.profile_picture
                : "https://via.placeholder.com/80";
              const truncatedComment =
                review.comment && review.comment.length > 100
                  ? `${review.comment.substring(0, 100)}...`
                  : review.comment || "No comment";
              return (
                <div className="reviews-card" key={review.id}>
                  <div className="reviews-card-header">
                    <img
                      src={userProfileImage}
                      alt="User Profile"
                      className="reviews-card-image"
                    />
                    <div className="reviews-card-info">
                      <p className="reviews-username">{review.name || "Anonymous"}</p>
                      <p className="reviews-date">
                        {moment(review.created_at).format("MM/DD/YYYY")}
                      </p>
                    </div>
                  </div>
                  <div className="reviews-card-details">
                  </div>
                  <button
                    className="reviews-card-button"
                    onClick={() => openModal(review)}
                  >
                    View Details
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
      {selectedReview && (
        <ReviewsModal review={selectedReview} onClose={closeModal} />
      )}
    </div>
  );
};

export default Reviews;