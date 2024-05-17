import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { base_url } from "../baseUrl";
import { format } from "date-fns";

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

function ListPublication() {
  const [publications, setPublications] = useState([]);
  const [myPublications, setMyPublications] = useState([]);

  useEffect(() => {
    fetchPublications();
    fetchMyPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await axios.get(`${base_url}/publication/`);
      setPublications(response.data.data);
    } catch (error) {
      console.error("Error fetching Publications:", error);
    }
  };

  const fetchMyPublications = async () => {
    const userId = localStorage.getItem("USER_ID");
    try {
      const response = await axios.get(
        `${base_url}/publication/getByIdInternaute/${userId}`
      );
      setMyPublications(response.data.data);
    } catch (error) {
      console.error("Error fetching Publications:", error);
    }
  };

  function truncateContent(content, maxLength) {
    // Utiliser une expression régulière pour enlever les balises HTML
    const strippedContent = content.replace(/<[^>]+>/g, "");
    if (strippedContent.length <= maxLength) {
      return strippedContent;
    }
    return strippedContent.substr(0, maxLength) + "...";
  }

  const deletePublication = async (id) => {
    try {
      await axios.delete(`${base_url}/publication/delete/${id}`);

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Publication delete with success.",
      });

      fetchPublications();
      fetchMyPublications();
    } catch (error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "An error has occurred.",
      });

      console.error("Error deleted Publication:", error);
    }
  };

  return (
    <>
      <section className="pt-0">
        <div className="container vstack gap-4">
          {/* Title START */}
          <div className="row">
            <div className="col-12">
              <h1 className="fs-4 mb-0">
                <i className="bi bi-card-heading fa-fw me-1" />
                Publications
              </h1>
            </div>
          </div>
          {/* Title END */}
          {/* Review START */}
          <div className="row">
            <div className="col-12">
              <div className="card border rounded-3">
                {/* Card header START */}
                <div className="card-header border-bottom">
                  <div className="d-sm-flex align-items-center">
                    <h5 className="card-header-title">Publications List</h5>
                    <Link
                      to="/internaute/addPublication"
                      className="btn btn-sm btn-primary-soft mb-0 ms-auto flex-shrink-0"
                    >
                      <i className="bi bi-plus-lg fa-fw me-2" />
                      Add Publication
                    </Link>
                  </div>
                </div>
                {/* Card header END */}
                <div className="card-body p-0">
                  {/* Tabs */}
                  <ul className="nav nav-tabs nav-bottom-line nav-responsive nav-justified">
                    <li className="nav-item">
                      <a
                        className="nav-link mb-0 active"
                        data-bs-toggle="tab"
                        href="#tab-1"
                      >
                        The Whole List
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link mb-0"
                        data-bs-toggle="tab"
                        href="#tab-2"
                      >
                        My List
                      </a>
                    </li>
                  </ul>
                  {/* Tabs content START */}
                  <div className="tab-content p-2 p-sm-4" id="nav-tabContent">
                    {/* Tab content item START */}
                    <div className="tab-pane fade show active" id="tab-1">
                      <div className="card-body">
                        {/* Review item START */}
                        {publications.length === 0 ? (
                          <div
                            className="mt-3 alert alert-primary"
                            role="alert"
                          >
                            No publications found.
                          </div>
                        ) : (
                          publications.map((publication) => (
                            <div key={publication._id}>
                              <div className="bg-light rounded p-3">
                                {/* Review item START */}
                                <div className="d-sm-flex justify-content-between">
                                  {/* Avatar image */}
                                  <div className="d-sm-flex align-items-center mb-3">
                                    <img
                                      className="avatar avatar-md rounded-circle float-start me-3"
                                      src={publication.internaute.image}
                                      alt="avatar"
                                    />
                                    {/* Title */}
                                    <div>
                                      <h6 className="m-0">
                                        {publication.internaute.prenom}{" "}
                                        {publication.internaute.nom}
                                      </h6>
                                      <span className="me-3 small">
                                        {format(
                                          new Date(publication.createdAt),
                                          "dd MMM yyyy à HH:mm"
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {/* Content */}
                                <h6 className="fw-normal">
                                  <span className="text-body">Title: </span>
                                  {publication.titre}
                                </h6>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: truncateContent(
                                      publication.contenu,
                                      300
                                    ),
                                  }}
                                />
                                {/* Buttons */}
                                <div className="d-flex justify-content-between align-items-center">
                                  <a />
                                  <Link
                                    to={`/internaute/detailPublication/${publication._id}`}
                                    className="btn btn-sm btn-primary-soft mb-0"
                                  >
                                    {" "}
                                    <i className="bi bi-eye-fill me-1" />
                                    Read more{" "}
                                  </Link>
                                </div>
                                {/* Review item END */}
                              </div>
                              <hr />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    {/* Tabs content item END */}
                    {/* Tab content item START */}
                    <div className="tab-pane fade" id="tab-2">
                      <div className="card-body">
                        {/* Review item START */}
                        {myPublications.length === 0 ? (
                          <div
                            className="mt-3 alert alert-primary"
                            role="alert"
                          >
                            No publications found.
                          </div>
                        ) : (
                          myPublications.map((publication) => (
                            <div key={publication._id}>
                              <div className="bg-light rounded p-3">
                                {/* Review item START */}
                                <div className="d-sm-flex justify-content-between">
                                  {/* Avatar image */}
                                  <div className="d-sm-flex align-items-center mb-3">
                                    <img
                                      className="avatar avatar-md rounded-circle float-start me-3"
                                      src={publication.internaute.image}
                                      alt="avatar"
                                    />
                                    {/* Title */}
                                    <div>
                                      <h6 className="m-0">
                                        {publication.internaute.prenom}{" "}
                                        {publication.internaute.nom}
                                      </h6>
                                      <span className="me-3 small">
                                        {format(
                                          new Date(publication.createdAt),
                                          "dd MMM yyyy à HH:mm"
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {/* Content */}
                                <h6 className="fw-normal">
                                  <span className="text-body">Title: </span>
                                  {publication.titre}
                                </h6>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: truncateContent(
                                      publication.contenu,
                                      300
                                    ),
                                  }}
                                />
                                {/* Buttons */}
                                <div className="d-flex justify-content-between align-items-center">
                                  <a />
                                  <div>
                                    <Link
                                      to={`/internaute/detailPublication/${publication._id}`}
                                      className="btn btn-sm btn-primary-soft mb-0 me-2"
                                    >
                                      {" "}
                                      <i className="bi bi-eye-fill me-1" />
                                      Read more{" "}
                                    </Link>
                                    <Link
                                      to={`/internaute/editPublication/${publication._id}`}
                                      className="btn btn-sm btn-info-soft mb-0 me-2"
                                    >
                                      {" "}
                                      <i className="bi bi-pencil-square me-1" />
                                      Edit{" "}
                                    </Link>
                                    <button
                                      className="btn btn-sm btn-danger-soft mb-0"
                                      onClick={() =>
                                        deletePublication(publication._id)
                                      }
                                    >
                                      <i className="bi bi-trash-fill" />
                                    </button>
                                  </div>
                                </div>
                                {/* Review item END */}
                              </div>
                              <hr />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    {/* Tabs content item END */}
                  </div>
                </div>

                {/* Card body START */}

                {/* Card body END */}
              </div>
            </div>
          </div>
          {/* Review END */}
        </div>
      </section>
    </>
  );
}

export default ListPublication;
