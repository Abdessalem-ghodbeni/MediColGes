import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { base_url } from "../baseUrl";
import Modal from "react-bootstrap/Modal";

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

function ListInternaute() {
  const [internaute, setInternaute] = useState([]);
  const [internauteCount, setInternauteCount] = useState(0);
  const [notVerifiedInternautes, setNotVerifiedInternautes] = useState([]);
  const [notVerifiedInternautesCount, setNotVerifiedInternautesCount] = useState(0);
  const [notConfirmedInternautes, setNotConfirmedInternautes] = useState([]);
  const [notConfirmedInternautesCount, setNotConfirmedInternautesCount] = useState(0);
  const [blockedInternautes, setBlockedInternautes] = useState([]);
  const [blockedInternautesCount, setBlockedInternautesCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInternaute, setFilteredInternaute] = useState([]);

  const [currentInternaute, setCurrentInternaute] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = (internaute) => {
    setCurrentInternaute(internaute); // Stocke les informations de l'internaute sélectionné
    setShowModal(true);
  };

  const [licenceProfessionnelleImageUrl, setLicenceProfessionnelleImageUrl] =
    useState("");
  const [showModalLicenceProfessionnelle, setShowModalLicenceProfessionnelle] =
    useState(false);
  const handleCloseLicenceProfessionnelle = () =>
    setShowModalLicenceProfessionnelle(false);
  const handleShowLicenceProfessionnelle = (internaute) => {
    const imagePdfUrl = internaute.licenceProfessionnelle.replace(
      ".pdf",
      ".jpg"
    );
    setLicenceProfessionnelleImageUrl(imagePdfUrl);

    setCurrentInternaute(internaute); // Stocke les informations de l'internaute sélectionné
    setShowModalLicenceProfessionnelle(true);
  };

  useEffect(() => {
    fetchInternautes();
    fetchAllNotVerifiedInternautes();
    fetchAllNotConfirmedInternautes();
    fetchAllBlockedInternautes();
  }, []);

  const fetchInternautes = async () => {
    try {
      const response = await axios.get(`${base_url}/internaute/`);
      setInternaute(response.data.data);
      setInternauteCount(response.data.data.length);
    } catch (error) {
      console.error("Error fetching Internautes:", error);
    }
  };

  const fetchAllNotVerifiedInternautes = async () => {
    try {
      const response = await axios.get(`${base_url}/internaute/getAllNotVerified`);
      setNotVerifiedInternautes(response.data.data);
      setNotVerifiedInternautesCount(response.data.data.length);
      fetchAllNotVerifiedInternautes();
    } catch (error) {
      console.error("Error fetching Patients:", error);
    }
  };

  const fetchAllNotConfirmedInternautes = async () => {
    try {
      const response = await axios.get(`${base_url}/internaute/getAllNotConfirmed`);
      setNotConfirmedInternautes(response.data.data);
      setNotConfirmedInternautesCount(response.data.data.length);
      fetchAllNotConfirmedInternautes();
    } catch (error) {
      console.error("Error fetching Patients:", error);
    }
  };

  const fetchAllBlockedInternautes = async () => {
    try {
      const response = await axios.get(`${base_url}/internaute/getAllBlocked`);
      setBlockedInternautes(response.data.data);
      setBlockedInternautesCount(response.data.data.length);
      fetchAllBlockedInternautes();
    } catch (error) {
      console.error("Error fetching Patients:", error);
    }
  };

  const confirmedInternaute = async (id) => {
    try {
      await axios.put(`${base_url}/internaute/confirm/${id}`);

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
        title: "The internaute has been confirmed.",
      });

      fetchInternautes();
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

      console.error("Error confermed internaute:", error);
    }
  };

  const unblockedInternaute = async (id) => {
    try {
      await axios.put(`${base_url}/internaute/unblocked/${id}`);

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
        title: "The internaute has been unblocked.",
      });

      fetchInternautes();
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

      console.error("Error unblocked internaute:", error);
    }
  };

  const blockedInternaute = async (id) => {
    try {
      await axios.put(`${base_url}/internaute/blocked/${id}`);

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
        title: "The internaute has been blocked.",
      });

      fetchInternautes();
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

      console.error("Error blocked internaute:", error);
    }
  };

  useEffect(() => {
    const results = internaute.filter((internaute) => {
      const fullName = `${internaute.prenom} ${internaute.nom}`.toLowerCase();
      return (
        internaute.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internaute.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fullName.includes(searchTerm.toLowerCase()) ||
        internaute.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredInternaute(results);
  }, [searchTerm, internaute]);

  return (
    <>
      <div className="page-content-wrapper p-xxl-4">
        {/* Title */}
        <div className="row">
          <div className="col-12 mb-4 mb-sm-5">
            <div className="d-sm-flex justify-content-between align-items-center">
              <h1 className="h3 mb-3 mb-sm-0">
                <i className="bi bi-card-list fa-fw me-1"></i>Health
                Professionals List
              </h1>
            </div>
          </div>
        </div>
        {/* Counter boxes START */}
        <div className="row g-4 mb-5">
          {/* Counter item */}
          <div className="col-md-6 col-xxl-3">
            <div className="card card-body bg-warning bg-opacity-10 border border-warning border-opacity-25 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center">
                {/* Digit */}
                <div>
                  <h4 className="mb-0">{internauteCount}</h4>
                  <span className="h6 fw-light mb-0">
                    Total Health Professionals
                  </span>
                </div>
                {/* Icon */}
                <div className="icon-lg rounded-circle bg-warning text-white mb-0">
                  <i className="bi bi-people-fill fa-fw" />
                </div>
              </div>
            </div>
          </div>
          {/* Counter item */}
          <div className="col-md-6 col-xxl-3">
            <div className="card card-body bg-success bg-opacity-10 border border-success border-opacity-25 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center">
                {/* Digit */}
                <div>
                  <h4 className="mb-0">{notVerifiedInternautesCount}</h4>
                  <span className="h6 fw-light mb-0">
                    Not Verified Email Address
                  </span>
                </div>
                {/* Icon */}
                <div className="icon-lg rounded-circle bg-success text-white mb-0">
                  <i className="bi bi-envelope-exclamation-fill fa-fw" />
                </div>
              </div>
            </div>
          </div>
          {/* Counter item */}
          <div className="col-md-6 col-xxl-3">
            <div className="card card-body bg-primary bg-opacity-10 border border-primary border-opacity-25 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center">
                {/* Digit */}
                <div>
                  <h4 className="mb-0">{notConfirmedInternautesCount}</h4>
                  <span className="h6 fw-light mb-0">Unconfirmed Accounts</span>
                </div>
                {/* Icon */}
                <div className="icon-lg rounded-circle bg-primary text-white mb-0">
                  <i className="bi bi-person-fill-exclamation fa-fw" />
                </div>
              </div>
            </div>
          </div>
          {/* Counter item */}
          <div className="col-md-6 col-xxl-3">
            <div className="card card-body bg-info bg-opacity-10 border border-info border-opacity-25 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center">
                {/* Digit */}
                <div>
                  <h4 className="mb-0">{blockedInternautesCount}</h4>
                  <span className="h6 fw-light mb-0">Blocked Accounts</span>
                </div>
                {/* Icon */}
                <div className="icon-lg rounded-circle bg-info text-white mb-0">
                  <i className="bi bi-person-fill-lock fa-fw" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Counter boxes END */}
        {/* Search and select START */}
        <div className="row g-3 align-items-center justify-content-between mb-5">
          {/* Search */}
          <div className="col-md-12">
            <form
              className="rounded position-relative"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="form-control pe-5"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="btn border-0 px-3 py-0 position-absolute top-50 end-0 translate-middle-y">
                <i className="fas fa-search fs-6" />
              </span>
            </form>
          </div>
        </div>
        {/* Search and select END */}
        {/* agent list START */}
        <div className="row g-4">
          {/* Card item */}
          <div className="row g-4">
            {filteredInternaute.length === 0 ? (
              <div className="mt-3 alert alert-primary" role="alert">
                No internautes found.
              </div>
            ) : (
              filteredInternaute.map((item, index) => (
                <div key={index} className="col-md-6 col-lg-4 col-xxl-4">
                  <div className="card border h-100">
                    {/* Card body */}
                    <div className="card-body text-center pb-0">
                      {/* Avatar Image */}
                      <div className="avatar avatar-xl flex-shrink-0 mb-3">
                        <img
                          className="avatar-img rounded-circle"
                          src={item.image}
                          alt="avatar"
                        />
                      </div>
                      {/* Title */}
                      <h5 className="mb-1">
                        {item.prenom} {item.nom}
                      </h5>
                      <small>
                        <i className="bi bi-envelope me-1" />
                        {item.email}
                      </small>
                      <br />
                      <small>
                        <i className="bi bi-file-medical me-1" />
                        {item.specialite}
                      </small>
                      {/* Info */}
                      <div className="d-flex justify-content-between mt-4">
                        <h6 className="mb-0 small">
                          <span className="fw-light">Email Status:</span>
                        </h6>
                        {item.verified ? (
                          <h6 className="mb-0 small badge bg-secondary bg-opacity-25 text-secondary">
                            Verified
                          </h6>
                        ) : (
                          <h6 className="mb-0 small badge bg-danger bg-opacity-25 text-danger">
                            Not verified yet
                          </h6>
                        )}
                      </div>
                      {/* Info */}
                      <div className="d-flex justify-content-between mt-3">
                        <h6 className="mb-0 small">
                          <span className="fw-light">
                            Account Confirmation Status:
                          </span>
                        </h6>
                        {item.confirmed ? (
                          <h6 className="mb-0 small badge bg-secondary bg-opacity-25 text-secondary">
                            Confirmed
                          </h6>
                        ) : (
                          <h6 className="mb-0 small badge bg-danger bg-opacity-25 text-danger">
                            Unconfirmed
                          </h6>
                        )}
                      </div>
                      {/* Info */}
                      <div className="d-flex justify-content-between mt-3">
                        <h6 className="mb-0 small">
                          <span className="fw-light">Account Status:</span>
                        </h6>
                        {item.blocked ? (
                          <h6 className="mb-0 small badge bg-danger bg-opacity-25 text-danger">
                            Blocked
                          </h6>
                        ) : (
                          <h6 className="mb-0 small badge bg-secondary bg-opacity-25 text-secondary">
                            Unblocked
                          </h6>
                        )}
                      </div>
                    </div>
                    {/* Card footer */}
                    <div className="card-footer d-flex gap-3 align-items-center">
                      <button
                        className="btn btn-sm btn-primary-soft mb-0 w-100"
                        onClick={() => handleShow(item)}
                      >
                        View detail
                      </button>

                      {item.confirmed ? (
                        <></>
                      ) : (
                        <button
                          onClick={() => confirmedInternaute(item._id)}
                          className="btn btn-sm btn-success-soft flex-shrink-0 mb-0"
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          data-bs-title="Confirmed"
                        >
                          <i className="bi bi-person-check"></i>
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-info-soft flex-shrink-0 mb-0"
                        onClick={() => handleShowLicenceProfessionnelle(item)}
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        data-bs-title="Professional license"
                      >
                        <i className="bi bi-file-earmark-medical"></i>
                      </button>

                      {item.blocked ? (
                        <button
                          onClick={() => unblockedInternaute(item._id)}
                          className="btn btn-sm btn-secondary-soft flex-shrink-0 mb-0"
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          data-bs-title="Unblocked"
                        >
                          <i className="bi bi-unlock"></i>
                        </button>
                      ) : (
                        <button
                          onClick={() => blockedInternaute(item._id)}
                          className="btn btn-sm btn-danger-soft flex-shrink-0 mb-0"
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          data-bs-title="Blocked"
                        >
                          <i className="bi bi-lock"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* agent list END */}
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <>
            <div className="col-md-12">
              <div className="card bg-light">
                {/* Card body */}
                <div className="card-body text-center">
                  {/* Avatar Image */}
                  <div className="avatar avatar-xl flex-shrink-0 mb-3">
                    <img
                      className="avatar-img rounded-circle"
                      src={currentInternaute?.image}
                      alt="avatar"
                    />
                  </div>
                  {/* Title */}
                  <h5 className="mb-2">
                    {currentInternaute?.prenom} {currentInternaute?.nom}
                  </h5>
                </div>
                {/* Card footer */}
                <div className="card-footer bg-light border-top">
                  <h6 className="mb-3">Details</h6>
                  {/* Email id */}
                  <div className="d-flex align-items-center mb-3">
                    <div className="icon-md bg-mode h6 mb-0 rounded-circle flex-shrink-0">
                      <i className="bi bi-envelope-fill" />
                    </div>
                    <div className="ms-2">
                      <small>Email address</small>
                      <h6 className="fw-normal small mb-0">
                        <a>{currentInternaute?.email}</a>
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
                        <a>{currentInternaute?.telephone}</a>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </Modal.Body>
      </Modal>

      <Modal
        size="lg"
        show={showModalLicenceProfessionnelle}
        onHide={handleCloseLicenceProfessionnelle}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <>
            <div className="col-md-12">
              <div className="card bg-light">
                {/* Card body */}
                <div className="card-body text-center">
                  {/* Title */}
                  <h5 className="mb-2">
                    <i className="bi bi-file-earmark-medical-fill fa-fw me-1" />
                    Professional license
                  </h5>
                </div>
                {/* Card footer */}
                <div className="card-footer text-center bg-light border-top">
                  <img
                    src={licenceProfessionnelleImageUrl}
                    alt="Professional License"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </div>
            </div>
          </>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ListInternaute;
