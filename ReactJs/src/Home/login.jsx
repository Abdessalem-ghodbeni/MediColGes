import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { base_url } from "../baseUrl";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const isTwoFactorEnabled = JSON.parse(
    localStorage.getItem("isTwoFactorEnabled")
  );
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validateForm = () => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    
    if (!email) {
      errors.email = "Email address is required";
    } else if (!regex.test(email)) {
      errors.email = "Email address is invalid";
    }
  
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${base_url}/authentification/login`, {
        email: email,
        password: password,
      });

      localStorage.setItem("USER_ID", response.data.data.data._id);
      localStorage.setItem("USER_ROLE", response.data.data.data.__t);
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem(
        "isTwoFactorEnabled",
        response.data.data.data.isTwoFactorEnabled
      );
      localStorage.setItem(
        "twoFactorQrCode",
        response.data.data.data.twoFactorQrCode
      );

      localStorage.setItem(
        "updateProfile",
        response.data.data.data.updateProfile
      );

      localStorage.setItem("USER", JSON.stringify(response.data));

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
        title: "Welcome",
      });

      localStorage.setItem("twoFactorVerified", "false");

      // Vérification si la 2FA est activée pour l'utilisateur
      if (JSON.parse(response.data.data.data.isTwoFactorEnabled)) {
        // Si la 2FA est activée, redirigez vers la page de vérification 2FA
        navigate("/twoFactorAuthentication");
      } else {
        // Si la 2FA n'est pas activée, redirigez en fonction du rôle de l'utilisateur
        if (response.data.data.data.__t === "superAdmin") {
          navigate("/superAdmin/dashboard");
        } else if (response.data.data.data.__t === "internautes") {
          navigate("/internaute/profile");
        } else {
          navigate("/patient/profile");
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
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
          title: error.response.data.message,
        });
      } else {
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
      }
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
                    <div className="col-lg-6 d-flex align-items-center order-2 order-lg-1">
                      <div className="p-3 p-lg-5">
                        <img src="assets/images/element/signin.svg" />
                      </div>
                      {/* Divider */}
                      <div className="vr opacity-1 d-none d-lg-block" />
                    </div>
                    {/* Information */}
                    <div className="col-lg-6 order-1">
                      <div className="p-4 p-sm-7">
                        {/* Logo */}
                        {/* Title */}
                        <h1 className="mb-2 h3">Welcome back</h1>
                        <p className="mb-0">
                          New here?
                          <Link to="/register"> Create an account</Link>
                        </p>
                        {/* Form START */}
                        <form
                          className="mt-4 text-start"
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
                          {/* Password */}
                          <div className="mb-3 position-relative">
                            <label htmlFor="psw-input" className="form-label">
                              Password
                            </label>
                            <input
                              className="form-control fakepassword"
                              type={isPasswordVisible ? "text" : "password"}
                              id="psw-input"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
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
                          {/* Remember me */}
                          <div className="mb-3 d-sm-flex justify-content-between">
                            <Link to="/forgotPassword">Forgot password?</Link>
                          </div>
                          {/* Button */}
                          <div>
                            <button
                              type="submit"
                              className="btn btn-primary w-100 mb-0"
                            >
                              Login
                            </button>
                          </div>
                          {/* Divider */}
                          <div className="position-relative my-4">
                            <hr />
                            <p className="small bg-mode position-absolute top-50 start-50 translate-middle px-2"></p>
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

export default Login;
