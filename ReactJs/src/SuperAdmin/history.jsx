import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistorys();
  }, []);

  const fetchHistorys = async () => {
    try {
      const response = await axios.get(`${base_url}/history/`);
      setHistory(
        response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (error) {
      console.error("Error fetching History:", error);
    }
  };

  function truncateContent(details) {
    // Utiliser une expression régulière pour enlever les balises HTML
    const strippedContent = details.replace(/<[^>]+>/g, "");
    return strippedContent;
  }

  return (
    <>
      <div className="page-content-wrapper p-xxl-4">
        {/* Title */}
        <div className="row">
          <div className="col-12 mb-4 mb-sm-5">
            <div className="d-sm-flex justify-content-between align-items-center">
              <h1 className="h3 mb-3 mb-sm-0">
                <i className="bi bi-collection fa-fw me-1"></i>Historical List
              </h1>
            </div>
          </div>
        </div>
        {/* Guest list START */}
        <div className="card shadow mt-2">
          {/* Card body START */}
          <div className="card-body text-center">
            {/* Table head */}
            <div className="bg-light rounded p-3 d-none d-lg-block">
              <div className="row row-cols-7 g-4">
                <div className="col">
                  <h6 className="mb-0">User</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Action Type</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Date & Time</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Details</h6>
                </div>
              </div>
            </div>
            {/* Table data */}
            {history.length === 0 ? (
              <div className="mt-3 alert alert-primary" role="alert">
                No History found.
              </div>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  className="row row-cols-xl-7 align-items-lg-center border-bottom g-4 px-2 py-4"
                >
                  {/* Data item */}
                  <div className="col">
                    <small className="d-block d-lg-none">User:</small>
                    <div className="d-flex align-items-center">
                      {/* Avatar */}
                      <div className="avatar avatar-xs flex-shrink-0">
                        <img
                          className="avatar-img rounded-circle"
                          src={item.user.image}
                          alt="avatar"
                        />
                      </div>
                      {/* Info */}
                      <div className="ms-2">
                        <h6 className="mb-0 fw-light">
                          {item.user.prenom} {item.user.nom}
                        </h6>
                      </div>
                    </div>
                  </div>
                  {/* Data item */}
                  <div className="col">
                  <small className="d-block d-lg-none">Action Type:</small>
                    {item.actionType === "Create" && (
                      <div className="badge bg-primary bg-opacity-25 text-primary">
                        Create
                      </div>
                    )}
                    {item.actionType === "Update" && (
                      <div className="badge bg-secondary bg-opacity-25 text-secondary">
                        Update
                      </div>
                    )}
                    {item.actionType === "Delete" && (
                      <div className="badge bg-danger bg-opacity-25 text-danger">
                        Delete
                      </div>
                    )}
                  </div>
                  {/* Data item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Date & Time:</small>
                    <h6 className="mb-0 fw-normal">
                      {item.createdAt &&
                      !isNaN(new Date(item.createdAt).getTime())
                        ? format(
                            new Date(item.createdAt),
                            "yyyy-MM-dd à HH:mm:ss"
                          )
                        : ""}
                    </h6>
                  </div>
                  {/* Data item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Details:</small>
                    <h6 className="mb-0 fw-normal">{truncateContent(item.details)}</h6>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Card body END */}
        </div>
        {/* Guest list END */}
      </div>
    </>
  );
}

export default History;
