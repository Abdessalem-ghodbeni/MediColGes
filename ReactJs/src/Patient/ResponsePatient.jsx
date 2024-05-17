import axios from "axios";
import React, { useEffect, useState } from "react";
import { base_url } from "../baseUrl";
import FormComponent from "./FormComponent";

function ResponsePatient() {
  const [reponseByUsrId, setReponseByUsrId] = useState([]);
  const [ListeResponse, setListeResponse] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const userId = localStorage.getItem("USER_ID");
  const USER_ROLE = localStorage.getItem("USER_ROLE");
  useEffect(() => {
    axios
      .get(`${base_url}/response/rep/by/user/${userId}`, axiosConfig)
      .then(async (response) => {
        console.log("twin 7 ", response);
        const listeResponse = response.data.listebyuser;
        const updatedListeResponse = await Promise.all(
          listeResponse.map(async (responseItem) => {
            const updatedAnswers = await Promise.all(
              responseItem.answers.map(async (answer) => {
                try {
                  const fieldDetails = await axios.get(
                    `${base_url}/response/get/formfiled/${answer.field}`
                  );
                  const fieldTitle = fieldDetails.data.inputDetails.label;
                  console.log(fieldDetails.data);
                  return { ...answer, title: fieldTitle };
                } catch (error) {
                  console.error(
                    `Error fetching field details for field ID ${answer.field}:`,
                    error
                  );
                  return answer;
                }
              })
            );
            return { ...responseItem, answers: updatedAnswers };
          })
        );
        const groupedResponses = groupResponsesByForm(updatedListeResponse);
        setListeResponse(groupedResponses);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const groupResponsesByForm = (responses) => {
    const groupedResponses = {};
    responses.forEach((responseItem) => {
      const formId = responseItem.form._id;
      if (!groupedResponses[formId]) {
        groupedResponses[formId] = {
          formId,
          formFields: responseItem.form.formFields,
          responses: [],
          formName: responseItem.form.title,
        };
      }
      groupedResponses[formId].responses.push(responseItem);
    });
    return Object.values(groupedResponses);
  };

  const handleDeleteResponse = async (responseId) => {
    try {
      console.log("he4a huwa id ", responseId);
      const response = await axios.delete(
        `${base_url}/response/delete/${responseId}`,
        axiosConfig
      );

      if (response.data.success) {
        console.log("Réponse supprimée avec succès");

        // Update the local state to reflect the deleted response
        const updatedListeResponse = ListeResponse.filter((group) =>
          group.responses.every((item) => item._id !== responseId)
        );
        setListeResponse(updatedListeResponse);
      } else {
        console.error(
          "Erreur lors de la suppression de la réponse:",
          response.data.message
        );
        alert("Une erreur est survenue. Veuillez réessayer plus tard."); // User-friendly error message
      }
    } catch (error) {
      console.error("Error deleting response:", error);
      alert("Une erreur de réseau est survenue. Veuillez réessayer plus tard."); // User-friendly error message
    }
  };

  return (
    <div className="pt-0">
      <div className="container vstack gap-4">
        <div className="page-content-wrapper ">
          {/* Title */}
          <div className="row">
            <h4 className="text-center text-justify  my-1 my-md-5">
              <strong>
                "Consultation de Mes Réponses aux Formulaires Médicaux"
              </strong>
            </h4>
          </div>
          {ListeResponse.map((group) => (
            <FormComponent
              key={group.formId}
              formId={group.formId}
              formName={group.formName}
              formFields={group.formFields}
              responses={group.responses}
              handleDeleteResponse={handleDeleteResponse}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResponsePatient;
