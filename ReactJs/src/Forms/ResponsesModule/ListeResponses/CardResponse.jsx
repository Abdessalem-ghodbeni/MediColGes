import { Button, Card } from "antd";
import React, { useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import "./ListeResponse.css";
import ShowImg from "../ShowImg/ShowImg";
function CardResponse({ formName, formFields, responses }) {
  console.log("ola", formName);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState("");
  const handleShowModal = (urlImg) => {
    setIsModalOpen(true);
    setUrl(urlImg);
  };
  <ShowImg
    url={url}
    setIsModalOpen={setIsModalOpen}
    isModalOpen={isModalOpen}
  />;
  return (
    <>
      {" "}
      <h6 className="responseTitle mt-5 text-center">
        Réponses aux Différents Champs du Formulaire : {formName}
      </h6>
      <div className="row g-4">
        {responses.map((response, index) => (
          <div className="col-md-6 col-lg-4 col-xxl-3">
            <div className="card border h-100">
              <div className="dropdown position-absolute top-0 end-0 m-3">
                <a
                  href="#"
                  className="btn btn-sm btn-light btn-round small mb-0"
                  role="button"
                  id="dropdownShare1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-three-dots fa-fw" />
                </a>
              </div>
              {/* Card body */}
              <div className="card-body text-center pb-0">
                {/* Avatar Image */}

                <h5 className="mb-1">Lori Stevens</h5>
                <small>
                  <i className="bi bi-geo-alt me-1" />
                  Los Angeles, USA
                </small>
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
                </ul>
              </div>
              {/* card footer */}
              <div className="card-footer d-flex gap-3 align-items-center">
                <a
                  href="admin-agent-detail.html"
                  className="btn btn-sm btn-primary-soft mb-0 w-100"
                >
                  View detail
                </a>
                <a href="#" className="btn btn-sm btn-light flex-shrink-0 mb-0">
                  <i className="bi bi-envelope" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default CardResponse;
