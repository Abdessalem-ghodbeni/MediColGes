import axios from "axios";
import React, { useEffect, useState } from "react";

import {
  DeleteOutlined,
  EditOutlined,
  UnorderedListOutlined,
  SyncOutlined,
  ShareAltOutlined,
  EyeOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { Button, Tag } from "antd";
import classes from "../Forms/ListeDesProjets/ListProjects.module.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { base_url } from "../baseUrl";
import DetailsProjet from "../Forms/DetailsProjet/DetailsProjet";
// import { base_url } from "./../baseUrl";
function ListePatientParticipations() {
  const [listeProjets, setListeProjets] = useState([]);
  const navigate = useNavigate();
  const [detailProjet, setDetailProjet] = useState({});
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const USER_ROLE = localStorage.getItem("USER_ROLE");
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const accessToken = localStorage.getItem("accessToken");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const userId = localStorage.getItem("USER_ID");
  useEffect(() => {
    axios
      .get(`${base_url}/project/get/all/projets/by/user/${userId}`)
      .then((response) => {
        console.log(response.data.projects);
        setListeProjets(response.data.projects);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);
  const DeleteProjet = (id) => {
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
          .delete(`${base_url}/project/delete/${id}`)
          .then((res) => {
            if (res.status === 200) {
              setListeProjets((prevListesProjets) =>
                prevListesProjets.filter((projet) => projet._id !== id)
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

  const getProjetById = async (id) => {
    try {
      const res = await axios.get(`${base_url}/project/retrieve/${id}`);
      setDetailProjet(res.data);
      setOpen(true);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while updating.",
      });
    }
  };

  useEffect(() => {
    if (detailProjet) {
      setDetailProjet(detailProjet);
      console.log("cc", detailProjet);
    }
  }, [detailProjet]);

  const generateExcelFile = () => {
    const workbook = XLSX.utils.book_new();
    const data = listeProjets.map((projet) => {
      const formsTitles = projet.forms.map((form) => form.title).join(", ");
      const collaborateurs = projet.membresCollaborateur
        .map((collaborateur) => `${collaborateur.nom} ${collaborateur.prenom}`)
        .join(", ");
      return [
        projet.name,
        projet.domaine,
        projet.description,
        projet.lieu,
        projet.objectif,
        new Date(projet.startDate).toLocaleDateString("fr-FR"),
        new Date(projet.endDate).toLocaleDateString("fr-FR"),
        projet.user.nom,
        formsTitles,
        new Date(projet.createdAt).toLocaleDateString("fr-FR"),
        projet.sujet,
        collaborateurs,
      ];
    });
    const worksheet = XLSX.utils.aoa_to_sheet([
      [
        "Name",
        "Domaine",
        "Description",
        "Lieu",
        "Objectif",
        "Date début",
        "Date fin",
        "Créateur",
        "Titres des formulaires",
        "Date de création",
        "Sujet",
        "Membres collaborateurs",
      ],
      ...data,
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projets");
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
    link.download = "projets.xlsx";
    link.click();
    URL.revokeObjectURL(url);
  };
  //   const filteredProjects = listeProjets.filter((project) => {
  //     return project.name.toLowerCase().includes(searchTerm.toLowerCase());
  //   });
  const filteredProjects =
    listeProjets.length > 0
      ? listeProjets.filter((project) => {
          return project.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
      : [];

  return (
    <>
      <div className="pt-0">
        <div className="container vstack gap-4">
          <div className="page-content-wrapper ">
            {/* Title */}
            <div className="row">
              <div className="col-12 mb-4 mb-sm-5">
                <div className="d-sm-flex justify-content-between align-items-center">
                  <h1 className="h3 mb-3 mb-sm-0 d-sm-flex justify-content-between align-items-center">
                    {" "}
                    <UnorderedListOutlined className="mx-3" />
                    Liste des Projets{" "}
                  </h1>
                  <div className="d-grid">
                    <a
                      className="btn btn-primary mb-0"
                      onClick={generateExcelFile}
                    >
                      <i className="bi bi-filetype-pdf me-2" />
                      Generate Report Projets
                    </a>{" "}
                  </div>
                </div>
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
            {filteredProjects.length === 0 ? (
              <div className="mt-3 alert alert-primary" role="alert">
                No Projet found.
              </div>
            ) : (
              <div className="card shadow mt-5">
                <div className="card-body">
                  <div className="bg-light rounded p-3 d-none d-lg-block">
                    <div className="row row-cols-7 g-4">
                      <div className="col">
                        <h6 className="mb-0">Name</h6>
                      </div>
                      <div className="col">
                        <h6 className="mb-0">domaine</h6>
                      </div>
                      <div className="col">
                        <h6 className="mb-0">description</h6>
                      </div>
                      <div className="col">
                        <h6 className="mb-0">lieux</h6>
                      </div>
                      <div className="col">
                        <h6 className="mb-0">objectif</h6>
                      </div>
                      <div className="col">
                        <h6 className="mb-0">date début</h6>
                      </div>
                      <div className="col">
                        <h6 className="mb-0">date fin</h6>
                      </div>
                      <div className="col">
                        <h6 className="mb-0">Actions</h6>
                      </div>
                    </div>
                  </div>

                  {filteredProjects.map((projet) => (
                    <div className="row row-cols-xl-7 align-items-lg-center border-bottom g-4 px-2 py-4">
                      <div className="col">
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-xs flex-shrink-0">
                            <ProjectOutlined />
                          </div>

                          <div className="ms-2">
                            <h6 className="mb-0 fw-light">{projet.name}</h6>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <p className="mb-0 fw-normal"> {projet.domaine}</p>
                      </div>
                      <div className="col">
                        <p className="mb-0 fw-normal"> {projet.description}</p>
                      </div>
                      {/* Data item */}
                      <div className="col">
                        <p className="mb-0 fw-normal"> {projet.lieu}</p>
                      </div>
                      {/* Data item */}
                      <div className="col">
                        <p className="mb-0 fw-normal"> {projet.objectif}</p>
                      </div>
                      {/* Data item */}
                      <div className="col">
                        <p className="mb-0 fw-normal">
                          {" "}
                          {new Date(projet.startDate).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                      {/* Data item */}
                      <div className="col">
                        <p className="mb-0 fw-normal">
                          {" "}
                          {new Date(projet.endDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      {/* Data item */}
                      <div className="col">
                        <div className={classes.flexR}>
                          {USER_ROLE && USER_ROLE === "internautes" && (
                            <>
                              <Button
                                className="mx-1"
                                type="primary"
                                danger
                                icon={
                                  <DeleteOutlined className="anticon-danger" />
                                }
                                size="small"
                                onClick={() => DeleteProjet(projet?._id)}
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
                                //   onClick={() => EditForm(form?._id)}
                              ></Button>

                              <Button
                                type="button"
                                className={classes.ShareButton}
                                icon={<ShareAltOutlined />}
                                size="small"
                                //   onClick={() => showModal(form?._id)}
                                // onClick={showModal}
                              ></Button>
                            </>
                          )}

                          <Button
                            type="primary"
                            // className={classes.ShareButton}
                            className="mx-auto"
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => getProjetById(projet?._id)}
                          ></Button>
                          <DetailsProjet
                            open={open}
                            setOpen={setOpen}
                            detailProjet={detailProjet}
                          />
                          <div>
                            {/* <Tag
                          className="mx-3"
                          // icon={<SyncOutlined spin />}
                          color="processing"
                          size="large"
                        >
                          En cours
                        </Tag> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Card body END */}
                {/* Card footer START */}
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ListePatientParticipations;
