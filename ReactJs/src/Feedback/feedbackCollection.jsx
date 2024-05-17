import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import StarRating from "./starRatings";

function feedbackCollection({ feedback, index }) {
  const [showSR, setShowSR] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectQuestion, setselectQuestion] = useState(null);
  const [selectedindex, setSelectedindex] = useState(null);

  const handleShowStarRating = (data, index) => {
    setSelectedData(data);
    setselectQuestion(data.formData.questionsRating[index.index].questions);
    console.log(
      "selectedData : ",
      data.formData.questionsRating[index.index].questions
    );
    setSelectedindex(index);
    setShowSR(true);
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    feedback_type: "general_feedback",
    questionsRating: [" "], // Initialize an empty array for questions
  });

  useEffect(() => {
    if (feedback) {
      setFormData({
        title: feedback?.feedback?.title || "",
        description: feedback?.feedback?.description || "",
        feedback_type: feedback?.feedback?.feedback_type || "general_feedback",
        questionsRating: feedback?.feedback?.questionsRating || [], // Set questions if available
      });
    }
  }, [feedback]);
  const handleCloseStarRating = () => setShowSR(false);

  
  return (
    <>
      {/* list of items */}
      <>
        {/* Page main content START */}
        <div className="page-content-wrapper p-xxl-4">
          {/* Title */}
          <div className="row">
            <div className="col-12 mb-4 mb-sm-5">
              <div className="d-sm-flex justify-content-between align-items-center">
                <h1 className="h3 mb-3 mb-sm-0">{formData.title} </h1>
              </div>
            </div>
          </div>
          <br />

          {/* list Begin */}
          <div className="card shadow mt-5">
            {/* Card body Begin */}
            <div className="card-body">
              {/* Table head */}
              <div className="bg-light rounded p-3 d-none d-lg-block">
                <div className="row row-cols-7 g-4">
                  <div className="col">
                    <h6 className="mb-0">feedback N⁰</h6>
                  </div>
                  <div className="col">
                    <h6 className="mb-0">user</h6>
                  </div>
                  <div className="col">
                    <h6 className="mb-0">rating</h6>
                  </div>
                  <div className="col">
                    <h6 className="mb-0">Action</h6>
                  </div>
                </div>
              </div>
              {/* Table data */}
              {formData.questionsRating.map((question, index) => (
                <div
                  // key={question._id}
                  key={index + 4}
                  className="row row-cols-xl-7 align-items-lg-center border-bottom g-4 px-2 py-4"
                >
                  {/* index item */}
                  <div className="col">
                    <small className="d-block d-lg-none">N⁰ :</small>
                    <h6 className="mb-0 fw-normal">{index + 1}</h6>
                  </div>
                  {/* Name of item */}
                  <div className="col">
                    <small className="d-block d-lg-none">feedback :</small>
                    <h6 className="mb-0 fw-normal">
                      {/* {question?.user_id.length > 10 */}
                      {question?.user_id
                        ? `${question.user_id.slice(0, 10)}...`
                        : question?.user_id || ""}
                    </h6>
                  </div>

                  {/* feedback_type item */}
                  <div className="col">
                    <div className="badge bg-success bg-opacity-10 text-success">
                      {/* {feedback.feedback_type &&
                      feedback.feedback_type.length > 15
                        ? `${feedback.feedback_type.slice(0, 15)}...`
                        : feedback?.feedback_type || ""} */}
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="col">
                    <small className="d-block d-lg-none">Action :</small>

                    <button
                      className="btn btn-sm btn-info m-1"
                      onClick={() =>
                        handleShowStarRating({ formData }, { index })
                      }
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Card body END */}
            {/* Card footer Begin */}
            <div className="card-footer pt-0">
              {/* Pagination and content */}
              <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                {/* Content */}
                <p className="mb-sm-0 text-center text-sm-start">
                  Showing 1 to 8 of 20 entries
                </p>
                {/* Pagination */}
                <nav
                  className="mb-sm-0 d-flex justify-content-center"
                  aria-label="navigation"
                >
                  <ul className="pagination pagination-sm pagination-primary-soft mb-0">
                    <li className="page-item disabled">
                      <a className="page-link" href="#" tabIndex={-1}>
                        Prev
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        1
                      </a>
                    </li>
                    <li className="page-item active">
                      <a className="page-link" href="#">
                        2
                      </a>
                    </li>
                    <li className="page-item disabled">
                      <a className="page-link" href="#">
                        ..
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        15
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        Next
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            {/* Card footer END */}
          </div>
          {/* list END */}
        </div>
        {/* Page main content END */}/
      </>
      {/* Modal */}
      <>
        {/* Modal Start Rating */}
        <Modal show={showSR} onHide={handleCloseStarRating} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Star Ratings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <StarRating
              feedback={formData}
              index={selectedindex}
              selectedQuestion={selectQuestion}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseStarRating}>
              Close
            </Button>
            <Button variant="primary">Send</Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
}

export default feedbackCollection;
