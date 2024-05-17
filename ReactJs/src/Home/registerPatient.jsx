import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { base_url } from "../baseUrl";

function RegisterPatient() {
  const [data, setData] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validateForm = () => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i; // Expression régulière pour valider l'email
  
    if (!data.prenom) {
      errors.prenom = "First name is required.";
    }
  
    if (!data.nom) {
      errors.nom = "Last name is required.";
    }
  
    if (!data.email) {
      errors.email = "Email address is required.";
    } else if (!regex.test(data.email)) {
      errors.email = "Email address is invalid.";
    }
  
    if (!data.password) {
      errors.password = "Password is required.";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  
  const onChangeHandle = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    console.log(data);
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("nom", data.nom);
      formData.append("prenom", data.prenom);
      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await axios.post(`${base_url}/patient/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);

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
        title: "Please check your email to verify your account.",
      });

      navigate("/login");
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
        title: "An error occurred during registration.",
      });
      console.error("Error register Patient :", error);
    }
  };

  return (
    <>
      {/* Top alert START */}
      <div
        className="alert alert-warning py-2 m-0 bg-primary border-0 rounded-0 alert-dismissible fade show text-center overflow-hidden"
        role="alert"
      >
        <p className="text-white m-0">
          NOW AND ALWAYS, WE STAND WITH THE PEOPLE OF PALESTINE!{" "}
          <img
            src="./public/assets/images/palestine.png"
            style={{ width: 35, height: "auto" }}
          />
        </p>
        <button
          type="button"
          className="btn-close btn-close-white opacity-9 p-3"
          data-bs-dismiss="alert"
          aria-label="Close"
        />
      </div>
      {/* Top alert END */}
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        {/* =======================
Main Content START */}
        <section className="vh-xxl-100">
          <div className="container h-100 d-flex px-0 px-sm-4">
            <div className="row justify-content-center align-items-center m-auto">
              <div className="col-12">
                <div className="bg-mode shadow rounded-3 overflow-hidden">
                  <div className="row g-0">
                    {/* Vector Image */}
                    <div className="col-lg-6 d-md-flex align-items-center order-2 order-lg-1">
                      <div className="p-3 p-lg-5">
                        <img src="assets/images/element/signin.svg" />
                      </div>
                      {/* Divider */}
                      <div className="vr opacity-1 d-none d-lg-block" />
                    </div>
                    {/* Information */}
                    <div className="col-lg-6 order-1">
                      <div className="p-4 p-sm-6">
                        {/* Title */}
                        <h1 className="mb-2 h3">Create new account</h1>
                        <p className="mb-0">
                          Already a member?<Link to="/login"> Log in</Link>
                        </p>
                        {/* Form START */}
                        <form
                          className="mt-4 text-start"
                          onSubmit={onSubmitHandle}
                        >
                          {/* First name */}
                          <div className="mb-3">
                            <label className="form-label">First name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="prenom"
                              onChange={onChangeHandle}
                            />
                            {formErrors.prenom && <div className="text-danger mt-1"><i className="bi bi-exclamation-triangle"></i> {formErrors.prenom}</div>}
                          </div>
                          {/* Last name */}
                          <div className="mb-3">
                            <label className="form-label">Last name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="nom"
                              onChange={onChangeHandle}
                            />
                            {formErrors.nom && <div className="text-danger mt-1"><i className="bi bi-exclamation-triangle"></i> {formErrors.nom}</div>}
                          </div>
                          {/* Email */}
                          <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              onChange={onChangeHandle}
                            />
                            {formErrors.email && <div className="text-danger mt-1"><i className="bi bi-exclamation-triangle"></i> {formErrors.email}</div>}
                          </div>
                          {/* Password */}
                          <div className="mb-3 position-relative">
                            <label htmlFor="psw-input" className="form-label">
                              Password
                            </label>
                            <input
                              className="form-control fakepassword"
                              type={isPasswordVisible ? "text" : "password"}
                              id="psw-input"
                              name="password"
                              onChange={onChangeHandle}
                            />
                            <span
                              className="position-absolute top-50 end-0 translate-middle-y p-0 mt-3"
                              onClick={togglePasswordVisibility}
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className={`fakepasswordicon fas ${
                                  isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                                } cursor-pointer p-2`}
                              ></i>
                            </span>
                            {formErrors.password && <div className="text-danger mt-1"><i className="bi bi-exclamation-triangle"></i> {formErrors.password}</div>}
                          </div>
                          {/* Button */}
                          <div>
                            <button
                              type="submit"
                              className="btn btn-primary w-100 mb-0"
                            >
                              Sign up
                            </button>
                          </div>
                          {/* Divider */}
                          <div className="position-relative my-4">
                            <hr />
                            <p className="small position-absolute top-50 start-50 translate-middle bg-mode px-1 px-sm-2"></p>
                          </div>
                          {/* Copyright */}
                          <div className="text-primary-hover text-body mt-3 text-center">
                            {" "}
                            Copyrights ©2024 CoMediC. Build by{" "}
                            <a href="https://esprit.tn/" className="text-body">
                              ESPRIT
                            </a>
                            .{" "}
                          </div>
                        </form>
                        {/* Form END */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* =======================
Main Content END */}
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </>
  );
}

export default RegisterPatient;
