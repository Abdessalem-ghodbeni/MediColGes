import React, { useEffect, useState } from "react";
import { base_url } from "../../../baseUrl";
import axios from "axios";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import "./ListeResponse.css";
import ShowImg from "../ShowImg/ShowImg";
import CardResponse from "./CardResponse";
import ResponsePatient from "../../../Patient/ResponsePatient";
import FormComponent from "../../../Patient/FormComponent";
function ResponseListe() {
  const [ListeResponse, setListeResponse] = useState([]);
  const [detailsFiled, setDetailsFiled] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState("");
  const handleShowModal = (urlImg) => {
    setIsModalOpen(true);
    setUrl(urlImg);
  };

  const handleCloseModal = () => {};
  useEffect(() => {
    axios

      // .get(`${base_url}/response/rep/by/user/${userId}`, axiosConfig)
      .get(`${base_url}/response/responseListe`)
      .then(async (response) => {
        console.log("azazazaza", response);
        const listeResponse = response.data.responseListe;
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
        await setListeResponse(groupedResponses);
        console.log("hellooo", ListeResponse);
      })
      .catch((error) => {
        alert(error);
      });
  }, [ListeResponse]);

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
  // useEffect(() => {
  //   axios
  //     .get(`${base_url}/response/responseListe`)
  //     .then(async (response) => {
  //       const listeResponse = response.data.responseListe;
  //       const updatedListeResponse = await Promise.all(
  //         listeResponse.map(async (responseItem) => {
  //           const updatedAnswers = await Promise.all(
  //             responseItem.answers.map(async (answer) => {
  //               try {
  //                 const fieldDetails = await axios.get(
  //                   `${base_url}/response/get/formfiled/${answer.field}`
  //                 );
  //                 const fieldTitle = fieldDetails.data.inputDetails.label;
  //                 // console.log(fieldDetails.data);
  //                 return { ...answer, title: fieldTitle };
  //               } catch (error) {
  //                 console.error(
  //                   `Error fetching field details for field ID ${answer.field}:`,
  //                   error
  //                 );

  //                 return answer;
  //               }
  //             })
  //           );
  //           return { ...responseItem, answers: updatedAnswers };
  //         })
  //       );
  //       setListeResponse(updatedListeResponse);
  //       console.log("merci", ListeResponse);
  //     })
  //     .catch((error) => {
  //       alert(error);
  //     });
  // }, [ListeResponse]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredResponse = ListeResponse.filter((rep) => {
    return rep.formName.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <div className="container vstack gap-4 mb-5">
        <div className="">
          <div className=" ">
            <div className=" ">
              <div className=" ">
                <div className="row">
                  <div className="col-12 mb-4 mb-sm-5">
                    <div className="d-sm-flex justify-content-between align-items-center">
                      <h1 className="h3 mb-3 mb-sm-0"> List Responses</h1>
                      <div className="d-grid">
                        <a href="#" className="btn btn-primary mb-0">
                          <i className="bi bi-filetype-pdf me-2" />
                          Generate Report
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Search and select START */}
                <div className="row g-3 align-items-center justify-content-between mb-5">
                  {/* Search */}
                  <div className="col-md-12">
                    <form className="rounded position-relative">
                      <input
                        value={searchTerm}
                        onChange={handleInputChange}
                        className="form-control   w-100"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                      />
                      <button
                        className="btn border-0 px-3 py-0 position-absolute top-50 end-0 translate-middle-y"
                        type="submit"
                      >
                        <i className="fas fa-search fs-6" />
                      </button>
                    </form>
                  </div>
                </div>
                {ListeResponse.length === 0 && (
                  <div className="mt-3 alert alert-primary" role="alert">
                    Apologies, but there are currently no Response .....
                  </div>
                )}
                {filteredResponse.length === 0 ? (
                  <div className="mt-3 alert alert-primary" role="alert">
                    No Response Found ...
                  </div>
                ) : (
                  <div>
                    <div className="row">
                      {filteredResponse.map((group) => (
                        // <CardResponse
                        //   key={group.formId}
                        //   formId={group.formId}
                        //   formName={group.formName}
                        //   formFields={group.formFields}
                        //   responses={group.responses}
                        // />
                        <FormComponent
                          key={group.formId}
                          formId={group.formId}
                          formName={group.formName}
                          formFields={group.formFields}
                          responses={group.responses}
                        />
                      ))}
                    </div>

                    <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4">
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResponseListe;
