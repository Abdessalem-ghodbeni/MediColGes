import React from "react";
import { Link } from "react-router-dom";

function Error() {
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
              <button
                className="navbar-toggler ms-auto mx-3 me-xl-0 p-0 p-sm-1"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-animation">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
              {/* Navbar right side START */}
              <ul className="nav flex-row align-items-center list-unstyled ms-xl-auto">
                {/* Sign In button */}
                <li className="nav-item ms-2 d-none d-sm-block">
                  <Link
                    to="/login"
                    className="btn btn-sm btn-success-soft mb-0"
                  >
                    <i className="fa-solid fa-right-to-bracket me-2" />
                    Sign in
                  </Link>
                </li>
                {/* Sign Up button */}
                <li className="nav-item ms-2 d-none d-sm-block">
                  <Link
                    to="/register"
                    className="btn btn-sm btn-primary-soft mb-0"
                  >
                    <i className="fa-solid fa-user-plus me-2" />
                    Sign Up
                  </Link>
                </li>
              </ul>
              {/* Navbar right side END */}
            </div>
          </nav>
          {/* Logo Nav END */}
        </header>
        {/* Header END */}
        {/* **************** MAIN CONTENT START **************** */}
        <section>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-10 text-center mx-auto">
                {/* Image */}
                <img
                  src="assets/images/element/404 error with portals-rafiki.png"
                  className="h-lg-400px mb-4"
                />
                {/* Title */}
                <h1 className="display-1 text-primary mb-0">404</h1>
                {/* Subtitle */}
                <h2>Oh no, something went wrong!</h2>
                {/* info */}
                <p className="mb-4">
                  Either something went wrong or this page doesn't exist
                  anymore.
                </p>
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

export default Error;
