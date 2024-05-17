import React from "react";
import { Link } from "react-router-dom";

function Register() {
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
        {/* **************** MAIN CONTENT START **************** */}
        <main>
          {/* =======================
Main Content START */}
          <section>
            <h2 className="text-center mt-4">Choose Your Account Type</h2>
            <div className="container mt-6 d-flex px-0 px-sm-4">
              <div className="row justify-content-center align-items-center m-auto">
                <div className="col-12">
                  <div className="bg-mode shadow rounded-3 overflow-hidden">
                    <div className="row g-0">
                      {/* Vector Image */}
                      <div className="col-lg-6 d-md-flex align-items-center order-2 order-lg-1">
                        <Link to="/registerInternaute" className="p-3 p-lg-5">
                          <img src="assets/images/element/Stem-cell research-bro.png" />
                        </Link>
                        {/* Divider */}
                        <div className="vr opacity-1 d-none d-lg-block" />
                      </div>
                      {/* Information */}
                      <div className="col-lg-6 d-md-flex align-items-center order-2 order-lg-1">
                        <Link to="/registerPatient" className="p-3 p-lg-5">
                          <img src="assets/images/element/Oncology patient-bro.png" />
                        </Link>
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
      </div>
    </>
  );
}

export default Register;
