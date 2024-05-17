import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import StarRatingToSend from "../../Feedback/starRatingsToSend";

import { Steps, Button, message, Form, Input } from "antd";
import InformationPrincipale from "./StepsAddProject/InformationPrincipale";
import InformationsComplementaires from "./StepsAddProject/InformationsComplementaires";
import FomulairesCollecte from "./StepsAddProject/FomulairesCollecte";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";
import { base_url } from "../../baseUrl";
import { useNavigate } from "react-router-dom";
const { Step } = Steps;
function AddProjet({ onFinish }) {
  //*********************************************************** */
  //************************** Begin Feedback *************************/
  //*********************************************************** */
  //add feedback function
  const [feedbacks, setFeedback] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const handleCloseStarRatingToSend = () => setShowSRToSend(false);
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  const [showSRToSend, setShowSRToSend] = useState(false);

  // useEffect(() => {

  //   // setSelectedId("6631b554727129cf68b309f7");
  //   // selectedId = "662b3a2e50619365b2868632";

  //   fetch("http://localhost:3000/feedback/feedback/latest")
  //   // fetch(`http://localhost:3000/feedback/${selectedId}`)
  //     .then((response) => response.json())
  //     .then((data) => setSelectedData(data))
  //     .catch((error) => console.error("Error fetching feedback:", error));
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // setSelectedId("6631b554727129cf68b309f7");

        // fetch("http://localhost:3000/feedback/feedback/latest")
        const response = await fetch(
          `http://localhost:3000/feedback/feedback/latest`
        );
        const data = await response.json();
        setSelectedData(data);
        setSelectedId(selectedData._id);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchData();
  }, []);

  //*********************************************************** */
  //************************** End Feedback *************************/
  //*********************************************************** */

  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState(
    sessionStorage.getItem("globalData")
      ? JSON.parse(sessionStorage.getItem("globalData"))
      : null
  );
  const [importSwitch, setImportSwitch] = useState(false);

  const navigate = useNavigate();
  const handleImportSwitchChange = (checked) => {
    setImportSwitch(checked);
  };
  const handleNext = (data) => {
    setCurrentStep(currentStep + 1);
    setProjectData(data);
    const prevData = JSON.parse(sessionStorage.getItem("globalData"));
    const newData = {
      ...prevData,
      ...data,
    };
    setProjectData(newData);

    sessionStorage.setItem("globalData", JSON.stringify(newData));
    console.log("slouma ya chbeb", data);
  };
  useEffect(() => {
    console.log("aaa", importSwitch);
  }, [importSwitch]);
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  //*********************************************************** */
  //************************** Feedback *************************/
  //*********************************************************** */
  //add feedback function

  const [circleRatingsToSend, setCircleRatingsToSend] = useState({
    user_id: "",
    user_name: "",
    questions:
      selectedData?.feedback?.questions.map((question) => ({
        name: question.name,
        rating: 0,
        type: "cercle",
      })) || [],
  });

  const handleSubmit = async () => {
    try {
      let response;

      if (selectedId == null) {
        response = await axios.post(
          `http://localhost:3000/feedback`,
          selectedData.feedback
        );
      } else {
        response = await axios.put(
          // `http://localhost:3000/feedback/${selectedId}`,
          `http://localhost:3000/feedback/${selectedId}`,
          selectedData.feedback
        );
      }

      // Check for successful response
      if (response.status >= 200 && response.status < 300) {
        const updatedFeedback = response.data;

        if (selectedId == null) {
          setFeedback((prevFeedbacks) => [...prevFeedbacks, updatedFeedback]);
        } else {
          setFeedback((prevFeedbacks) =>
            prevFeedbacks.map((feedback) =>
              feedback._id === selectedId ? updatedFeedback : feedback
            )
          );
        }

        handleClose();
      } else {
        throw new Error("Error updating data");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle errors appropriately, e.g., display error message to user
    }
    createProject();
  };

  // Modal for Sending Feedback
  const handleSendRating = async () => {
    // setSelectedData(selectedData._id);
    try {
      // console.log("selected Id : ", selectedId);
      // console.log("selected data : ", selectedData);
      selectedData.questionsRating.push(circleRatingsToSend);

      await axios.put(
        `http://localhost:3000/feedback/${selectedData._id}`,
        selectedData
      );

      handleSubmit();

      setShowSRToSend(false);
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  const handleShowStarRatingToSend = (data) => {
    setSelectedData(data);
    setShowSRToSend(true);
  };

  const handleFinish = () => {
    handleShowStarRatingToSend(selectedData);
    // createProject();
    // console.log("Test selectedData : ", selectedId);
    // console.log("Test selectedData : ", selectedData);
  };

  const createProject = () => {
    message.success("Formulaire soumis avec succès!");
    const accessToken = localStorage.getItem("accessToken");
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const userId = localStorage.getItem("USER_ID");
    console.log("Données finales :", projectData);
    axios
      .post(`${base_url}/project/add`, { ...projectData, userId }, axiosConfig)
      .then((response) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/internaute/liste");
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while updating.",
        });
      });
  };

  const steps = [
    {
      title: "Information Principale",
      content: (
        <InformationPrincipale onNext={handleNext} projectData={projectData} />
      ),
    },
    {
      title: "Informations Complémentaires",
      content: (
        <InformationsComplementaires
          onNext={handleNext}
          projectData={projectData}
        />
      ),
    },
    {
      title: "Fomulaire",
      content: (
        <FomulairesCollecte
          importSwitch={importSwitch}
          onImportSwitchChange={handleImportSwitchChange}
          onNext={handleNext}
          projectData={projectData}
        />
      ),
    },
    {
      title: "Étape ",
      content: (
        <div className="text-center mt-5">
          <img
            src="assets/images/suc.jpeg"
            alt=""
            className="img-fluid w-50 "
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="my-5 mb-5">
        <div className="container vstack gap-4 mb-5 mt-5">
          <div className="row mb-5 card rounded-3 border p-4 pb-2">
            <div className="col-12 mb-5 mt-3">
              <h1 className="fs-4 mb-0">
                <PlusOutlined className="mx-3" />
                Ajouter Projet
              </h1>
              <p className="text-center text-justify mt-5">
                <strong>
                  "La création d'un projet, c'est comme tisser une toile
                  complexe : chaque formulaire est un fil essentiel, tissant
                  ensemble les détails pour créer une œuvre complète et
                  fonctionnelle."
                </strong>
              </p>
            </div>
            <div>
              <Steps current={currentStep}>
                {steps.map((step, index) => (
                  <Step key={index} title={step.title} />
                ))}
              </Steps>
              <div className="steps-content">{steps[currentStep].content}</div>
              <div className="steps-action mb-5 d-flex justify-content-around">
                {currentStep > 0 && (
                  <Button
                    style={{ margin: "0 8px" }}
                    onClick={handlePrev}
                    className="d-flex justify-content-center align-items-center "
                  >
                    <ArrowLeftOutlined /> Précédent
                  </Button>
                )}

                {currentStep === steps.length - 1 && (
                  <Button type="submit" onClick={handleFinish}>
                    Soumettre
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ************************************************************************************* */}
      {/* ************************************************************************************* */}

      {/* Modal Start Rating */}
      <Modal show={showSRToSend} onHide={handleCloseStarRatingToSend} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Star Ratings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {console.log("selectedData : ", selectedData)}
          {console.log("circleRatingsToSend : ", circleRatingsToSend)}

          <StarRatingToSend
            feedback={selectedData}
            circleRatingsToSend={circleRatingsToSend}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStarRatingToSend}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSendRating()}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ************************************************************************************* */}
      {/* ************************************************************************************* */}
    </>
  );
}

export default AddProjet;
