import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { base_url } from "../baseUrl";
import { Pie, Line } from "react-chartjs-2";
import { ArcElement } from "chart.js";
import Chart from "chart.js/auto";
import { format } from "date-fns";
import { Link } from "react-router-dom";

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

function DashboardContentSuperAdmin() {
  const [domaineProfessionnel, setDomaineProfessionnel] = useState([]);
  const [domaineProfessionnelCount, setDomaineProfessionnelCount] = useState(0);
  const [publications, setPublications] = useState([]);
  const [publicationsCount, setPublicationsCount] = useState(0);
  const [projects, setProjects] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [organizations, setOrganizations] = useState([]);
  const [organizationsCount, setOrganizationsCount] = useState(0);

  const [patient, setPatient] = useState([]);
  const [sortedPatients, setSortedPatients] = useState([]);
  const [patientCount, setPatientCount] = useState(0);
  const [internaute, setInternaute] = useState([]);
  const [sortedInternautes, setSortedInternaute] = useState([]);
  const [internauteCount, setInternauteCount] = useState(0);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [ongoingProjectsCount, setOngoingProjectsCount] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchDomaineProfessionnel();
    fetchPublications();
    fetchProjects();
    fetchOrganizations();
    fetchPatients();
    fetchInternautes();
    fetchOngoingProjects();
    fetchHistorys();
  }, []);

  const fetchDomaineProfessionnel = async () => {
    try {
      const response = await axios.get(`${base_url}/domaineProfessionnel`);
      setDomaineProfessionnel(response.data.data);
      setDomaineProfessionnelCount(response.data.data.length);
    } catch (error) {
      console.error("Error fetching domaine professionnel:", error);
    }
  };
  const fetchPublications = async () => {
    try {
      const response = await axios.get(`${base_url}/publication/`);
      setPublications(response.data.data);
      setPublicationsCount(response.data.data.length);
    } catch (error) {
      console.error("Error fetching Publications:", error);
    }
  };
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${base_url}/project/liste`);
      setProjects(response.data.ListeProjects);
      setProjectsCount(response.data.ListeProjects.length);
    } catch (error) {
      console.error("Error fetching list projects:", error);
    }
  };
  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(`${base_url}/organizations`);
      setOrganizations(response.data);
      setOrganizationsCount(response.data.length);
    } catch (error) {
      console.error("Error fetching list organizations:", error);
    }
  };
  const fetchInternautes = async () => {
    try {
      const response = await axios.get(`${base_url}/internaute/`);
      setInternaute(response.data.data);
      setInternauteCount(response.data.data.length);
      const sortedInternautes = response.data.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setSortedInternaute(sortedInternautes);
    } catch (error) {
      console.error("Error fetching Internautes:", error);
    }
  };
  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${base_url}/patient/`);
      setPatient(response.data.data);
      setPatientCount(response.data.data.length);
      const sortedPatients = response.data.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setSortedPatients(sortedPatients);
    } catch (error) {
      console.error("Error fetching Patients:", error);
    }
  };
  const fetchOngoingProjects = async () => {
    try {
      const response = await axios.get(`${base_url}/project/ongoing`);
      setOngoingProjects(response.data.data);
      setOngoingProjectsCount(response.data.data.length);
    } catch (error) {
      console.error("Error fetching Ongoing Projects:", error);
    }
  };
  const fetchHistorys = async () => {
    try {
      const response = await axios.get(`${base_url}/history/`);
      setHistory(
        response.data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4)
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

  const getMonthCountsPatient = () => {
    const monthCounts = Array(12).fill(0);

    patient.forEach((patient) => {
      const createdAt = new Date(patient.createdAt);
      const month = createdAt.getMonth();
      monthCounts[month] += 1;
    });

    return monthCounts;
  };
  const getMonthCountsInternaute = () => {
    const monthCounts = Array(12).fill(0);

    internaute.forEach((internaute) => {
      const createdAt = new Date(internaute.createdAt);
      const month = createdAt.getMonth();
      monthCounts[month] += 1;
    });

    return monthCounts;
  };

  const chartLabels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const chartDataPatient = getMonthCountsPatient();
  const chartDataInternaute = getMonthCountsInternaute();

  const getPieChartData = () => {
    return {
      labels: ["Ongoing Projects", "Completed Projects"],
      datasets: [
        {
          data: [ongoingProjectsCount, projectsCount - ongoingProjectsCount],
          backgroundColor: ["#fa0539", "#5a03fc"],
          hoverBackgroundColor: ["#fa0539", "#5a03fc"],
        },
      ],
    };
  };

  return (
    <>
      <div className="page-content-wrapper p-xxl-4">
        {/* Title */}
        <div className="row">
          <div className="col-12 mb-4 mb-sm-5">
            <div className="d-sm-flex justify-content-between align-items-center">
              <h1 className="h3 mb-2 mb-sm-0">Dashboard</h1>
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
                  <h4 className="mb-0">{domaineProfessionnelCount}</h4>
                  <span className="h6 fw-light mb-0">
                    Total Professional Domain
                  </span>
                </div>
                {/* Icon */}
                <div className="icon-lg rounded-circle bg-warning text-white mb-0">
                  <i className="bi bi-envelope-at fa-fw" />
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
                  <h4 className="mb-0">{publicationsCount}</h4>
                  <span className="h6 fw-light mb-0">Total Publications</span>
                </div>
                {/* Icon */}
                <div className="icon-lg rounded-circle bg-success text-white mb-0">
                  <i className="bi bi-card-heading fa-fw" />
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
                  <h4 className="mb-0">{projectsCount}</h4>
                  <span className="h6 fw-light mb-0">Total Projects</span>
                </div>
                {/* Icon */}
                <div className="icon-lg rounded-circle bg-primary text-white mb-0">
                  <i className="bi bi-inboxes-fill fa-fw" />
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
                  <h4 className="mb-0">{organizationsCount}</h4>
                  <span className="h6 fw-light mb-0">Total Organization</span>
                </div>
                {/* Icon */}
                <div className="icon-lg rounded-circle bg-info text-white mb-0">
                  <i className="bi bi-hospital-fill fa-fw" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Counter boxes END */}
        {/* Widget START */}
        <div className="row g-4">
          {/* Booking Chart START */}
          <div className="col-xxl-6">
            {/* Chart START */}
            <div className="card shadow h-100">
              {/* Card header */}
              <div className="card-header border-bottom">
                <h5 className="card-header-title">
                  Patients Registration Activity
                </h5>
              </div>
              {/* Card body */}
              <div className="card-body">
                {/* Content */}
                <div className="d-flex gap-4 mb-3">
                  <h6>
                    <span className="fw-light">
                      <i className="bi bi-square-fill text-primary" /> Total
                      Patients:
                    </span>{" "}
                    {patientCount}
                  </h6>
                </div>
                {/* Apex chart */}
                <div className="mt-2">
                  <Line
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: "Number of registrations made each month",
                          data: chartDataPatient,
                          fill: false,
                          borderColor: "rgb(0, 8, 255)",
                          tension: 0.1,
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Chart END */}
          </div>
          {/* Booking Chart END */}
          {/* Booking graph START */}
          <div className="col-xxl-6">
            {/* Chart START */}
            <div className="card shadow h-100">
              {/* Card header */}
              <div className="card-header border-bottom">
                <h5 className="card-header-title">
                  Health Professionals Registration Activity
                </h5>
              </div>
              {/* Card body */}
              <div className="card-body">
                {/* Content */}
                <div className="d-flex gap-4 mb-3">
                  <h6>
                    <span className="fw-light">
                      <i className="bi bi-square-fill text-danger" /> Total
                      Health Professionals:
                    </span>{" "}
                    {internauteCount}
                  </h6>
                </div>
                {/* Apex chart */}
                <div className="mt-2">
                  <Line
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: "Number of registrations made each month",
                          data: chartDataInternaute,
                          fill: false,
                          borderColor: "rgb(255, 3, 3)",
                          tension: 0.1,
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Chart END */}
          </div>
          {/* Booking graph END */}
          {/* Booking graph START */}

          <div className="col-xxl-12">
            {/* Chart START */}
            <div className="card shadow h-100">
              {/* Card header */}
              <div className="card-header border-bottom">
                <h5 className="card-header-title">
                  Project Status Distribution
                </h5>
              </div>
              {/* Card body */}
              <div className="card-body">
                {/* Content */}
                <div className="d-flex gap-4">
                  <h6>
                    <span className="fw-light">
                      <i className="bi bi-square-fill text-danger" /> Ongoing
                      Projects:
                    </span>{" "}
                    {ongoingProjectsCount}
                  </h6>
                  <h6>
                    <span className="fw-light">
                      <i className="bi bi-square-fill text-primary" /> Completed
                      Projects:
                    </span>{" "}
                    {projectsCount - ongoingProjectsCount}
                  </h6>
                </div>
                {/* Apex chart */}
                <div
                  className="mt-4 mb-2"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "400px", height: "400px" }}>
                    <Pie data={getPieChartData()} />
                  </div>
                </div>
              </div>
            </div>
            {/* Chart END */}
          </div>
          {/* Booking graph END */}
          {/* Rooms START */}
          <div className="col-lg-6 col-xxl-6">
            <div className="card shadow h-100">
              {/* Card header */}
              <div className="card-header border-bottom d-flex justify-content-between align-items-center">
                <h5 className="card-header-title">
                  List Of Last Registered Health Professionals
                </h5>
              </div>
              {/* Card body START */}
              <div className="card-body">
                {sortedInternautes.length > 0 ? (
                  <div>
                    {sortedInternautes.map((pt) => (
                      <div
                        key={pt._id}
                        className="d-flex justify-content-between align-items-center mb-3"
                      >
                        {/* Image and info */}
                        <div className="d-sm-flex align-items-center mb-1 mb-sm-0">
                          {/* Avatar */}
                          <div className="avatar avatar-md flex-shrink-0">
                            <img
                              src={pt.image}
                              alt="avatar"
                              className="avatar-img rounded-circle"
                            />
                          </div>
                          {/* Info */}
                          <div className="ms-sm-3 mt-2 mt-sm-0">
                            <h6 className="mb-1">{`${pt.prenom} ${pt.nom}`}</h6>
                            <ul className="nav nav-divider small">
                              <li className="nav-item">
                                Registered:{" "}
                                {new Date(pt.createdAt).toLocaleDateString()}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">
                    No recent health professionals registrations.
                  </p>
                )}
              </div>
              {/* Card body END */}
            </div>
          </div>
          {/* Rooms END */}
          {/* Reviews START */}
          <div className="col-lg-6 col-xxl-6">
            <div className="card shadow h-100">
              {/* Card header */}
              <div className="card-header border-bottom d-flex justify-content-between align-items-center">
                <h5 className="card-header-title">
                  List Of Last Registered Patients
                </h5>
              </div>
              {/* Card body START */}
              <div className="card-body">
                {sortedPatients.length > 0 ? (
                  <div>
                    {sortedPatients.map((pt) => (
                      <div
                        key={pt._id}
                        className="d-flex justify-content-between align-items-center mb-3"
                      >
                        {/* Image and info */}
                        <div className="d-sm-flex align-items-center mb-1 mb-sm-0">
                          {/* Avatar */}
                          <div className="avatar avatar-md flex-shrink-0">
                            <img
                              src={pt.image}
                              alt="avatar"
                              className="avatar-img rounded-circle"
                            />
                          </div>
                          {/* Info */}
                          <div className="ms-sm-3 mt-2 mt-sm-0">
                            <h6 className="mb-1">{`${pt.prenom} ${pt.nom}`}</h6>
                            <ul className="nav nav-divider small">
                              <li className="nav-item">
                                Registered:{" "}
                                {new Date(pt.createdAt).toLocaleDateString()}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">
                    No recent patient registrations.
                  </p>
                )}
              </div>
              {/* Card body END */}
            </div>
          </div>
          {/* Reviews END */}
          {/* Rooms START */}
          <div className="col-lg-12 col-xxl-12 mb-4">
            <div className="card shadow h-100">
              {/* Card header */}
              <div className="card-header border-bottom d-flex justify-content-between align-items-center">
                <h5 className="card-header-title">List of latest histories</h5>
                <Link to="/superAdmin/historical" className="btn btn-link p-0 mb-0">
                  View all
                </Link>
              </div>
              {/* Card body START */}
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
                          <small className="d-block d-lg-none">
                            Action Type:
                          </small>
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
                          <small className="d-block d-lg-none">
                            Date & Tim:
                          </small>
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
                          <h6 className="mb-0 fw-normal">
                            {truncateContent(item.details)}
                          </h6>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* Card body END */}
              </div>
              {/* Card body END */}
            </div>
          </div>
          {/* Rooms END */}
        </div>
        {/* Widget END */}
      </div>
    </>
  );
}

export default DashboardContentSuperAdmin;
