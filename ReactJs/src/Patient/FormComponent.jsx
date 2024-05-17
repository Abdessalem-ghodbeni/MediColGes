import { Button, Card } from "antd";
import React, { useEffect, useState } from "react";
import classes from "./FormComponent.module.css";
import ShowImg from "../Forms/ResponsesModule/ShowImg/ShowImg";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";

const FormComponent = ({ formName, formFields, responses, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState("");

  const handleShowModal = (urlImg) => {
    setIsModalOpen(true);
    setUrl(urlImg);
  };
  const userRole = localStorage.getItem("USER_ROLE");
  console.log(responses);
  useEffect(() => {
    console.log("rrrr", id);
  }, [id]);
  return (
    <div className="row d-flex mt-5">
      <div>
        <h6 className={classes.formName}>
          Réponses aux Différents Champs du Formulaire : {formName}
        </h6>
      </div>
      <ShowImg
        url={url}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
      />

      <div className="row g-4">
        <div className={classes.responseCards}>
          {responses.map((response, index) => (
            <Card key={index} className={classes.responseCard}>
              <img
                src="public/assets/rep.png"
                alt=""
                className="img-fluid w-50 text-center mb-4 mt-0"
              />
              <ul className={classes.responseList}>
                {response?.answers?.map((answer) => (
                  <li key={answer.field} className={classes.responseItem}>
                    <strong className={classes.answerTitle}>
                      {answer.title}:
                    </strong>{" "}
                    {typeof answer.value === "string" && // Check for string type
                      (answer.value.includes(".jpg") ||
                      answer.value.includes(".jpeg") ||
                      answer.value.includes(".png") ||
                      answer.value.includes(".gif") ||
                      answer.value.includes(".bmp") ? ( // Handle images
                        <div className="zoom-effect">
                          <img
                            src={answer.value}
                            className="card-img-top img-fluid mx-3"
                            alt="card image"
                            onMouseEnter={() => handleShowModal(answer.value)}
                            style={{
                              maxHeight: "100px",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      ) : answer.value.includes(".pdf") ||
                        answer.value.includes(".docx") ||
                        answer.value.includes(".pptx") ||
                        answer.value.includes(".gz") ||
                        answer.value.includes(".pptx") ? ( // Handle downloadable files
                        <Button
                          size="small"
                          type="primary"
                          href={answer.value}
                          icon={<DownloadOutlined />}
                        >
                          Télécharger
                        </Button>
                      ) : (
                        <strong className="mx-2">{answer.value}</strong> // Display text
                      ))}
                  </li>
                ))}
              </ul>{" "}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
