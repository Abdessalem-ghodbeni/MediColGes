import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import Logout from "../Authentification/logout";
import "./Internaute.css";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { ethers } from "ethers";
import { base_url } from "../baseUrl";

import { useTheme } from "/src/Authentification/useTheme.jsx";
import { PieChartOutlined } from "@ant-design/icons";
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

function DashboardInternaute() {
  const [theme, setTheme] = useTheme();

  const location = useLocation();

  // Fonction pour déterminer si le chemin est actif
  const isActive = (path) => location.pathname.includes(path);

  const { logout } = Logout();

  const [user, setUser] = useState({});
  const [ethereumAddress, setEthereumAddress] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${base_url}/internaute/getById/${userId}`
        );
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  async function requestAccount() {
    // Check if Meta Mask Extension exists
    if (window.ethereum) {
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
        title: "You have connected to MetaMask.",
      });

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setEthereumAddress(accounts[0]);
        updateServerWithEthereumAddress(accounts[0]);
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
          title: "Error connecting...",
        });
      }
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
        title: "Please add the MetaMask extension to your browser.",
      });
    }
  }

  function updateServerWithEthereumAddress(rawEthereumAddress) {
    const userId = localStorage.getItem("USER_ID");
    const ethereumAddress = ethers.utils.getAddress(rawEthereumAddress);
    axios
      .post(`${base_url}/internaute/updateEthereumAddress/${userId}`, {
        ethereumAddress,
      })
      .then((response) => {
        console.log("Success:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <>
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
            {/* Profile and Notification START */}
            <ul className="nav flex-row align-items-center list-unstyled ms-xl-auto">
              {/* Notification dropdown START */}
              <li className="nav-item ms-0 ms-md-3 dropdown">
                {/* Notification button */}
                <a
                  className="nav-link p-0"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  data-bs-auto-close="outside"
                >
                  <i className="bi bi-bell fa-fw fs-5" />
                </a>
                {/* Notification dote */}
                <span className="notif-badge animation-blink" />
                {/* Notification dropdown menu START */}
                <div className="dropdown-menu dropdown-animation dropdown-menu-end dropdown-menu-size-md p-0 shadow-lg">
                  <div className="card bg-transparent">
                    {/* Card header */}
                    <div className="card-header bg-transparent d-flex justify-content-between align-items-center border-bottom">
                      <h6 className="m-0">
                        Notifications{" "}
                        <span className="badge bg-danger bg-opacity-10 text-danger ms-2">
                          4 new
                        </span>
                      </h6>
                      <a className="small">Clear all</a>
                    </div>
                    {/* Card body START */}
                    <div className="card-body p-0">
                      <ul className="list-group list-group-flush list-unstyled p-2">
                        {/* Notification item */}
                        <li>
                          <a className="list-group-item list-group-item-action rounded notif-unread border-0 mb-1 p-3">
                            <h6 className="mb-2">
                              New! Booking flights from New York ✈️
                            </h6>
                            <p className="mb-0 small">
                              Find the flexible ticket on flights around the
                              world. Start searching today
                            </p>
                            <span>Wednesday</span>
                          </a>
                        </li>
                        {/* Notification item */}
                        <li>
                          <a className="list-group-item list-group-item-action rounded border-0 mb-1 p-3">
                            <h6 className="mb-2">
                              Sunshine saving are here 🌞 save 30% or more on a
                              stay
                            </h6>
                            <span>15 Nov 2022</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                    {/* Card body END */}
                    {/* Card footer */}
                    <div className="card-footer bg-transparent text-center border-top">
                      <a className="btn btn-sm btn-link mb-0 p-0">
                        See all incoming activity
                      </a>
                    </div>
                  </div>
                </div>
                {/* Notification dropdown menu END */}
              </li>
              {/* Notification dropdown END */}
              {/* Profile dropdown START */}
              <li
                className="nav-item ms-3 dropdown"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-title="Click here"
              >
                {/* Avatar */}
                <a
                  className="avatar avatar-xs p-0"
                  id="profileDropdown"
                  role="button"
                  data-bs-auto-close="outside"
                  data-bs-display="static"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    className="avatar-img rounded-circle"
                    src={user.image}
                    alt="avatar"
                  />
                </a>
                {/* Profile dropdown START */}
                <ul
                  className="dropdown-menu dropdown-animation dropdown-menu-end shadow pt-3"
                  aria-labelledby="profileDropdown"
                >
                  {/* Profile info */}
                  <li className="px-3 mb-3">
                    <div className="d-flex align-items-center">
                      {/* Avatar */}
                      <div className="avatar me-3">
                        <img
                          className="avatar-img rounded-circle shadow"
                          src={user.image}
                          alt="avatar"
                        />
                      </div>
                      <div>
                        <a className="h6 mt-2 mt-sm-0">
                          {user.prenom} {user.nom}
                        </a>
                        <p className="small m-0">{user.email}</p>
                      </div>
                    </div>
                  </li>
                  {/* Links */}
                  <li>
                    {" "}
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={requestAccount}>
                      <img
                        className="me-2"
                        src="data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMTIiIGhlaWdodD0iMTg5IiB2aWV3Qm94PSIwIDAgMjEyIDE4OSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cG9seWdvbiBmaWxsPSIjQ0RCREIyIiBwb2ludHM9IjYwLjc1IDE3My4yNSA4OC4zMTMgMTgwLjU2MyA4OC4zMTMgMTcxIDkwLjU2MyAxNjguNzUgMTA2LjMxMyAxNjguNzUgMTA2LjMxMyAxODAgMTA2LjMxMyAxODcuODc1IDg5LjQzOCAxODcuODc1IDY4LjYyNSAxNzguODc1Ii8+PHBvbHlnb24gZmlsbD0iI0NEQkRCMiIgcG9pbnRzPSIxMDUuNzUgMTczLjI1IDEzMi43NSAxODAuNTYzIDEzMi43NSAxNzEgMTM1IDE2OC43NSAxNTAuNzUgMTY4Ljc1IDE1MC43NSAxODAgMTUwLjc1IDE4Ny44NzUgMTMzLjg3NSAxODcuODc1IDExMy4wNjMgMTc4Ljg3NSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjU2LjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjkwLjU2MyAxNTIuNDM4IDg4LjMxMyAxNzEgOTEuMTI1IDE2OC43NSAxMjAuMzc1IDE2OC43NSAxMjMuNzUgMTcxIDEyMS41IDE1Mi40MzggMTE3IDE0OS42MjUgOTQuNSAxNTAuMTg4Ii8+PHBvbHlnb24gZmlsbD0iI0Y4OUMzNSIgcG9pbnRzPSI3NS4zNzUgMjcgODguODc1IDU4LjUgOTUuMDYzIDE1MC4xODggMTE3IDE1MC4xODggMTIzLjc1IDU4LjUgMTM2LjEyNSAyNyIvPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTYuMzEzIDk2LjE4OCAuNTYzIDE0MS43NSAzOS45MzggMTM5LjUgNjUuMjUgMTM5LjUgNjUuMjUgMTE5LjgxMyA2NC4xMjUgNzkuMzEzIDU4LjUgODMuODEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi4zNzUgODcuMTg4IDEyNiA2NS4yNSAxMjAuMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSI0Ni4xMjUgMTAxLjgxMyA2NS4yNSAxMTkuODEzIDY1LjI1IDEzNy44MTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjY1LjI1IDEyMC4zNzUgODcuNzUgMTI2IDk1LjA2MyAxNTAuMTg4IDkwIDE1MyA2NS4yNSAxMzguMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSI2NS4yNSAxMzguMzc1IDYwLjc1IDE3My4yNSA5MC41NjMgMTUyLjQzOCIvPjxwb2x5Z29uIGZpbGw9IiNFQThFM0EiIHBvaW50cz0iOTIuMjUgMTAyLjM3NSA5NS4wNjMgMTUwLjE4OCA4Ni42MjUgMTI1LjcxOSIvPjxwb2x5Z29uIGZpbGw9IiNEODdDMzAiIHBvaW50cz0iMzkuMzc1IDEzOC45MzggNjUuMjUgMTM4LjM3NSA2MC43NSAxNzMuMjUiLz48cG9seWdvbiBmaWxsPSIjRUI4RjM1IiBwb2ludHM9IjEyLjkzOCAxODguNDM4IDYwLjc1IDE3My4yNSAzOS4zNzUgMTM4LjkzOCAuNTYzIDE0MS43NSIvPjxwb2x5Z29uIGZpbGw9IiNFODgyMUUiIHBvaW50cz0iODguODc1IDU4LjUgNjQuNjg4IDc4Ljc1IDQ2LjEyNSAxMDEuMjUgOTIuMjUgMTAyLjkzOCIvPjxwb2x5Z29uIGZpbGw9IiNERkNFQzMiIHBvaW50cz0iNjAuNzUgMTczLjI1IDkwLjU2MyAxNTIuNDM4IDg4LjMxMyAxNzAuNDM4IDg4LjMxMyAxODAuNTYzIDY4LjA2MyAxNzYuNjI1Ii8+PHBvbHlnb24gZmlsbD0iI0RGQ0VDMyIgcG9pbnRzPSIxMjEuNSAxNzMuMjUgMTUwLjc1IDE1Mi40MzggMTQ4LjUgMTcwLjQzOCAxNDguNSAxODAuNTYzIDEyOC4yNSAxNzYuNjI1IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyNzIuMjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjcwLjMxMyAxMTIuNSA2NC4xMjUgMTI1LjQzOCA4Ni4wNjMgMTE5LjgxMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMTUwLjE4OCAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFODhGMzUiIHBvaW50cz0iMTIuMzc1IC41NjMgODguODc1IDU4LjUgNzUuOTM4IDI3Ii8+PHBhdGggZmlsbD0iIzhFNUEzMCIgZD0iTTEyLjM3NTAwMDIsMC41NjI1MDAwMDggTDIuMjUwMDAwMDMsMzEuNTAwMDAwNSBMNy44NzUwMDAxMiw2NS4yNTAwMDEgTDMuOTM3NTAwMDYsNjcuNTAwMDAxIEw5LjU2MjUwMDE0LDcyLjU2MjUgTDUuMDYyNTAwMDgsNzYuNTAwMDAxMSBMMTEuMjUsODIuMTI1MDAxMiBMNy4zMTI1MDAxMSw4NS41MDAwMDEzIEwxNi4zMTI1MDAyLDk2Ljc1MDAwMTQgTDU4LjUwMDAwMDksODMuODEyNTAxMiBDNzkuMTI1MDAxMiw2Ny4zMTI1MDA0IDg5LjI1MDAwMTMsNTguODc1MDAwMyA4OC44NzUwMDEzLDU4LjUwMDAwMDkgQzg4LjUwMDAwMTMsNTguMTI1MDAwOSA2My4wMDAwMDA5LDM4LjgxMjUwMDYgMTIuMzc1MDAwMiwwLjU2MjUwMDAwOCBaIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjExLjUgMCkiPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTYuMzEzIDk2LjE4OCAuNTYzIDE0MS43NSAzOS45MzggMTM5LjUgNjUuMjUgMTM5LjUgNjUuMjUgMTE5LjgxMyA2NC4xMjUgNzkuMzEzIDU4LjUgODMuODEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi4zNzUgODcuMTg4IDEyNiA2NS4yNSAxMjAuMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSI0Ni4xMjUgMTAxLjgxMyA2NS4yNSAxMTkuODEzIDY1LjI1IDEzNy44MTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjY1LjI1IDEyMC4zNzUgODcuNzUgMTI2IDk1LjA2MyAxNTAuMTg4IDkwIDE1MyA2NS4yNSAxMzguMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSI2NS4yNSAxMzguMzc1IDYwLjc1IDE3My4yNSA5MCAxNTMiLz48cG9seWdvbiBmaWxsPSIjRUE4RTNBIiBwb2ludHM9IjkyLjI1IDEwMi4zNzUgOTUuMDYzIDE1MC4xODggODYuNjI1IDEyNS43MTkiLz48cG9seWdvbiBmaWxsPSIjRDg3QzMwIiBwb2ludHM9IjM5LjM3NSAxMzguOTM4IDY1LjI1IDEzOC4zNzUgNjAuNzUgMTczLjI1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSIxMi45MzggMTg4LjQzOCA2MC43NSAxNzMuMjUgMzkuMzc1IDEzOC45MzggLjU2MyAxNDEuNzUiLz48cG9seWdvbiBmaWxsPSIjRTg4MjFFIiBwb2ludHM9Ijg4Ljg3NSA1OC41IDY0LjY4OCA3OC43NSA0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi45MzgiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjcwLjMxMyAxMTIuNSA2NC4xMjUgMTI1LjQzOCA4Ni4wNjMgMTE5LjgxMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMTUwLjE4OCAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFODhGMzUiIHBvaW50cz0iMTIuMzc1IC41NjMgODguODc1IDU4LjUgNzUuOTM4IDI3Ii8+PHBhdGggZmlsbD0iIzhFNUEzMCIgZD0iTTEyLjM3NTAwMDIsMC41NjI1MDAwMDggTDIuMjUwMDAwMDMsMzEuNTAwMDAwNSBMNy44NzUwMDAxMiw2NS4yNTAwMDEgTDMuOTM3NTAwMDYsNjcuNTAwMDAxIEw5LjU2MjUwMDE0LDcyLjU2MjUgTDUuMDYyNTAwMDgsNzYuNTAwMDAxMSBMMTEuMjUsODIuMTI1MDAxMiBMNy4zMTI1MDAxMSw4NS41MDAwMDEzIEwxNi4zMTI1MDAyLDk2Ljc1MDAwMTQgTDU4LjUwMDAwMDksODMuODEyNTAxMiBDNzkuMTI1MDAxMiw2Ny4zMTI1MDA0IDg5LjI1MDAwMTMsNTguODc1MDAwMyA4OC44NzUwMDEzLDU4LjUwMDAwMDkgQzg4LjUwMDAwMTMsNTguMTI1MDAwOSA2My4wMDAwMDA5LDM4LjgxMjUwMDYgMTIuMzc1MDAwMiwwLjU2MjUwMDAwOCBaIi8+PC9nPjwvZz48L3N2Zz4="
                        style={{ width: "25px", height: "25px" }}
                      />{" "}
                      Connect to MetaMask
                    </button>
                  </li>
                  {/* Links */}
                  <li>
                    {" "}
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link
                      to="profile"
                      className={`dropdown-item ${
                        isActive("profile") ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-person fa-fw me-2"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="editProfile"
                      className={`dropdown-item ${
                        isActive("editProfile") ? "active" : ""
                      }`}
                    >
                      <i className="bi bi-gear fa-fw me-2"></i> Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item bg-danger-soft-hover"
                      onClick={logout}
                    >
                      <i className="bi bi-power fa-fw me-2" />
                      Sign Out
                    </button>
                  </li>
                  <li>
                    {" "}
                    <hr className="dropdown-divider" />
                  </li>
                  {/* Dark mode options START */}
                  <li>
                    <div className="nav-pills-primary-soft theme-icon-active d-flex align-items-center p-2 pb-0">
                      <span className="me-5">Mode:</span>
                      <button
                        type="button"
                        className={`btn btn-link nav-link text-primary-hover  me-3 mb-0 p-0 ${
                          theme === "light" ? "active" : ""
                        }`}
                        data-bs-theme-value="light"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-title="Light"
                        onClick={() => setTheme("light")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={16}
                          height={16}
                          fill="currentColor"
                          className="bi bi-sun fa-fw mode-switch"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                          <use />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className={`btn btn-link nav-link text-primary-hover mb-0 p-0 ${
                          theme === "dark" ? "active" : ""
                        }`}
                        data-bs-theme-value="dark"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-title="Dark"
                        onClick={() => setTheme("dark")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={16}
                          height={16}
                          fill="currentColor"
                          className="bi bi-moon-stars fa-fw mode-switch"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                          <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                          <use />
                        </svg>
                      </button>
                    </div>
                  </li>
                  {/* Dark mode options END*/}
                </ul>
                {/* Profile dropdown END */}
              </li>
              {/* Profile dropdown END */}
            </ul>
            {/* Profile and Notification START */}
          </div>
        </nav>
        {/* Logo Nav END */}
      </header>
      {/* Header END */}
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        {/* =======================
Menu item START */}
        <section className="pt-4">
          <div className="container">
            <div className="card rounded-3 border p-3 pb-2">
              {/* Avatar and info START */}
              <div className="d-sm-flex align-items-center">
                <div className="avatar avatar-xl mb-2 mb-sm-0">
                  <img className="avatar-img rounded-circle" src={user.image} />
                </div>
                <h4 className="mb-2 mb-sm-0 ms-sm-3">
                  <span className="fw-light">Hi</span> {user.prenom} {user.nom}
                </h4>
                <a
                  className="btn btn-sm btn-primary-soft mb-0 ms-auto flex-shrink-0"
                  onClick={() => navigate("/internaute/add/project")}
                >
                  <i className="bi bi-plus-lg fa-fw me-2" />
                  Ajouter Projet
                </a>
              </div>
              {/* Avatar and info START */}
              {/* Responsive navbar toggler */}
              <button
                className="btn btn-primary w-100 d-block d-xl-none mt-2"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#dashboardMenu"
                aria-controls="dashboardMenu"
              >
                <i className="bi bi-list" /> Dashboard Menu
              </button>
              {/* Nav links START */}
              <div
                className="offcanvas-xl offcanvas-end mt-xl-3"
                tabIndex={-1}
                id="dashboardMenu"
              >
                <div className="offcanvas-header border-bottom p-3">
                  <h5 className="offcanvas-title">Menu</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    data-bs-target="#dashboardMenu"
                    aria-label="Close"
                  />
                </div>
                {/* Offcanvas body */}
                <div className="offcanvas-body p-3 p-xl-0">
                  {/* Nav item */}
                  <div className="navbar navbar-expand-xl">
                    <ul className="navbar-nav navbar-offcanvas-menu">
                      <li className="nav-item">
                        {" "}
                        <a
                          className="nav-link active"
                          onClick={() => navigate("/internaute/profile")}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="bi bi-house-door fa-fw me-1" />
                          Dashboard
                        </a>{" "}
                      </li>
                      {/* <li className="nav-item">
                        {" "}
                        <a
                          className="nav-link"
                          onClick={() => navigate("/internaute/listForms")}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="bi bi-journals fa-fw me-1" />
                          Listings
                        </a>{" "}
                      </li> */}
                      <li className="nav-item dropdown">
                        <a
                          className="nav-link dropdown-toggle"
                          href="#"
                          id="dropdoanMenu"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i className="bi bi-list-ul fa-fw me-1" />
                          Listings
                        </a>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdoanMenu"
                        >
                          <li className="nav-item">
                            {" "}
                            <a
                              className={`nav-link ${
                                isActive("listForms") ? "active" : ""
                              }`}
                              onClick={() => navigate("listForms")}
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-journals fa-fw me-1" />
                              Liste Formulaires
                            </a>{" "}
                          </li>
                          <li className="nav-item">
                            {" "}
                            <a
                              className={`nav-link ${
                                isActive("invitations/projects") ? "active" : ""
                              }`}
                              onClick={() => navigate("invitations/projects")}
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-journals fa-fw me-1" />
                              Projets &supervison
                            </a>{" "}
                          </li>
                          <li className="nav-item">
                            {" "}
                            <a
                              className={`nav-link ${
                                isActive("liste") ? "active" : ""
                              }`}
                              onClick={() => navigate("liste")}
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-journals fa-fw me-1" />
                              Mes Projets
                            </a>{" "}
                          </li>

                          <li className="nav-item">
                            {" "}
                            <a
                              className={`nav-link ${
                                isActive("response/liste") ? "active" : ""
                              }`}
                              onClick={() => navigate("response/liste")}
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-journals fa-fw me-1" />
                              Réponses
                            </a>{" "}
                          </li>
                        </ul>
                      </li>
                      <li className="nav-item">
                        {" "}
                        <a
                          className={`nav-link ${
                            isActive("addForm") ? "active" : ""
                          }`}
                          onClick={() => navigate("addForm")}
                          style={{ cursor: "pointer" }}
                        >
                          <PlusOutlined className="mx-1" />
                          Add Forms
                        </a>{" "}
                      </li>
                      <li>
                        {" "}
                        <Link
                          to="dataManagement"
                          className={`nav-link ${
                            isActive("dataManagement") ? "active" : ""
                          }`}
                        >
                          <i className="bi bi-card-heading fa-fw me-1"></i> Data
                          Managment
                        </Link>{" "}
                      </li>
                      <li>
                        {" "}
                        <Link
                          to="chat"
                          className={`nav-link ${
                            isActive("chat") ? "active" : ""
                          }`}
                        >
                          <i className="bi bi-chat-dots fa-fw me-1"></i> Chats
                        </Link>{" "}
                      </li>
                      <li>
                        {" "}
                        <Link
                          to="listPublication"
                          className={`nav-link ${
                            isActive("listPublication") ? "active" : ""
                          }`}
                        >
                          <i className="bi bi-card-heading fa-fw me-1"></i>{" "}
                          Publications
                        </Link>{" "}
                      </li>

                      <li>
                        {" "}
                        <Link
                          to="statiqtiques/views"
                          className={`nav-link ${
                            isActive("statiqtiques/views") ? "active" : ""
                          }`}
                        >
                          <PieChartOutlined
                            className="mx-2"
                            style={{ fontSize: "1.2rem" }}
                          />
                          Statistique
                        </Link>{" "}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Nav links END */}
            </div>
          </div>
        </section>
        {/* =======================
Menu item END */}
        {/* =======================
Content START */}
        <Outlet></Outlet>
        {/* =======================
Content END */}
      </main>
      {/* **************** MAIN CONTENT END **************** */}
      {/* =======================
Footer START */}
      <footer className="bg-dark p-3">
        <div className="container">
          <div className="row align-items-center">
            {/* Widget */}
            <div className="col-md-4">
              <div className="text-center text-md-start mb-3 mb-md-0">
                <a>
                  {" "}
                  <img
                    src="assets/images/logo.png"
                    style={{ height: "75px" }}
                    alt="logo"
                  />{" "}
                </a>
              </div>
            </div>
            {/* Widget */}
            <div className="col-md-8">
              <div className="text-center text-body-secondary text-primary-hover mb-3">
                {" "}
                Copyrights ©2024 CoMediC. Build by{" "}
                <a href="https://esprit.tn/" className="text-body-secondary">
                  ESPRIT
                </a>
                .{" "}
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* =======================
Footer END */}
    </>
  );
}

export default DashboardInternaute;
