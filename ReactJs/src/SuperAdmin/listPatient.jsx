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

function ListPatient() {
  const [patient, setPatient] = useState([]);
  const [patientCount, setPatientCount] = useState(0);
  const [notVerifiedPatients, setNotVerifiedPatients] = useState([]);
  const [notVerifiedPatientsCount, setNotVerifiedPatientsCount] = useState(0);
  const [blockedPatients, setBlockedPatients] = useState([]);
  const [blockedPatientsCount, setBlockedPatientsCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatient, setFilteredPatient] = useState([]);

  useEffect(() => {
    fetchPatients();
    fetchAllNotVerifiedPatients();
    fetchAllBlockedPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${base_url}/patient/`);
      setPatient(response.data.data);
      setPatientCount(response.data.data.length);
    } catch (error) {
      console.error("Error fetching Patients:", error);
    }
  };

  const fetchAllNotVerifiedPatients = async () => {
    try {
      const response = await axios.get(`${base_url}/patient/getAllNotVerified`);
      setNotVerifiedPatients(response.data.data);
      setNotVerifiedPatientsCount(response.data.data.length);
      fetchAllNotVerifiedPatients();
    } catch (error) {
      console.error("Error fetching Patients:", error);
    }
  };

  const fetchAllBlockedPatients = async () => {
    try {
      const response = await axios.get(`${base_url}/patient/getAllBlocked`);
      setBlockedPatients(response.data.data);
      setBlockedPatientsCount(response.data.data.length);
      fetchAllBlockedPatients();
    } catch (error) {
      console.error("Error fetching Patients:", error);
    }
  };

  const unblockedPatient = async (id) => {
    try {
      await axios.put(`${base_url}/patient/unblocked/${id}`);

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
        title: "The patient has been unblocked.",
      });

      fetchPatients();
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

      console.error("Error unblocked patient:", error);
    }
  };

  const blockedPatient = async (id) => {
    try {
      await axios.put(`${base_url}/patient/blocked/${id}`);

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
        title: "The patient has been blocked.",
      });

      fetchPatients();
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

      console.error("Error blocked patient:", error);
    }
  };

  useEffect(() => {
    const results = patient.filter((patient) => {
      const fullName = `${patient.prenom} ${patient.nom}`.toLowerCase();
      return (
        patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fullName.includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredPatient(results);
  }, [searchTerm, patient]);

  return (
    <>
      <div className="page-content-wrapper p-xxl-4">
        {/* Title */}
        <div className="row">
          <div className="col-12 mb-4 mb-sm-5">
            <div className="d-sm-flex justify-content-between align-items-center">
              <h1 className="h3 mb-3 mb-sm-0">
                <i className="bi bi-list fa-fw me-1"></i>Patient List
              </h1>
            </div>
          </div>
        </div>
        {/* Counter boxes START */}
        <div className="row g-4 mb-5">
          {/* Counter item */}
          <div className="col-md-6 col-xxl-4">
            <div className="card card-body bg-warning bg-opacity-10 border border-warning border-opacity-25 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center">
                {/* Digit */}
                <div>
                  <h4 className="mb-0">{patientCount}</h4>
                  <span className="h6 fw-light mb-0">
                    Total Patients
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
          <div className="col-md-6 col-xxl-4">
            <div className="card card-body bg-success bg-opacity-10 border border-success border-opacity-25 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center">
                {/* Digit */}
                <div>
                  <h4 className="mb-0">{notVerifiedPatientsCount}</h4>
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
          <div className="col-md-6 col-xxl-4">
            <div className="card card-body bg-info bg-opacity-10 border border-info border-opacity-25 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center">
                {/* Digit */}
                <div>
                  <h4 className="mb-0">{blockedPatientsCount}</h4>
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
        {/* Filters START */}
        <div className="row g-4 align-items-center">
          {/* Search */}
          <div className="col-md-12 col-lg-12">
            <form
              className="rounded position-relative"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="form-control bg-transparent"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset">
                <i className="fas fa-search fs-6" />
              </span>
            </form>
          </div>
        </div>
        {/* Filters END */}
        {/* Guest list START */}
        <div className="card shadow mt-5">
          {/* Card body START */}
          <div className="card-body text-center">
            {/* Table head */}
            <div className="bg-light rounded p-3 d-none d-lg-block">
              <div className="row row-cols-7 g-4">
                <div className="col">
                  <h6 className="mb-0">Patient</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Sex</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Date of Birth</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Phone number</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Email address</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Email Status</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Account Status</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Action</h6>
                </div>
              </div>
            </div>
            {/* Table data */}
            {filteredPatient.length === 0 ? (
              <div className="mt-3 alert alert-primary" role="alert">
                No patients found.
              </div>
            ) : (
              filteredPatient.map((item, index) => (
                <div
                  key={index}
                  className="row row-cols-xl-7 align-items-lg-center border-bottom g-4 px-2 py-4"
                >
                  {/* Data item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Patient:</small>
                    <div className="d-flex align-items-center">
                      {/* Avatar */}
                      <div className="avatar avatar-xs flex-shrink-0">
                        <img
                          className="avatar-img rounded-circle"
                          src={item.image}
                          alt="avatar"
                        />
                      </div>
                      {/* Info */}
                      <div className="ms-2">
                        <h6 className="mb-0 fw-light">
                          {item.prenom} {item.nom}
                        </h6>
                      </div>
                    </div>
                  </div>
                  {/* Data item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Sex:</small>
                    <h6 className="mb-0 fw-normal">{item.sexe}</h6>
                  </div>
                  {/* Data item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Date of Birth:</small>
                    <h6 className="mb-0 fw-normal">
                      {item.dateNaissance &&
                      !isNaN(new Date(item.dateNaissance).getTime())
                        ? format(new Date(item.dateNaissance), "yyyy-MM-dd")
                        : ""}
                    </h6>
                  </div>
                  {/* Data item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Mobile number:</small>
                    <h6 className="mb-0 fw-normal">{item.telephone}</h6>
                  </div>
                  {/* Data item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Email address:</small>
                    <h6 className="mb-0 fw-normal">{item.email}</h6>
                  </div>
                  {/* Data item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Email Status:</small>
                    {item.verified ? (
                      <div className="badge bg-secondary bg-opacity-25 text-secondary">
                        Verified
                      </div>
                    ) : (
                      <div className="badge bg-danger bg-opacity-25 text-danger">
                        Not verified yet
                      </div>
                    )}
                  </div>
                  {/* Data item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Account Status:</small>
                    {item.blocked ? (
                      <div className="badge bg-danger bg-opacity-25 text-danger">
                        Blocked
                      </div>
                    ) : (
                      <div className="badge bg-secondary bg-opacity-25 text-secondary">
                        Unblocked
                      </div>
                    )}
                  </div>

                  {/* Data item */}
                  <div className="col">
                    {item.blocked ? (
                      <button
                      onClick={() => unblockedPatient(item._id)}
                      className="btn btn-sm btn-secondary-soft mb-0"
                      data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Unblocked"
                    >
                      <i className="bi bi-unlock"></i>
                    </button>
                    ) : (
                      <button
                        onClick={() => blockedPatient(item._id)}
                        className="btn btn-sm btn-danger-soft mb-0"
                        data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Blocked"
                      >
                        <i className="bi bi-lock"></i>
                      </button>
                      
                    )}
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

export default ListPatient;
