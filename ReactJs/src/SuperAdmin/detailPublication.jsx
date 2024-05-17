import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { base_url } from "../baseUrl";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "react-quill/dist/quill.snow.css";

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

function DetailPublication() {
  const [publication, setPublication] = useState({});
  const [internaute, setInternaute] = useState({});
  const [commentaires, setCommentaires] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const fetchDetailPublication = async () => {
      try {
        const response = await axios.get(
          `${base_url}/publication/getById/${id}`
        );
        setPublication(response.data.data);
        setInternaute(response.data.data.internaute);
      } catch (error) {
        console.error("Error fetching Publication details:", error);
      }
    };

    fetchDetailPublication();
  }, [id]);

  useEffect(() => {
    fetchCommentaires();
  }, []);

  const fetchCommentaires = async () => {
    try {
      const response = await axios.get(
        `${base_url}/commentaire/getByIdPublication/${id}`
      );
      setCommentaires(response.data.data);
    } catch (error) {
      console.error("Error fetching Publications:", error);
    }
  };

  const deleteCommentaire = async (id) => {
    try {
      await axios.delete(`${base_url}/commentaire/delete/${id}`);

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
        title: "Comment delete with success.",
      });

      fetchCommentaires();
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

      console.error("Error deleted Comment:", error);
    }
  };

  const downloadPDF = () => {
    const elementToCapture = document.getElementById("contentToDownload");

    html2canvas(elementToCapture).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();

      // Configuration et ajout du titre au centre du PDF
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      const title = publication.titre; // Assurez-vous que publication.titre contient le titre de la publication
      const titleWidth =
        (pdf.getStringUnitWidth(title) * pdf.internal.getFontSize()) /
        pdf.internal.scaleFactor;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const xTitle = (pageWidth - titleWidth) / 2;
      const titleMarginTop = 15;
      pdf.text(title, xTitle, titleMarginTop);

      // Ajustement de l'image
      const imgMarginTop = titleMarginTop + 20; // Espace après le titre
      const imgWidth = 180; // Largeur de l'image
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Hauteur calculée pour maintenir le ratio
      pdf.addImage(imgData, "PNG", 15, imgMarginTop, imgWidth, imgHeight);

      // Ajouter le nom de l'auteur en bas à droite
      const authorText = `Author: ${internaute.prenom} ${internaute.nom}`; // Texte à afficher
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      const authorTextWidth =
        (pdf.getStringUnitWidth(authorText) * pdf.internal.getFontSize()) /
        pdf.internal.scaleFactor;
      const xAuthor = pageWidth - authorTextWidth - 20; // 20 est la marge droite
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.text(authorText, xAuthor, pageHeight - 20); // 10 est la marge du bas

      // Nommer et sauvegarder le PDF
      const safeTitle = title.replace(/\s+/g, "_").substring(0, 30);
      pdf.save(`${safeTitle}.pdf`);
    });
  };

  return (
    <>
      <div className="page-content-wrapper p-xxl-4">
        {/* Title */}
        <div className="row">
          <div className="col-12 mb-4 mb-sm-5">
            <h1 className="h3 mb-0">
              <i className="bi bi-card-heading fa-fw me-1"></i>Publications Details
            </h1>
          </div>
        </div>
        <div className="row g-4">
          {/* Profile setting */}
          <div className="col-lg-12">
            <div className="card shadow">
              <div className="card-body">
                <div className="row g-4 mb-5">
                  {/* Agent info START */}
                  <div className="col-md-4 col-xxl-3">
                    <div className="card bg-light">
                      {/* Card body */}
                      <div className="card-body text-center">
                        {/* Avatar Image */}
                        <div className="avatar avatar-xl flex-shrink-0 mb-3">
                          <img
                            className="avatar-img rounded-circle"
                            src={internaute.image}
                            alt="avatar"
                          />
                        </div>
                        {/* Title */}
                        <h5 className="mb-2">
                          {internaute.prenom} {internaute.nom}
                        </h5>
                      </div>
                      {/* Card footer */}
                      <div className="card-footer bg-light border-top">
                        <h6 className="mb-3">Contact Details</h6>
                        {/* specialite */}
                        <div className="d-flex align-items-center mb-3">
                          <div className="icon-md bg-mode h6 mb-0 rounded-circle flex-shrink-0">
                            <i className="bi bi-file-medical-fill" />
                          </div>
                          <div className="ms-2">
                            <small>Speciality</small>
                            <h6 className="fw-normal small mb-0">
                              <a>{internaute?.specialite}</a>
                            </h6>
                          </div>
                        </div>
                        {/* Email id */}
                        <div className="d-flex align-items-center mb-3">
                          <div className="icon-md bg-mode h6 mb-0 rounded-circle flex-shrink-0">
                            <i className="bi bi-envelope-fill" />
                          </div>
                          <div className="ms-2">
                            <small>Email address</small>
                            <h6 className="fw-normal small mb-0">
                              <a>{internaute.email}</a>
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
                              <a>{internaute.telephone}</a>
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Agent info END */}
                  <div className="col-md-8 col-xxl-9">
                    {/* Personal info START */}
                    <div className="card shadow">
                      {/* Card header */}
                      <div className="card-header border-bottom">
                        <h5 className="mb-0">{publication.titre}</h5>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-primary-soft mb-0 ms-auto flex-shrink-0"
                            onClick={downloadPDF}
                          >
                            <i className="bi bi-cloud-download fa-fw me-2" />
                            Download as PDF
                          </button>
                        </div>
                      </div>
                      {/* Card body */}
                      <div className="card-body">
                        <div className="row">
                          {/* Information item */}
                          <div className="col-12 mb-4">
                            <ul className="list-group list-group-borderless">
                              <li className="list-group-item">
                                <div
                                  id="contentToDownload"
                                  className="fw-normal view ql-editor mb-0"
                                  dangerouslySetInnerHTML={{
                                    __html: publication.contenu,
                                  }}
                                ></div>
                              </li>
                            </ul>
                          </div>
                          <hr />
                          {commentaires.length === 0 ? (
                            <div
                              className="mt-3 alert alert-primary"
                              role="alert"
                            >
                              No comments found.
                            </div>
                          ) : (
                            commentaires.map((commentaire) => (
                              <div key={commentaire._id}>
                                <div className="bg-light rounded p-3">
                                  {/* Review item START */}
                                  <div className="d-sm-flex justify-content-between">
                                    {/* Avatar image */}
                                    <div className="d-sm-flex align-items-center mb-3">
                                      <img
                                        className="avatar avatar-md rounded-circle float-start me-3"
                                        src={commentaire.internaute.image}
                                        alt="avatar"
                                      />
                                      {/* Title */}
                                      <div>
                                        <h6 className="m-0">
                                          {commentaire.internaute.prenom}{" "}
                                          {commentaire.internaute.nom}
                                        </h6>
                                        <span className="me-3 small">
                                          {format(
                                            new Date(commentaire.createdAt),
                                            "dd MMM yyyy à HH:mm"
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Content */}
                                  <h6 className="fw-normal">
                                    {commentaire.contenu}
                                  </h6>
                                  {/* Buttons */}
                                  <div className="d-flex justify-content-between align-items-center">
                                    <a />
                                    <button
                                      className="btn btn-sm btn-danger-soft mb-0"
                                      onClick={() =>
                                        deleteCommentaire(commentaire._id)
                                      }
                                    >
                                      <i className="bi bi-trash-fill"></i>
                                    </button>
                                  </div>
                                </div>
                                <hr />
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Personal info END */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailPublication;
