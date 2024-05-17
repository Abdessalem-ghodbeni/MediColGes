import React, { useState, useEffect } from "react";
import axios from "axios";

import { base_url } from "../baseUrl";
import { Pie, Line } from "react-chartjs-2";

import "./Internaute.css";
import { PieChartOutlined } from "@ant-design/icons";
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

function Statistique() {
  const [projects, setProjects] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [ongoingProjectsCount, setOngoingProjectsCount] = useState(0);
  const userId = localStorage.getItem("USER_ID");
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${base_url}/project/get/projectCreated/${userId}`
        );
        console.log("statistique", response);
        setProjects(response.data.projects);
        setProjectsCount(response.data.projects.length);
      } catch (error) {
        console.error("Error fetching list projects:", error);
      }
    };
    const fetchOngoingProjects = async () => {
      try {
        const response = await axios.get(
          `${base_url}/project/enCours/byInternaute/${userId}`
        );
        setOngoingProjects(response.data.data);
        setOngoingProjectsCount(response.data.data.length);
      } catch (error) {
        console.error("Error fetching Ongoing Projects:", error);
      }
    };
    fetchProjects();
    fetchOngoingProjects();
  }, []);

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
      <div className="container vstack gap-4 mb-5 mt-5">
        <div className="row  ">
          <div className="col-12 ">
            <div className="d-flex  align-item-center flex-wrap">
              <PieChartOutlined style={{ fontSize: "8.5rem" }} />

              <h3 className=" d-flex align-item-center mt-1 mt-md-5 mx-3">
                Statistique
              </h3>
            </div>
            <p className="text-center p-2 mt-5">
              <strong>
                Cette section est dédiée à l'analyse approfondie de vos projets.
                Ici, vous trouverez une mine d'informations et de statistiques
                précieuses sur les projets que vous avez créés. Nous croyons
                fermement que les chiffres peuvent vous donner un aperçu clair
                de vos performances et vous aider à prendre des décisions
                éclairées
              </strong>
            </p>
            <div className="col-12 ">
              <div className="card card-body bg-primary bg-opacity-10 border border-primary border-opacity-25 p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  {/* Digit */}
                  <div>
                    <h4 className="mb-0">{projectsCount}</h4>
                    <span className="h6 fw-light mb-0">
                      Le nombre des projet dont vous avez crée...
                    </span>
                  </div>
                  {/* Icon */}
                  <div className="icon-lg rounded-circle bg-primary text-white mb-0">
                    <i className="bi bi-inboxes-fill fa-fw" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-12 mt-3 mb-5">
              {/* Chart START */}
              <div className="card shadow h-100">
                {/* Card header */}
                <div className="card-header border-bottom">
                  <h5 className="card-header-title">Project Repartitions</h5>
                </div>
                {/* Card body */}
                <div className="card-body">
                  {/* Content */}
                  <div className="d-flex gap-4 flex-wrap">
                    <h6>
                      <span className="fw-light">
                        <i className="bi bi-square-fill text-danger" /> Ongoing
                        Projects:
                      </span>{" "}
                      {ongoingProjectsCount}
                    </h6>
                    <h6>
                      <span className="fw-light">
                        <i className="bi bi-square-fill text-primary" />{" "}
                        Completed Projects:
                      </span>{" "}
                      {projectsCount - ongoingProjectsCount}
                    </h6>
                  </div>
                  {/* Apex chart */}
                  <div className="mt-4 mb-2 d-flex justify-content-center align-items-center">
                    <div className="custumer_pie">
                      <Pie data={getPieChartData()} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Chart END */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Statistique;
