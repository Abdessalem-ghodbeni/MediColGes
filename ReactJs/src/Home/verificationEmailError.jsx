import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function VerificationEmailError() {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div>
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
        {/* Header START */}
        <header className="navbar-light header-sticky">
          {/* Logo Nav START */}
          <nav className="navbar navbar-expand-xl">
            <div className="container">
              {/* Logo START */}
              <a className="navbar-brand">
                <img
                  className="light-mode-item navbar-brand-item"
                  src="assets/images/logo.png"
                  style={{ height: "60px" }}
                  alt="logo"
                />
                <img
                  className="dark-mode-item navbar-brand-item"
                  src="assets/images/logo.png"
                  style={{ height: "60px" }}
                  alt="logo"
                />
              </a>
              {/* Logo END */}
              {/* Responsive navbar toggler */}
              {/* Responsive navbar toggler */}
              <button
                className="navbar-toggler ms-sm-auto mx-3 me-md-0 p-0 p-sm-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCategoryCollapse"
                aria-controls="navbarCategoryCollapse"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i className="bi bi-grid-3x3-gap-fill fa-fw" />
              </button>

              <div
                className="navbar-collapse collapse"
                id="navbarCategoryCollapse"
              >
                <ul className="navbar-nav navbar-nav-scroll nav-pills-primary-soft text-center ms-auto p-2 p-xl-0">
                  {/* Sign In button */}
                  <li className="nav-item mb-2 ms-2 d-sm-block">
                    <Link
                      to="/login"
                      className="btn btn-sm btn-success-soft mb-0"
                    >
                      <i className="fa-solid fa-right-to-bracket me-2" />
                      Sign in
                    </Link>
                  </li>
                  {/* Sign Up button */}
                  <li className="nav-item ms-2 d-sm-block">
                    <Link
                      to="/register"
                      className="btn btn-sm btn-primary-soft mb-0"
                    >
                      <i className="fa-solid fa-user-plus me-2" />
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Navbar right side END */}
            </div>
          </nav>
          {/* Logo Nav END */}
        </header>
        {/* Header END */}

        {showAlert && (
          <div className="container mt-3">
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              An error occurred! Please try again.
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={() => setShowAlert(false)}
              ></button>
            </div>
          </div>
        )}

        {/* **************** MAIN CONTENT START **************** */}
        <section>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-10 text-center mx-auto">
                {/* Image */}
                <img
                  src="assets/images/element/504 Error Gateway Timeout-pana.png"
                  className="h-lg-400px mb-4"
                />
                <br />
                {/* Button */}
                <Link to="/" className="btn btn-light mb-0">
                  Take me to Homepage
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* **************** MAIN CONTENT END **************** */}
        {/* =======================
Footer START */}
        <footer>
          <div className="container">
            <div className="bg-dark rounded-top py-5 p-sm-5 mx-0">
              <div className="row g-4 align-items-center text-center text-lg-start">
                {/* Copyright */}

                {/* Logo */}
                <div className="col-lg-12 text-center">
                  {/* Logo */}
                  <a className="me-0">
                    <img
                      src="assets/images/logo2C.png"
                      style={{ height: "75px" }}
                      alt="footer logo"
                    />
                  </a>
                  <div className="text-body-secondary text-primary-hover mt-3">
                    {" "}
                    Copyrights ©2024 CoMediC. Build by{" "}
                    <a
                      href="https://esprit.tn/"
                      className="text-body-secondary"
                    >
                      ESPRIT
                    </a>
                    .{" "}
                  </div>
                </div>
                {/* Social links */}
              </div>
            </div>
          </div>
        </footer>
        {/* =======================
Footer END */}
      </div>
    </>
  );
}

export default VerificationEmailError;
