import React, { useEffect, useState } from "react";
import axios from "axios";
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

function DomaineProfessionnel() {
  const [data, setData] = useState({ domaine: "" });
  const [domaineProfessionnel, setDomaineProfessionnel] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    
    if (!data.domaine) {
      errors.domaine = "This field is required.";
    } else {
      if (data.domaine.length <= 6) {
        errors.domaine = "This field must contain more than 6 characters.";
      }
      if (!data.domaine.includes('.')) {
        errors.domaine = errors.domaine ? errors.domaine + " A point (.) must be included." : "A point (.) must be included.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    // Efface l'erreur du champ en cours de modification pour améliorer l'expérience utilisateur
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: "" });
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post(`${base_url}/domaineProfessionnel/add`, data);

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
        title: "Professional domain added successfully!",
      });

      setData({ domaine: "" });
      fetchDomaineProfessionnel();
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
        title: "An unknown error has occurred.",
      });
      console.error("Error add :", error);
    }
  };
  const fetchDomaineProfessionnel = async () => {
    try {
      const response = await axios.get(`${base_url}/domaineProfessionnel`);
      setDomaineProfessionnel(response.data.data);
    } catch (error) {
      console.error("Error fetching domaine professionnel:", error);
    }
  };

  useEffect(() => {
    fetchDomaineProfessionnel();
  }, []);

  const onDeleteHandle = async (id) => {
    try {
      await axios.delete(`${base_url}/domaineProfessionnel/delete/${id}`);

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
        title: "Professional domain successfully deleted!",
      });
      fetchDomaineProfessionnel();
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
        title: "An unknown error has occurred.",
      });
      console.error("Error deleted :", error);
    }
  };

  return (
    <>
      <div className="page-content-wrapper p-xxl-4">
        {/* Title */}
        <div className="row">
          <div className="col-12 mb-4 mb-sm-5">
            <h1 className="h3 mb-0">
              <i className="bi bi-envelope-at fa-fw me-1"></i>Professional
              Domain
            </h1>
          </div>
        </div>
        <div className="row g-4">
          {/* Profile setting */}
          <div className="col-lg-12">
            <div className="card shadow">
              <div className="card-header border-bottom">
                <h5 className="card-header-title">Add Professional Domain</h5>
              </div>
              <form className="card-body" onSubmit={onSubmitHandle}>
                {/* Full name */}
                <div className="mb-3">
                  <label className="form-label">Domain<span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="domaine"
                    onChange={onChangeHandle}
                  />
                  {formErrors.domaine && <div className="text-danger mt-1"><i className="bi bi-exclamation-triangle"></i> {formErrors.domaine}</div>}
                </div>
                {/* Save button */}
                <div className="d-flex justify-content-end mt-4">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Account setting */}
          <div className="col-lg-12">
            {/* Active log table */}
            <div className="card shadow mt-4">
              {/* Card header */}
              <div className="card-header border-bottom">
                <h5 className="card-header-title">Professional Domain List</h5>
              </div>
              {/* Card body START */}
              <div className="card-body text-center">
                {/* Table START */}
                <div className="bg-light rounded p-3 d-none d-lg-block">
                  <div className="row row-cols-7 g-4">
                    <div className="col">
                      <h6 className="mb-0">Domain</h6>
                    </div>
                    <div className="col">
                      <h6 className="mb-0">Action</h6>
                    </div>
                  </div>
                </div>
                {/* Table data */}
                {domaineProfessionnel.length === 0 ? (
                  <div className="mt-3 alert alert-primary" role="alert">
                    No Professional Domain found.
                  </div>
                ) : (
                  domaineProfessionnel.map((domaine) => (
                    <div
                      key={domaine._id}
                      className="row row-cols-xl-7 align-items-lg-center border-bottom g-4 px-2 py-4"
                    >
                      {/* Data item */}
                      <div className="col">
                        <small className="d-block d-lg-none">Domain:</small>
                        <h6 className="mb-0 fw-normal">{domaine.domaine}</h6>
                      </div>

                      {/* Data item */}
                      <div className="col">
                        <button
                          className="btn btn-sm btn-danger-soft me-1 mb-1 mb-md-0"
                          onClick={() => onDeleteHandle(domaine._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
                {/* Table END */}
              </div>
              {/* Card body END */}
            </div>
          </div>
        </div>{" "}
        {/* Row END */}
      </div>
    </>
  );
}

export default DomaineProfessionnel;
