import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { base_url } from "../baseUrl";

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

function ProfileSuperAdmin() {
  const [user, setUser] = useState({});

  const userJson = JSON.parse(localStorage.getItem("USER"));
  const formattedDate = format(
    new Date(userJson.data.data.createdAt),
    "dd MMM yyyy à HH:mm"
  );

  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${base_url}/superAdmin/getById/${userId}`
        );
        setUser({
          ...response.data.data,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  return (
    <>
      <div className="page-content-wrapper p-xxl-4">
        {/* Title */}
        <div className="row">
          <div className="col-12 mb-4 mb-sm-5">
            <h1 className="h3 mb-0"><i className="bi bi-person-workspace fa-fw me-1"></i>Profile</h1>
          </div>
        </div>
        <div className="row g-4 mb-5">
          {/* Agent info START */}
          <div className="col-md-12 col-xxl-12">
            <div className="card bg-light">
              {/* Dropdown button */}
              <div className="dropdown position-absolute top-0 end-0 m-3">
                <a
                  className="btn btn-sm btn-white btn-round lh-lg mb-0"
                  role="button"
                  id="dropdownShare1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-three-dots fa-fw" />
                </a>
                {/* dropdown button */}
                <ul
                  className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded"
                  aria-labelledby="dropdownShare1"
                >
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/superAdmin/editProfile"
                    >
                      <i className="bi bi-pencil-square fa-fw me-2" />
                      Edit
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Card body */}
              <div className="card-body text-center">
                {/* Avatar Image */}
                <div className="avatar avatar-xl flex-shrink-0 mb-3">
                  <img
                    className="avatar-img rounded-circle"
                    src={user.image}
                    alt="avatar"
                  />
                </div>
                {/* Title */}
                <h5 className="mb-2">
                  {user.prenom} {user.nom}
                </h5>
              </div>
              {/* Card footer */}
              <div className="card-footer bg-light border-top">
                <h6 className="mb-3">Personal Information</h6>
                {/* Email id */}
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-md bg-mode h6 mb-0 rounded-circle flex-shrink-0">
                    <i className="bi bi-envelope-fill" />
                  </div>
                  <div className="ms-2">
                    <small>Email address</small>
                    <h6 className="fw-normal small mb-0">
                      <a>{user.email}</a>
                    </h6>
                  </div>
                </div>
                {/* Phone */}
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-md bg-mode h6 mb-0 rounded-circle flex-shrink-0">
                    <i className="bi bi-telephone-fill" />
                  </div>
                  <div className="ms-2">
                    <small>Phone number</small>
                    <h6 className="fw-normal small mb-0">
                      <a>{user.telephone}</a>
                    </h6>
                  </div>
                </div>
                {/* Phone */}
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-md bg-mode h6 mb-0 rounded-circle flex-shrink-0">
                    <i className="bi bi-calendar-plus-fill" />
                  </div>
                  <div className="ms-2">
                    <small>Joining Date</small>
                    <h6 className="fw-normal small mb-0">
                      {formattedDate}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row END */}
      </div>
    </>
  );
}

export default ProfileSuperAdmin;
