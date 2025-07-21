/* eslint-disable react/prop-types */
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

export default Feedback;