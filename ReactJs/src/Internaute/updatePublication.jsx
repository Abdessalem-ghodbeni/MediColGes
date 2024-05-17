import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
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

function UpdatePublication() {
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchPublicationData = async () => {
      try {
        const response = await axios.get(
          `${base_url}/publication/getById/${id}`
        );
        setTitre(response.data.data.titre);
        setContenu(response.data.data.contenu);
      } catch (error) {
        console.error("Error fetching Publication data:", error);
      }
    };
    fetchPublicationData();
  }, [id]);

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ['link', 'image'], // link and image

    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];
  const module = {
    toolbar: toolbarOptions,
  };

  const onChangeTitre = (e) => {
    setTitre(e.target.value);
  };

  // Gestionnaire spécifique pour ReactQuill
  const onChangeContenu = (value) => {
    setContenu(value);
  };

  const validateForm = () => {
    let errors = {};
  
    if (!titre) {
      errors.titre = "Title is required.";
    } else if (titre.length <= 3) {
      errors.titre = "Title must be more than 3 characters.";
    }
  
    // Supprime les balises HTML pour obtenir le texte brut du contenu
    const textContenu = contenu.replace(/<[^>]+>/g, '').trim();
    
    if (!textContenu) {
      errors.contenu = "Content is required.";
    } else if (textContenu.length <= 8) {
      errors.contenu = "Content must be more than 8 characters.";
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const dataToSend = {
        titre: titre,
        contenu: contenu,
      };

      const response = await axios.put(
        `${base_url}/publication/update/${id}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
        title: "Publication updated successfully",
      });

      navigate("/internaute/listPublication");
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
        title: "An error occurred.",
      });
      console.error("Error :", error);
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
                <i className="bi bi-card-heading fa-fw me-1"></i>Publications
              </h1>
            </div>
          </div>
          {/* Title END */}

          <div>
            {/* Tabs Content START */}
            <div className="row g-4">
              <div className="col-12">
                <div className="tab-content">
                  {/* Tab content 1 START */}
                  <div className="tab-pane show active">
                    <div className="row g-4">
                      {/* Edit profile START */}
                      <div className="col-12">
                        <div className="card border">
                          <div className="card-header border-bottom">
                            <h5 className="card-header-title">
                              Edit Publication
                            </h5>
                          </div>
                          <form
                            className="card-body row g-3"
                            onSubmit={onSubmitHandle}
                          >
                            {/* titre */}
                            <div className="col-md-12">
                              <label className="form-label">
                                Title<span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={titre}
                                onChange={onChangeTitre}
                              />
                              {formErrors.titre && <div className="text-danger mt-1"><i className="bi bi-exclamation-triangle"></i> {formErrors.titre}</div>}
                            </div>
                            {/* contenu */}
                            <div className="col-md-12">
                              <label className="form-label">
                                Content<span className="text-danger">*</span>
                              </label>
                              <ReactQuill
                                className="mb-5"
                                style={{ height: 300 }}
                                modules={module}
                                theme="snow"
                                value={contenu}
                                onChange={onChangeContenu}
                              />
                              {formErrors.contenu && <div className="text-danger mt-1"><i className="bi bi-exclamation-triangle"></i> {formErrors.contenu}</div>}
                            </div>
                            {/* Save button */}
                            <div className="d-flex justify-content-end mt-4">
                              <button type="submit" className="btn btn-primary">
                                Update
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                      {/* Edit profile END */}
                    </div>
                  </div>
                  {/* Tab content 1 END */}
                </div>
              </div>
            </div>
            {/* Tabs Content END */}
          </div>
        </div>
      </section>
    </>
  );
}

export default UpdatePublication;
