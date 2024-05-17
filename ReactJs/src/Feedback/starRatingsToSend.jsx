import React, { useState, useEffect } from "react";
import "./StarRatings.css"; // Import the CSS file with updated styles
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { base_url } from "../baseUrl";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// StarRating component
const StarRatingToSend = ({
  rating,
  color,
  size,
  onHoverRating,
  onSelectRating,
  index,
}) => {
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

export default function RatingSystem({ feedback, circleRatingsToSend }) {
  // console.log("Feedback:", JSON.stringify(feedback, null, 2)); // Log the feedback object

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    feedback_type: "general_feedback",
    questions: [" "], // Initialize an empty array for questions
    questionsRating: [" "], // Initialize an empty array for questions
  });
  const [starRating, setStarRating] = useState(0);
  const [circleRating, setCircleRating] = useState(0);
  const [circleRatings, setCircleRatings] = useState({
    user_id: "",
    user_name: "",
    questions: {
      name: "",
      rating: 0,
      type: "cercle",
    },
  });

  const [user, setUser] = useState({});
  const userRole = localStorage.getItem("USER_ROLE");

  //Geting user
  const userJson = JSON.parse(localStorage.getItem("USER"));
  const formattedDate = format(
    new Date(userJson.data.data.createdAt),
    "dd MMM yyyy à HH:mm"
  );

  // Configurez Axios pour inclure le token dans toutes les requêtes
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  //Geting user
  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");
    // console.log("userId : ", userId);
    const fetchProfileData = async () => {
      try {
        let response;
        switch (userRole) {
          case "superAdmin":
            response = await axios.get(
              `${base_url}/superAdmin/getById/${userId}`
            );
            break;
          case "internautes":
            response = await axios.get(
              `${base_url}/internaute/getById/${userId}`
            );
            break;
          default:
            response = await axios.get(`${base_url}/patient/getById/${userId}`);
        }
        setUser({
          ...response.data.data,
          // Utilisez format de date-fns pour formater la date
          // dateNaissance: response.data.data.dateNaissance
          // ? format(new Date(response.data.data.dateNaissance), "yyyy-MM-dd")
          // : "",
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  useEffect(() => {
    
    // console.log("----------------------------------------------------");
    // console.log("feedback : ", feedback);
    // console.log("feedback?.feedback : ", feedback?.feedback);
    // console.log("----------------------------------------------------");
    if (feedback) {
      setFormData({
        title: feedback?.title || "",
        description: feedback?.description || "",
        feedback_type: feedback?.feedback_type || "general_feedback",
        questions: feedback?.questions || [], // Set questions if available
        questionsRating: feedback?.questionsRating || [], // Set questions if available
      });
      if (feedback?.questions) {
        setCircleRatings({
          user_id: "",
          user_name: "",
          questions: feedback.questions.map((question) => ({
            name: question.name,
            rating: 0,
            type: "cercle",
          })),
        });
      }
    } else if (feedback?.feedback) {
      setFormData({
        title: feedback?.feedback?.title || "",
        description: feedback?.feedback?.description || "",
        feedback_type: feedback?.feedback?.feedback_type || "general_feedback",
        questions: feedback?.feedback?.questions || [], // Set questions if available
        questionsRating: feedback?.feedback?.questionsRating || [], // Set questions if available
      });
      // Initialize circleRatings with default values
      if (feedback.feedback.questions) {
        setCircleRatings({
          user_id: "",
          user_name: "",
          questions: feedback.feedback.questions.map((question) => ({
            name: question.name,
            rating: 0,
            type: "cercle",
          })),
        });
        console.log("test rating circle **circleRatings**: ", circleRatings);
      }
    }
  }, [feedback]);

  const handleStarSelectRating = (rating) => {
    setStarRating(rating);
  };

  // const handleCircleSelectRating = (rating, currentQuestionIndex) => {
  //   setCircleRating(rating);
  //   // console.log(`Question: ${formData.questions[currentQuestionIndex].name || ""}`);  // Log question name
  //   console.log(`Question: ${currentQuestionIndex || "Not work"}`); // Log question name
  //   console.log(`Selected Rating: ${rating}`);
  //   // console.log(`curent user is : ${user._id}`)  ;                              // Log selected rating
  // };
  const handleCircleSelectRating = (rating, currentQuestionIndex) => {
    // Update the rating for the selected question
    setCircleRatings((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((question) => {
        if (question.name === currentQuestionIndex) {
          question.rating = rating;
          return {
            ...question,
            rating: rating,
          };
        }
        return question;
      }),
    }));
    // formData.questionsRating.push(circleRatings);
    circleRatingsToSend.user_id = localStorage.getItem("USER_ID");
    circleRatingsToSend.user_name = user.nom + " " + user.prenom;
    console.log("circleRatingsToSend.user_name : ", circleRatingsToSend);
    // console.log("circleRatingsToSend.user_name : ",circleRatingsToSend.user_name);
    circleRatingsToSend.questions = circleRatings.questions;
  };

  const handleShowStarRating = (data) => {
    setDataObject(data);
    // Your other logic here
  };

  return (
    <div>
      <br />

      {/* Questions */}
      <table>
        <tbody>
          {formData.questions.map((question, index) => (
            <tr key={index}>
              <td className="col-lg-6">
                <div className="height-100 container d-flex justify-content-center align-items-center">
                  <div className=" p-3">
                    <h6 className="review-count">{question.name || ""}</h6>
                  </div>
                </div>
              </td>
              <td className="col-lg-6">
                <div className="height-100 container d-flex justify-content-center align-items-center">
                  <div className=" p-3">
                    <CircleRating
                      rating={circleRating}
                      color="#fbc634"
                      size="32px"
                      onSelectRating={(rating) =>
                        handleCircleSelectRating(
                          rating,
                          formData.questions[index].name
                        )
                      }
                    />
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
