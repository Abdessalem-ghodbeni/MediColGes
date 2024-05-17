import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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

function ProfileInternaute() {
  const updateProfile = JSON.parse(localStorage.getItem("updateProfile"));

  const [user, setUser] = useState({});
  const [licenceProfessionnelleImageUrl, setLicenceProfessionnelleImageUrl] = useState('');

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
          `${base_url}/internaute/getById/${userId}`
        );
        setUser({
          ...response.data.data,
        });

        const imagePdfUrl = response.data.data.licenceProfessionnelle.replace('.pdf', '.jpg');
        setLicenceProfessionnelleImageUrl(imagePdfUrl);

      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  

  return (
    <>
      <section className="pt-0">
        <div className="container vstack gap-4">
          {/* Title START */}
          <div className="row">
            <div className="col-12">
              <h1 className="fs-4 mb-0">
                <i className="bi bi-person-workspace fa-fw me-1" />
                Profile
              </h1>
            </div>
          </div>
          {/* Title END */}

          {/* Verified message */}
          {!updateProfile && (
            <div className="bg-light rounded p-3">
              {/* Progress bar */}
              <div className="overflow-hidden">
                <h6>Complete Your Profile</h6>
                <div className="progress progress-sm bg-success bg-opacity-10">
                  <div
                    className="progress-bar bg-success aos"
                    role="progressbar"
                    data-aos="slide-right"
                    data-aos-delay={200}
                    data-aos-duration={1000}
                    data-aos-easing="ease-in-out"
                    style={{ width: "75%" }}
                    aria-valuenow={75}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span className="progress-percent-simple h6 fw-light ms-auto">
                      75%
                    </span>
                  </div>
                </div>
                <p className="mb-0">
                  Get the most out of access to all the platform's features by
                  adding the remaining details!
                </p>
              </div>
              {/* Content */}
              <div className="bg-body rounded p-3 mt-3">
                <ul className="list-inline hstack flex-wrap gap-2 justify-content-between mb-0">
                  <li className="list-inline-item h6 fw-normal mb-0">
                    <a>
                      <i className="bi bi-check-circle-fill text-success me-2" />
                      Verified Email
                    </a>
                  </li>
                  <li className="list-inline-item h6 fw-normal mb-0">
                    <a>
                      <i className="bi bi-check-circle-fill text-success me-2" />
                      The account has been confirmed by the administrator
                    </a>
                  </li>
                  <li className="list-inline-item h6 fw-normal mb-0">
                    <Link to="/internaute/editProfile" className="text-primary">
                      <i className="bi bi-plus-circle-fill me-2" />
                      Complete Basic Info
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tabs Content START */}
          <div className="row g-4">
            <div className="col-12">
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
                        to="/internaute/editProfile"
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
                      <i className="bi bi-file-medical-fill" />
                    </div>
                    <div className="ms-2">
                      <small>Speciality</small>
                      <h6 className="fw-normal small mb-0">
                        <a>{user.specialite}</a>
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
                      <h6 className="fw-normal small mb-0">{formattedDate}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Tabs Content END */}
        </div>
      </section>
      <section className="pt-0">
        <div className="container vstack gap-4">
          {/* Tabs Content START */}
          <div className="row g-4">
            <div className="col-12">
              <div className="card bg-light">
                {/* Card body */}
                <div className="card-body text-center">
                  {/* Title */}
                  <h5 className="mb-2"><i className="bi bi-file-earmark-medical-fill fa-fw me-1" />Professional license</h5>
                </div>
                {/* Card footer */}
                <div className="card-footer text-center bg-light border-top">
                <img
                  src={licenceProfessionnelleImageUrl}
                  alt="Professional License"
                  style={{ width: "75%", height: "auto" }}
                />
                </div>
              </div>
            </div>
          </div>
          {/* Tabs Content END */}
        </div>
      </section>
    </>
  );
}

export default ProfileInternaute;
