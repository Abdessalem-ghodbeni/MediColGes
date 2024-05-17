import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { base_url } from "../baseUrl";
import Logout from "../Authentification/logout";

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

function TwoFactorAuthentication() {
  const [verificationCode, setVerificationCode] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const isTwoFactorEnabled = JSON.parse(
    localStorage.getItem("isTwoFactorEnabled")
  );
  const navigate = useNavigate();

  const { logout } = Logout();

  const validateForm = () => {
    let errors = {};
    
    if (!verificationCode) {
      errors.verificationCode = "Verification code is required.";
    } else if (verificationCode.length !== 6) {
      errors.verificationCode = "Verification code must be 6 digits long.";
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Retourne true si aucune erreur
  };
  

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userId = localStorage.getItem("USER_ID");
    const userRole = localStorage.getItem("USER_ROLE");

    try {
      const response = await axios.post(
        `${base_url}/authentification/verify2fa/${userId}`,
        {
          token: verificationCode, // Envoyez verificationCode comme token
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
        title: "Two-Factor Authentication verified successfully!",
      });

      localStorage.setItem('twoFactorVerified', 'true');

      if (userRole === "superAdmin") {
        navigate("/superAdmin/profile");
      } else if (userRole === "internautes") {
        navigate("/internaute/profile");
      } else {
        navigate("/patient/profile");
      }
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
        title: "Please ensure the code is correct and try again.",
      });
      console.error("Erreur lors de la vérification de 2FA", error);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f0f2f5",
        }}
      >
        <div
          className="card text-center shadow-lg p-3 mb-5 bg-body rounded"
          style={{ width: "30rem" }}
        >
          <img
            className="card-img-top mx-auto d-block"
            src="https://res.cloudinary.com/dvofvctg3/image/upload/v1711821509/nj5tztlezkwzrfpgwlgr.png"
            style={{ width: "6rem", height: "5rem" }}
            alt="Card image cap"
          />
          <div className="card-body">
            <h5 className="card-title mb-3">Authentication code</h5>
            <br />
            <input
              className="form-control mb-3"
              placeholder="XXXXXX"
              type="number"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            {formErrors.verificationCode && <div className="text-danger mt-1"><i className="bi bi-exclamation-triangle"></i> {formErrors.verificationCode}</div>}
            <br />
            <button className="btn btn-primary me-3" onClick={handleVerify2FA}>
              Verify
            </button>
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </div>
          <div className="card-footer">
            <p className="card-text">
              Open your two-factor authenticator (TOTP) app or browser extension
              to view your authentication code.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default TwoFactorAuthentication;
