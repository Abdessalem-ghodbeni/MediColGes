import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { base_url } from "../baseUrl";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i; // Expression régulière pour la validation de l'email
  
    if (!email) {
      errors.email = "Email address is required.";
    } else if (!regex.test(email)) {
      errors.email = "Email address is invalid.";
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Retourne true si aucune erreur
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Ne pas soumettre le formulaire si la validation échoue

    try {
      const response = await axios.post(
        `${base_url}/authentification/forgotPassword`,
        {
          email: email,
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
        title: "Please check your mailbox.",
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
        title: "Email invalid or unable to process request. Please try again.",
      });
      console.error("Error logging in:", error);
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
                        <img src="assets/images/element/forgot-pass.svg" />
                      </div>
                      {/* Divider */}
                      <div className="vr opacity-1 d-none d-lg-block" />
                    </div>
                    {/* Information */}
                    <div className="col-lg-6 order-1">
                      <div className="p-4 p-sm-7">
                        {/* Title */}
                        <h1 className="mb-2 h3">Forgot password?</h1>
                        <p className="mb-sm-0">
                          Enter the email address associated with an account.
                        </p>
                        {/* Form START */}
                        <form
                          className="mt-sm-4 text-start"
                          onSubmit={onSubmitHandle}
                        >
                          {/* Email */}
                          <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input
                              type="email"
                              className="form-control"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                            {formErrors.email && <div className="text-danger mt-1"><i className="bi bi-exclamation-triangle"></i> {formErrors.email}</div>}
                          </div>
                          <div className="mb-3 text-center">
                            <p>
                              Back to <Link to="/login">Sign in</Link>
                            </p>
                          </div>
                          {/* Button */}
                          <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                              Reset Password
                            </button>
                          </div>
                          {/* Divider */}
                          <div className="position-relative my-4">
                            <hr />
                            <p className="small position-absolute top-50 start-50 translate-middle bg-mode px-2"></p>
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

export default ForgotPassword;
