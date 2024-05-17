import React, { useState, useEffect } from "react";
import "./StarRatings.css"; // Import the CSS file with updated styles

// StarRating component
const StarRating = ({ onHoverRating, onSelectRating, index }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const [hoveredStar, setHoveredStar] = useState(null);

  const handleStarHover = (index) => {
    setHoveredStar(index + 1);
    onHoverRating(index + 1); // Call the onHoverRating callback
  };

  const handleStarLeave = () => {
    setHoveredStar(null);
    onHoverRating(null); // Reset hover rating when mouse leaves
  };

  const handleStarClick = (index) => {
    onSelectRating(index + 1); // Call the onSelectRating callback
  };

  const getDescription = (index) => {
    switch (index) {
      case 1:
        return "Abysmal";
      case 2:
        return "Bad";
      case 3:
        return "Ok";
      case 4:
        return "Good";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < totalStars; i++) {
      let starClassName = "fa fa-star";
      if (i < fullStars) {
        starClassName += " rating-color";
      } else if (i === fullStars && hasHalfStar) {
        starClassName += " fa-star-half-alt rating-color";
      }

      const starStyle = {
        color: i < (hoveredStar || rating) ? color : "#cecece",
        fontSize: size,
      };

      stars.push(
        <span
          key={i}
          className="star"
          data-value={i + 1}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
          onClick={() => handleStarClick(i)}
        >
          <i className={starClassName} style={starStyle}></i>
          <span className="star-notification">{getDescription(i + 1)}</span>
        </span>
      );
    }

    return stars;
  };

  return <div className="ratings">{renderStars()}</div>;
};

// CircleRating component
const CircleRating = ({ rating, color, size, onSelectRating }) => {
  const totalCircles = 7;
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedDescription, setSelectedDescription] = useState("");

  const handleCircleClick = (value) => {
    setSelectedRating(value);
    setSelectedDescription(getDescription(value));
    onSelectRating(value);
  };

  const getDescription = (index) => {
    switch (index) {
      case 1:
        return "completely disagree";
      case 2:
        return "disagree";
      case 3:
        return "somewhat disagree";
      case 4:
        return "indifferent";
      case 5:
        return "somewhat agree";
      case 6:
        return "agree";
      case 7:
        return "completely agree";
      default:
        return "";
    }
  };

  const renderCircles = () => {
    const circles = [];

    for (let i = 1; i <= totalCircles; i++) {
      const circleStyle = {
        backgroundColor: i === selectedRating ? color : "#cecece",
        width: size,
        height: size,
        borderRadius: "50%",
        margin: "0 5px",
        cursor: "pointer",
        display: "inline-block", // Ensure circles are displayed inline
      };

      circles.push(
        <div
          key={i}
          className="circle"
          style={circleStyle}
          onClick={() => handleCircleClick(i)}
        ></div>
      );
    }

    return circles;
  };

  return (
    <div className="circle-container">
      <div className="circle-row">{renderCircles()}</div>
      {selectedDescription && (
        <div className="selected-description">{selectedDescription}</div>
      )}
    </div>
  );
};

export default function RatingSystem({ feedback, selectedQuestion }) {
  console.log("feedback : ",feedback, "\n selectedQuestion : ",selectedQuestion);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    feedback_type: "general_feedback",
    questionsRating: [" "], // Initialize an empty array for questions
    questions: [" "], // Initialize an empty array for questions
  });

  const [starRating, setStarRating] = useState(0);
  const [circleRating, setCircleRating] = useState(0);

  useEffect(() => {
    if (feedback) {
      setFormData({
        title: feedback?.title || "",
        description: feedback?.description || "",
        feedback_type: feedback?.feedback_type || "general_feedback",
        questionsRating: feedback?.questionsRating || [], // Set questions if available
      });
    }
  }, [feedback]);
  const handleStarSelectRating = (rating) => {
    setStarRating(rating);
  };

  const handleCircleSelectRating = (rating) => {
    setCircleRating(rating);
  };
  const handleShowStarRating = (data) => {
    setDataObject(data);
    // Your other logic here
  };

  const updateQuestionRating = (index, rating) => {
    const updatedQuestionsRating = [...formData.questionsRating];
    updatedQuestionsRating[index] = rating;
    setFormData((prevState) => ({
      ...prevState,
      questionsRating: updatedQuestionsRating,
    }));
  };

  const getDescription = (rating) => {
    switch (rating) {
      case 1:
        return "completely disagree";
      case 2:
        return "disagree";
      case 3:
        return "somewhat disagree";
      case 4:
        return "indifferent";
      case 5:
        return "somewhat agree";
      case 6:
        return "agree";
      case 7:
        return "completely agree";
      default:
        return "";
    }
  };

  return (
    <div>
      <br />

      {/* Questions */}
      <table>
        <tbody>
          {selectedQuestion.map((question, index) => (
            <tr key={index}>
              <td className="col-lg-6">
                <div className="height-100 container d-flex justify-content-center align-items-center">
                  <div className="p-3">
                    <h6 className="review-count">{question?.name || ""}</h6>
                  </div>
                </div>
              </td>

              {/* <td className="col-lg-6">
                <div className="height-100 container d-flex justify-content-center align-items-center">
                  <div className="p-3">
                    <button
                      type="button"
                      className="btn btn-md btn-primary"
                      disabled
                    >
                      {getDescription(question?.rating)}
                    </button>

                    <CircleRating
                      rating={formData.questionsRating[index] || 0} // Set rating for the specific question
                      color="#fbc634"
                      size="32px"
                      onSelectRating={(rating) =>
                        updateQuestionRating(index, rating)
                      } // Update rating for the specific question
                    />
                  </div>
                </div>
              </td> */}
              <td className="col-lg-6">
                <div className="height-100 container d-flex justify-content-center align-items-center">
                  <div className="p-3">
                    {question?.rating !== null ? (
                      <button
                        type="button"
                        className="btn btn-md btn-primary"
                        disabled
                      >
                        {getDescription(question?.rating)}
                      </button>
                    ) : (
                      <CircleRating
                        rating={formData.questionsRating[index] || 0} // Set rating for the specific question
                        color="#fbc634"
                        size="32px"
                        onSelectRating={(rating) =>
                          updateQuestionRating(index, rating)
                        } // Update rating for the specific question
                      />
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* End of Questions */}
    </div>
  );
}
