import React from "react";
import { Modal, Rate } from "antd";
import moment from "moment";
import "../../../sass/components/reviews-modal.scss";

const ReviewsModal = ({ review, onClose }) => {
  const userProfileImage = review.profile_picture
    ? review.profile_picture
    : "https://via.placeholder.com/80";

  return (
    <Modal
      visible={true}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      className="reviews-modal"
    >
      <div className="reviews-modal-content">
        <h2 className="reviews-modal-title">Review Details</h2>
        <div className="reviews-modal-header">
          <img
            src={userProfileImage}
            alt="User Profile"
            className="reviews-modal-image"
          />
          <div className="reviews-modal-info">
            <p className="reviews-modal-username">{review.name || "Anonymous"}</p>
            <p className="reviews-modal-date">
              Posted: {moment(review.created_at).format("MM/DD/YYYY HH:mm")}
            </p>
            {review.created_at !== review.updated_at && (
              <p className="reviews-modal-date">
                Updated: {moment(review.updated_at).format("MM/DD/YYYY HH:mm")}
              </p>
            )}
          </div>
        </div>
        <div className="reviews-modal-details">
          <Rate
            disabled
            defaultValue={review.rating}
            className="reviews-modal-rating"
          />
          <p className="reviews-modal-comment">{review.comment || "No comment"}</p>
          {review.photo && (
            <img
              src={review.photo}
              alt="Review"
              className="reviews-modal-photo"
            />
          )}
        </div>
        {review.user && (
          <div className="reviews-modal-user">
            <h3>User Information</h3>
            <p>
              Username: {review.user.username || "N/A"}
            </p>
            {review.user.profile && (
              <>
                <p>First Name: {review.user.profile.first_name || "N/A"}</p>
                <p>Middle Initial: {review.user.profile.middle_initial || "N/A"}</p>
                <p>Last Name: {review.user.profile.last_name || "N/A"}</p>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReviewsModal;