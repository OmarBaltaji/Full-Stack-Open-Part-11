import React from "react";

const Feedback = ({ feedback: {message, type} }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={type === "success" ? "success" : "error"}>
      {message}
    </div>
  );
};

Feedback.propTypes = {
  feedback: {
    message: String,
    type: String,
  }
};

export default Feedback;