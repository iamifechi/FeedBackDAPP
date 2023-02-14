import React from "react";

const Feedbacks = ({ feedbacks }) => {
  if (!feedbacks) return <p className="empty">Loading feedbacks...</p>;
  return (
    <div className="feedbacks">
      {feedbacks.map((feedback, index) => {
        return (
          <div key={index} className="cards">
            <p className="address">
              <span>From: </span>
              {feedback.sender}
            </p>
            <p className="feedback">{feedback.feedback}</p>
            <p className="time">{feedback.time}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Feedbacks;
