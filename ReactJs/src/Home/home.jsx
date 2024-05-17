import React from "react";
import { Link } from "react-router-dom";
import Gemini from "./Gemini";
import "./Gemini.css";
import Conversation from "./Conversation";
function Home() {
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

      <div>
        {/* Header START */}
        <header className="navbar-light header-sticky mb-5">
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
            </div>
          </nav>
          {/* Logo Nav END */}
        </header>
        {/* Header END */}
        {/* **************** MAIN CONTENT START **************** */}
        <main>
          {/* =======================
Blog START*/}
          <div className="container">{/* <Gemini /> */}</div>
          <section className="py-0 mb-4">
            <div className="container">
              {/* Background image */}
              <div
                className="rounded-3 p-3 p-sm-5"
                style={{
                  backgroundImage: "url(assets/images/h0.png)",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                {/* Banner title */}
                <div className="row">
                  <div className="col-md-10 mx-auto text-center">
                    <h1 className="text-dark display-3 pt-sm-5 my-5">
                      Welcome to CoMediC
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="container">
              <div className="row g-4 g-xl-5 justify-content-between">
                <div className="col-md-12">
                  {/* Card START */}
                  <div className="card bg-transparent mb-0 mb-md-5">
                    <div className="row align-items-center">
                      {/* Images */}
                      <div className="col-sm-4">
                        <img src="assets/images/h2.png" className="card-img" />
                      </div>
                      <div className="col-sm-8">
                        {/* card body */}
                        <div className="card-body p-sm-0">
                          <h5 className="card-title">
                            CoMediC - Your Platform for Collaborative Collection
                            of Multimodal Medical Data.
                          </h5>
                          <p className="card-text">
                            CoMediC is an innovative initiative aimed at
                            transforming how medical data are collected,
                            processed, and shared among health professionals,
                            researchers, and medical institutions. Through an
                            intuitive and secure interface, our platform
                            facilitates the creation of data collection
                            projects, remote collaborative work, and efficient
                            management of diverse medical data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Card END */}
                </div>
              </div>{" "}
              {/* Row END */}
            </div>
          </section>
          <section>
            <div className="container">
              <div className="row g-4 g-xl-5 justify-content-between">
                <div className="col-md-12">
                  {/* Card START */}
                  <div className="card bg-transparent mb-0 mb-md-5">
                    <div className="row align-items-center">
                      <div className="col-sm-8">
                        {/* card body */}
                        <div className="card-body p-sm-0">
                          <h5 className="card-title">Why Choose CoMediC?</h5>
                          <p className="card-text">
                            <strong>Multimodal Collection:</strong> We support
                            an extensive range of data, from textual analysis
                            results to diagnostic images, for a comprehensive
                            approach to patient health.
                            <br />
                            <strong>Collaboration Without Borders:</strong>{" "}
                            Whether you're a researcher, a physician, or a
                            member of a health organization, CoMediC enables
                            real-time collaboration, driving faster medical
                            innovation and research.
                            <br />
                            <strong>Simplified Project Management:</strong> With
                            our project, member, and data management tools,
                            launching and tracking your data collection projects
                            is remarkably easy.
                            <br />
                            <strong>Security and Privacy:</strong> Your data's
                            protection is our top priority. CoMediC uses
                            advanced technologies to ensure the security and
                            confidentiality of all collected data.
                          </p>
                        </div>
                      </div>
                      {/* Images */}
                      <div className="col-sm-4">
                        <img src="assets/images/h1.png" className="card-img" />
                      </div>
                    </div>
                  </div>
                  {/* Card END */}
                </div>
              </div>{" "}
              {/* Row END */}
            </div>
          </section>
          {/* =======================
Blog START*/}
        </main>
        {/* **************** MAIN CONTENT END **************** */}
        {/* =======================
Footer START */}
        <div className="custumer_chatbot_icon_button">
          <Conversation />
        </div>
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

export default Home;
