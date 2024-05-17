import axios from "axios";
import React, { useEffect, useState } from "react";
import { List, Card, Button, Row, Col, Popconfirm, Tag, Spin } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UnorderedListOutlined,
  SyncOutlined,
  ShareAltOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { ToolOutlined } from "@ant-design/icons";
import classes from "./ListForms.module.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ShareLink from "../SharedLinkForm/ShareLink";
import * as XLSX from "xlsx";
import AffectationFormsInToProjects from "../AffecterFormulaireToProject/AffectationFormsInToProjects";
import { base_url } from "../../baseUrl";
const ListForms = () => {
  const [forms, setForms] = useState([]);
  const [idformulaireToShare, setIdToShare] = useState();
  const [idformulaireToAffecte, setidformulaireToAffecte] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const USER_ROLE = localStorage.getItem("USER_ROLE");
  const [isModalOpenAffecte, setIsModalOpenAffecte] = useState(false);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const accessToken = localStorage.getItem("accessToken");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const userRole = localStorage.getItem("USER_ROLE");
  const userId = localStorage.getItem("USER_ID");
  useEffect(() => {
    setLoading(true);
    if (userRole === "internautes") {
      axios
        .get(`${base_url}/forms/recuperer/formulaire/internaute/${userId}`)
        .then(async (res) => {
          await setForms(res?.data?.formsListe);
          console.log(forms);
        });
    } else if (userRole === "patients") {
      axios
        .get(`${base_url}/forms/recuperer/FormsForUserProject/${userId}`)
        .then(async (res) => {
          await setForms(res?.data?.forms);
          console.log("evolutions", res);
        });
    } else {
      axios.get(`${base_url}/forms/get/all`).then(async (res) => {
        await setForms(res?.data?.formsListe);
        console.log(forms);
      });
      console.log(USER_ROLE);
    }
  }, []);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Définissez une fonction pour ouvrir le modal
  const showModal = (id) => {
    setIsModalVisible(true);
    setIdToShare(id);
  };
  const getFormById = (id) => {
    axios.get(`${base_url}/forms/get/${id}`).then((res) => {
      if (userRole === "internautes") {
        navigate("/internaute/viewOneForm", {
          state: {
            form: res?.data?.formulaire,
          },
        });
      } else if (userRole === "patients") {
        navigate("/patient/viewOneForm", {
          state: {
            form: res?.data?.formulaire,
          },
        });
      } else {
        navigate("/superAdmin/viewOneForm", {
          state: {
            form: res?.data?.formulaire,
          },
        });
      }
    });
  };
  const Affecter = (id) => {
    setIsModalOpenAffecte(true);
    setidformulaireToAffecte(id);
  };
  const EditForm = (id) => {
    axios.get(`${base_url}/forms/get/${id}`).then((res) => {
      navigate("/internaute/AddForm", {
        state: {
          form: res?.data?.formulaire,
        },
      });
    });
  };

  const DeleteForm = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${base_url}/forms/delete/${id}`)
          .then((res) => {
            if (res.status === 200) {
              setForms((prevForms) =>
                prevForms.filter((form) => form._id !== id)
              );
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your file has been deleted.",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      }
    });
  };
  const generateExcelFile = () => {
    const workbook = XLSX.utils.book_new();
    const data = forms.map((form) => {
      const ProjectsTitles = form?.Project?.map((projet) => projet.title).join(
        ", "
      );
      return [
        form.title,
        form.description,
        form.user?.nom + form.user?.prenom,
        new Date(form.createdAt).toLocaleDateString("fr-FR"),
        ProjectsTitles,
      ];
    });
    const worksheet = XLSX.utils.aoa_to_sheet([
      [
        "Name",
        "Description",
        "Createur",
        "Date de création",
        "Projet associéées",
      ],
      ...data,
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fomulaires");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Formulaires.xlsx";
    link.click();
    URL.revokeObjectURL(url);
  };
  const filteredForms = forms.filter((formulaire) => {
    return formulaire.title.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return (
    <>
      {USER_ROLE === "internautes" || USER_ROLE === "superAdmin" ? (
        <div className="container vstack gap-4 mb-5 mt-5">
          <div className="row  ">
            <div className="col-12  col-md-6">
              <h1 className="fs-4 mb-0">
                <UnorderedListOutlined className="mx-3" />
                Liste des formulaires
              </h1>
            </div>
            <div className="col-12 col-md-6 custumer_position">
              <a className="btn btn-primary mb-0" onClick={generateExcelFile}>
                <i className="bi bi-filetype-pdf me-2" />
                Generate Report Projets
              </a>{" "}
            </div>
          </div>

          <div className="row g-4 align-items-center">
            <div className=" col-12">
              <form className="rounded position-relative">
                <input
                  className="form-control bg-transparent w-100"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
                <button
                  className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset"
                  type="submit"
                >
                  <i className="fas fa-search fs-6" />
                </button>
              </form>
            </div>
          </div>
          {forms.length === 0 && (
            <div className="mt-3 alert alert-primary" role="alert">
              Apologies, but there are currently no forms created by you.
            </div>
          )}
          {filteredForms.length === 0 ? (
            <div className="mt-3 alert alert-primary" role="alert">
              No Forms found.
            </div>
          ) : (
            <div className="tab-content mt-4" id="pills-tabContent">
              {/* One way tab START */}
              <div
                className="tab-pane fade show active"
                id="pills-one-way"
                role="tabpanel"
                aria-labelledby="pills-one-way-tab"
              >
                <div className="row g-4 mt-3">
                  {/* Leaving From */}
                  <AffectationFormsInToProjects
                    setIsModalOpenAffecte={setIsModalOpenAffecte}
                    isModalOpenAffecte={isModalOpenAffecte}
                    id={idformulaireToAffecte}
                  />
                  <div className="col-md-6 col-lg-4 position-relative">
                    <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                      <p className="text-center">
                        <strong>Titre</strong>
                      </p>
                    </div>
                    {/* Auto fill button */}
                    <div className="btn-flip-icon mt-3 mt-md-0">
                      <div className="btn btn-white shadow btn-round mb-0">
                        <i className="fa-solid fa-right-left" />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-4 position-relative">
                    <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                      <p className="text-center">
                        {" "}
                        <strong>Description</strong>
                      </p>
                    </div>
                    {/* Auto fill button */}
                    <div className="btn-flip-icon mt-3 mt-md-0">
                      <div className="btn btn-white shadow btn-round mb-0">
                        <i className="fa-solid fa-right-left" />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                      <p className="text-center">
                        {" "}
                        <strong>Actions</strong>{" "}
                      </p>
                    </div>
                  </div>
                </div>
                {forms.length === 0 ? (
                  // <Spin spinning={true} size="large" />
                  <div class="preloader">
                    <div class="preloader-item">
                      <div class="spinner-grow text-primary"></div>
                    </div>
                  </div>
                ) : (
                  filteredForms?.map((form) => (
                    <div className="row g-4 mt-3">
                      {/* Leaving From */}

                      <div
                        className="col-md-6 col-lg-4 position-relative"
                        key={form._id}
                      >
                        <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                          <p>{form.title}</p>
                        </div>
                        {/* Auto fill button */}
                        <div className="btn-flip-icon mt-3 mt-md-0">
                          <div className="btn btn-white shadow btn-round mb-0">
                            <i className="fa-solid fa-right-left" />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4 position-relative">
                        <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                          <p>{form.description}</p>
                        </div>
                        {/* Auto fill button */}
                        <div className="btn-flip-icon mt-3 mt-md-0">
                          <div className="btn btn-white shadow btn-round mb-0">
                            <i className="fa-solid fa-right-left" />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                          <div className="d-flex justify-content-center align-items-center">
                            {USER_ROLE && USER_ROLE === "internautes" && (
                              <>
                                <Button
                                  className="mx-3"
                                  type="primary"
                                  danger
                                  icon={
                                    <DeleteOutlined className="anticon-danger" />
                                  }
                                  size="small"
                                  onClick={() => DeleteForm(form?._id)}
                                ></Button>
                                <Button
                                  className="mx-2"
                                  type="primary"
                                  danger
                                  icon={
                                    <ToolOutlined className="anticon-danger" />
                                  }
                                  size="small"
                                  onClick={() => Affecter(form?._id)}
                                ></Button>
                                <Button
                                  type="button"
                                  className={classes.mauve_icon}
                                  danger
                                  icon={
                                    <EditOutlined
                                      className={classes.whiteColor}
                                    />
                                  }
                                  size="small"
                                  onClick={() => EditForm(form?._id)}
                                ></Button>
                                <Button
                                  type="button"
                                  className={classes.ShareButton}
                                  icon={<ShareAltOutlined />}
                                  size="small"
                                  onClick={() => showModal(form?._id)}
                                  // onClick={showModal}
                                ></Button>
                              </>
                            )}

                            <Button
                              type="primary"
                              // className={classes.ShareButton}
                              className="mx-3"
                              icon={<EyeOutlined />}
                              size="small"
                              onClick={() => getFormById(form?._id)}
                            ></Button>
                            <div>
                              <Tag
                                className="mx-3"
                                // icon={<SyncOutlined spin />}
                                color="processing"
                                size="large"
                              >
                                {form?.responses.length} Reponses
                              </Tag>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <ShareLink
                visible={isModalVisible}
                setVisible={setIsModalVisible}
                id={idformulaireToShare}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="pt-0 mt-5">
            <div className="container vstack gap-4">
              <div className="page-content-wrapper ">
                <div className="row">
                  <div className="col-12 mb-4 mb-sm-5">
                    <p className="text-center">
                      <strong>
                        Cette section présente la liste des formulaire dont vous
                        etes invité a repondre... Votre réponse est trés
                        necessaire pour nous{" "}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="row g-4 align-items-center">
                  <div className=" col-12">
                    <form className="rounded position-relative">
                      <input
                        className="form-control bg-transparent w-100"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={handleInputChange}
                      />
                      <button
                        className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset"
                        type="submit"
                      >
                        <i className="fas fa-search fs-6" />
                      </button>
                    </form>
                  </div>
                </div>
                {forms.length === 0 && (
                  <div className="mt-3 alert alert-primary" role="alert">
                    Apologies, but there are currently no forms created by you.
                  </div>
                )}
                {filteredForms.length === 0 ? (
                  <div className="mt-3 alert alert-primary" role="alert">
                    No Forms found.
                  </div>
                ) : (
                  <div className="tab-content mt-4" id="pills-tabContent">
                    {/* One way tab START */}
                    <div
                      className="tab-pane fade show active"
                      id="pills-one-way"
                      role="tabpanel"
                      aria-labelledby="pills-one-way-tab"
                    >
                      <div className="row g-4 mt-3">
                        {/* Leaving From */}
                        <AffectationFormsInToProjects
                          setIsModalOpenAffecte={setIsModalOpenAffecte}
                          isModalOpenAffecte={isModalOpenAffecte}
                          id={idformulaireToAffecte}
                        />
                        <div className="col-md-6 col-lg-4 position-relative">
                          <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                            <p className="text-center">
                              <strong>Titre</strong>
                            </p>
                          </div>
                          {/* Auto fill button */}
                          <div className="btn-flip-icon mt-3 mt-md-0">
                            <div className="btn btn-white shadow btn-round mb-0">
                              <i className="fa-solid fa-right-left" />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6 col-lg-4 position-relative">
                          <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                            <p className="text-center">
                              {" "}
                              <strong>Description</strong>
                            </p>
                          </div>
                          {/* Auto fill button */}
                          <div className="btn-flip-icon mt-3 mt-md-0">
                            <div className="btn btn-white shadow btn-round mb-0">
                              <i className="fa-solid fa-right-left" />
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                            <p className="text-center">
                              {" "}
                              <strong>Actions</strong>{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                      {forms.length === 0 ? (
                        // <Spin spinning={true} size="large" />
                        <div class="preloader">
                          <div class="preloader-item">
                            <div class="spinner-grow text-primary"></div>
                          </div>
                        </div>
                      ) : (
                        filteredForms?.map((form) => (
                          <div className="row g-4 mt-3">
                            {/* Leaving From */}

                            <div
                              className="col-md-6 col-lg-4 position-relative"
                              key={form._id}
                            >
                              <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                                <p>{form.title}</p>
                              </div>
                              {/* Auto fill button */}
                              <div className="btn-flip-icon mt-3 mt-md-0">
                                <div className="btn btn-white shadow btn-round mb-0">
                                  <i className="fa-solid fa-right-left" />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-6 col-lg-4 position-relative">
                              <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                                <p>{form.description}</p>
                              </div>
                              {/* Auto fill button */}
                              <div className="btn-flip-icon mt-3 mt-md-0">
                                <div className="btn btn-white shadow btn-round mb-0">
                                  <i className="fa-solid fa-right-left" />
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4">
                              <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                                <div className="d-flex justify-content-center align-items-center">
                                  {USER_ROLE && USER_ROLE === "internautes" && (
                                    <>
                                      <Button
                                        className="mx-3"
                                        type="primary"
                                        danger
                                        icon={
                                          <DeleteOutlined className="anticon-danger" />
                                        }
                                        size="small"
                                        onClick={() => DeleteForm(form?._id)}
                                      ></Button>
                                      <Button
                                        className="mx-2"
                                        type="primary"
                                        danger
                                        icon={
                                          <ToolOutlined className="anticon-danger" />
                                        }
                                        size="small"
                                        onClick={() => Affecter(form?._id)}
                                      ></Button>
                                      <Button
                                        type="button"
                                        className={classes.mauve_icon}
                                        danger
                                        icon={
                                          <EditOutlined
                                            className={classes.whiteColor}
                                          />
                                        }
                                        size="small"
                                        onClick={() => EditForm(form?._id)}
                                      ></Button>
                                      <Button
                                        type="button"
                                        className={classes.ShareButton}
                                        icon={<ShareAltOutlined />}
                                        size="small"
                                        onClick={() => showModal(form?._id)}
                                        // onClick={showModal}
                                      ></Button>
                                    </>
                                  )}

                                  <Button
                                    type="primary"
                                    // className={classes.ShareButton}
                                    className="mx-3"
                                    icon={<EyeOutlined />}
                                    size="small"
                                    onClick={() => getFormById(form?._id)}
                                  ></Button>
                                  <div>
                                    <Tag
                                      className="mx-3"
                                      // icon={<SyncOutlined spin />}
                                      color="processing"
                                      size="large"
                                    >
                                      {form?.responses.length} Reponses
                                    </Tag>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <ShareLink
                      visible={isModalVisible}
                      setVisible={setIsModalVisible}
                      id={idformulaireToShare}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
      )}
    </>
  );
};

export default ListForms;
