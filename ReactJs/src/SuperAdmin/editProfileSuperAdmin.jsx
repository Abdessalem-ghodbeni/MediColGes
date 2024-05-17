import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ethers } from "ethers";
import { base_url } from "../baseUrl";
import ReactPlayer from "react-player";

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

function EditProfileSuperAdmin() {
  const [user, setUser] = useState({});
  const [gall, setGall] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [ethereumAddress, setEthereumAddress] = useState("");
  const [ethereumPrivateKey, setEthereumPrivateKey] = useState("");

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const userId = localStorage.getItem("USER_ID");

    try {
      const response = await axios.get(
        `${base_url}/superAdmin/getById/${userId}`
      );
      setUser({
        ...response.data.data,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const onchange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateProfile = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!user.nom.trim()) errors.nom = "Last name is required.";
    if (!user.prenom.trim()) errors.prenom = "First name is required.";
    if (!user.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(user.email)) {
      errors.email = "Email is not valid.";
    }
    if (!user.telephone.trim()) errors.telephone = "Phone number is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    let errors = {};

    if (!user.oldPassword) {
      errors.oldPassword = "Current Password is required";
    } else if (user.oldPassword.length < 6) {
      errors.oldPassword = "Current Password must be at least 6 characters";
    }

    if (!user.newPassword) {
      errors.newPassword = "New Password is required";
    } else if (user.newPassword.length < 6) {
      errors.newPassword = "New Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEthereumPrivateKey = () => {
    let errors = {};

    if (!ethereumPrivateKey) {
      errors.ethereumPrivateKey = "Ethereum Private Key is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Retourne true si aucune erreur
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    const userId = localStorage.getItem("USER_ID");

    const formData = new FormData();
    formData.append("nom", user?.nom);
    formData.append("prenom", user?.prenom);
    formData.append("telephone", user?.telephone);
    formData.append("email", user?.email);
    for (let i = 0; i < gall.length; i++) {
      formData.append("photo", gall[i]);
    }

    axios
      .put(`${base_url}/superAdmin/update/${userId}`, formData)
      .then((res) => {
        const currentUser = JSON.parse(localStorage.getItem("USER"));
        const updatedUser = res.data;
        const newUser = { ...currentUser, ...updatedUser };

        localStorage.setItem("USER", JSON.stringify(newUser));
        console.log(res.data);

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
          title: "Your profile has been successfully updated.",
        });

        fetchProfileData();
      })
      .catch((err) => {
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
          title: "An error occurred, please try again later.",
        });
        console.log(err);
      });
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    const userId = localStorage.getItem("USER_ID");

    // Préparer le corps de la requête au format JSON
    const dataToSend = {
      oldPassword: user.oldPassword,
      newPassword: user.newPassword,
    };

    axios
      .put(`${base_url}/superAdmin/updatePassword/${userId}`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
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
          title: "Your password has been successfully updated.",
        });

        setUser({ ...user, oldPassword: "", newPassword: "" });
      })
      .catch((err) => {
        if (
          err.response &&
          err.response.status === 400 &&
          err.response.data.message === "Old password is incorrect"
        ) {
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
            title: "Old password is incorrect.",
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
            title: "An error occurred, please try again later.",
          });

          console.log(err);
        }
      });
  };

  const handleImage = (e) => {
    setGall(e.target.files);
  };

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
        console.error("Error connecting to MetaMask", error);
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
      .post(`${base_url}/superAdmin/updateEthereumAddress/${userId}`, {
        ethereumAddress,
      })
      .then((response) => {
        console.log("Success:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const handleSaveEthereumPrivateKey = async (event) => {
    event.preventDefault();
    if (!validateEthereumPrivateKey()) return;
    const userId = localStorage.getItem("USER_ID");

    try {
      const response = await axios.post(
        `${base_url}/superAdmin/updateEthereumPrivateKey/${userId}`,
        {
          ethereumPrivateKey: ethereumPrivateKey,
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
        title: "Private key updated successfully!",
      });
      console.log(response.data);
      setEthereumPrivateKey("");
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
        title: "Failed to update private key.",
      });
      console.error("Error:", error.response);
    }
  };

  return (
    <>
      <div className="page-content-wrapper p-xxl-4">
        {/* Title */}
        <div className="row">
          <div className="col-12 mb-4 mb-sm-5">
            <h1 className="h3 mb-0">
              <i className="bi bi-gear fa-fw me-1"></i>Settings
            </h1>
          </div>
        </div>

        <div>
          {/* Tabs START */}
          <div className="row g-4 mb-4">
            <div className="col-12">
              <div className="bg-light pb-0 px-2 px-lg-0 rounded-top">
                <ul
                  className="nav nav-tabs nav-bottom-line nav-responsive border-0 nav-justified"
                  role="tablist"
                >
                  <li className="nav-item">
                    {" "}
                    <a
                      className="nav-link mb-0 active"
                      data-bs-toggle="tab"
                      href="#tab-1"
                    >
                      <i className="fas fa-address-card fa-fw me-2" />
                      Edit Profile
                    </a>{" "}
                  </li>
                  <li className="nav-item">
                    {" "}
                    <a
                      className="nav-link mb-0"
                      data-bs-toggle="tab"
                      href="#tab-2"
                    >
                      <i className="fas fa-key fa-fw me-2" />
                      Edit Password
                    </a>{" "}
                  </li>
                  <li className="nav-item">
                    {" "}
                    <a
                      className="nav-link mb-0"
                      data-bs-toggle="tab"
                      href="#tab-4"
                    >
                      <img
                        className="me-2"
                        src="data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMTIiIGhlaWdodD0iMTg5IiB2aWV3Qm94PSIwIDAgMjEyIDE4OSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cG9seWdvbiBmaWxsPSIjQ0RCREIyIiBwb2ludHM9IjYwLjc1IDE3My4yNSA4OC4zMTMgMTgwLjU2MyA4OC4zMTMgMTcxIDkwLjU2MyAxNjguNzUgMTA2LjMxMyAxNjguNzUgMTA2LjMxMyAxODAgMTA2LjMxMyAxODcuODc1IDg5LjQzOCAxODcuODc1IDY4LjYyNSAxNzguODc1Ii8+PHBvbHlnb24gZmlsbD0iI0NEQkRCMiIgcG9pbnRzPSIxMDUuNzUgMTczLjI1IDEzMi43NSAxODAuNTYzIDEzMi43NSAxNzEgMTM1IDE2OC43NSAxNTAuNzUgMTY4Ljc1IDE1MC43NSAxODAgMTUwLjc1IDE4Ny44NzUgMTMzLjg3NSAxODcuODc1IDExMy4wNjMgMTc4Ljg3NSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjU2LjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjkwLjU2MyAxNTIuNDM4IDg4LjMxMyAxNzEgOTEuMTI1IDE2OC43NSAxMjAuMzc1IDE2OC43NSAxMjMuNzUgMTcxIDEyMS41IDE1Mi40MzggMTE3IDE0OS42MjUgOTQuNSAxNTAuMTg4Ii8+PHBvbHlnb24gZmlsbD0iI0Y4OUMzNSIgcG9pbnRzPSI3NS4zNzUgMjcgODguODc1IDU4LjUgOTUuMDYzIDE1MC4xODggMTE3IDE1MC4xODggMTIzLjc1IDU4LjUgMTM2LjEyNSAyNyIvPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTYuMzEzIDk2LjE4OCAuNTYzIDE0MS43NSAzOS45MzggMTM5LjUgNjUuMjUgMTM5LjUgNjUuMjUgMTE5LjgxMyA2NC4xMjUgNzkuMzEzIDU4LjUgODMuODEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi4zNzUgODcuMTg4IDEyNiA2NS4yNSAxMjAuMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSI0Ni4xMjUgMTAxLjgxMyA2NS4yNSAxMTkuODEzIDY1LjI1IDEzNy44MTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjY1LjI1IDEyMC4zNzUgODcuNzUgMTI2IDk1LjA2MyAxNTAuMTg4IDkwIDE1MyA2NS4yNSAxMzguMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSI2NS4yNSAxMzguMzc1IDYwLjc1IDE3My4yNSA5MC41NjMgMTUyLjQzOCIvPjxwb2x5Z29uIGZpbGw9IiNFQThFM0EiIHBvaW50cz0iOTIuMjUgMTAyLjM3NSA5NS4wNjMgMTUwLjE4OCA4Ni42MjUgMTI1LjcxOSIvPjxwb2x5Z29uIGZpbGw9IiNEODdDMzAiIHBvaW50cz0iMzkuMzc1IDEzOC45MzggNjUuMjUgMTM4LjM3NSA2MC43NSAxNzMuMjUiLz48cG9seWdvbiBmaWxsPSIjRUI4RjM1IiBwb2ludHM9IjEyLjkzOCAxODguNDM4IDYwLjc1IDE3My4yNSAzOS4zNzUgMTM4LjkzOCAuNTYzIDE0MS43NSIvPjxwb2x5Z29uIGZpbGw9IiNFODgyMUUiIHBvaW50cz0iODguODc1IDU4LjUgNjQuNjg4IDc4Ljc1IDQ2LjEyNSAxMDEuMjUgOTIuMjUgMTAyLjkzOCIvPjxwb2x5Z29uIGZpbGw9IiNERkNFQzMiIHBvaW50cz0iNjAuNzUgMTczLjI1IDkwLjU2MyAxNTIuNDM4IDg4LjMxMyAxNzAuNDM4IDg4LjMxMyAxODAuNTYzIDY4LjA2MyAxNzYuNjI1Ii8+PHBvbHlnb24gZmlsbD0iI0RGQ0VDMyIgcG9pbnRzPSIxMjEuNSAxNzMuMjUgMTUwLjc1IDE1Mi40MzggMTQ4LjUgMTcwLjQzOCAxNDguNSAxODAuNTYzIDEyOC4yNSAxNzYuNjI1IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyNzIuMjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjcwLjMxMyAxMTIuNSA2NC4xMjUgMTI1LjQzOCA4Ni4wNjMgMTE5LjgxMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMTUwLjE4OCAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFODhGMzUiIHBvaW50cz0iMTIuMzc1IC41NjMgODguODc1IDU4LjUgNzUuOTM4IDI3Ii8+PHBhdGggZmlsbD0iIzhFNUEzMCIgZD0iTTEyLjM3NTAwMDIsMC41NjI1MDAwMDggTDIuMjUwMDAwMDMsMzEuNTAwMDAwNSBMNy44NzUwMDAxMiw2NS4yNTAwMDEgTDMuOTM3NTAwMDYsNjcuNTAwMDAxIEw5LjU2MjUwMDE0LDcyLjU2MjUgTDUuMDYyNTAwMDgsNzYuNTAwMDAxMSBMMTEuMjUsODIuMTI1MDAxMiBMNy4zMTI1MDAxMSw4NS41MDAwMDEzIEwxNi4zMTI1MDAyLDk2Ljc1MDAwMTQgTDU4LjUwMDAwMDksODMuODEyNTAxMiBDNzkuMTI1MDAxMiw2Ny4zMTI1MDA0IDg5LjI1MDAwMTMsNTguODc1MDAwMyA4OC44NzUwMDEzLDU4LjUwMDAwMDkgQzg4LjUwMDAwMTMsNTguMTI1MDAwOSA2My4wMDAwMDA5LDM4LjgxMjUwMDYgMTIuMzc1MDAwMiwwLjU2MjUwMDAwOCBaIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjExLjUgMCkiPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTYuMzEzIDk2LjE4OCAuNTYzIDE0MS43NSAzOS45MzggMTM5LjUgNjUuMjUgMTM5LjUgNjUuMjUgMTE5LjgxMyA2NC4xMjUgNzkuMzEzIDU4LjUgODMuODEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi4zNzUgODcuMTg4IDEyNiA2NS4yNSAxMjAuMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSI0Ni4xMjUgMTAxLjgxMyA2NS4yNSAxMTkuODEzIDY1LjI1IDEzNy44MTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjY1LjI1IDEyMC4zNzUgODcuNzUgMTI2IDk1LjA2MyAxNTAuMTg4IDkwIDE1MyA2NS4yNSAxMzguMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSI2NS4yNSAxMzguMzc1IDYwLjc1IDE3My4yNSA5MCAxNTMiLz48cG9seWdvbiBmaWxsPSIjRUE4RTNBIiBwb2ludHM9IjkyLjI1IDEwMi4zNzUgOTUuMDYzIDE1MC4xODggODYuNjI1IDEyNS43MTkiLz48cG9seWdvbiBmaWxsPSIjRDg3QzMwIiBwb2ludHM9IjM5LjM3NSAxMzguOTM4IDY1LjI1IDEzOC4zNzUgNjAuNzUgMTczLjI1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSIxMi45MzggMTg4LjQzOCA2MC43NSAxNzMuMjUgMzkuMzc1IDEzOC45MzggLjU2MyAxNDEuNzUiLz48cG9seWdvbiBmaWxsPSIjRTg4MjFFIiBwb2ludHM9Ijg4Ljg3NSA1OC41IDY0LjY4OCA3OC43NSA0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi45MzgiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjcwLjMxMyAxMTIuNSA2NC4xMjUgMTI1LjQzOCA4Ni4wNjMgMTE5LjgxMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMTUwLjE4OCAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFODhGMzUiIHBvaW50cz0iMTIuMzc1IC41NjMgODguODc1IDU4LjUgNzUuOTM4IDI3Ii8+PHBhdGggZmlsbD0iIzhFNUEzMCIgZD0iTTEyLjM3NTAwMDIsMC41NjI1MDAwMDggTDIuMjUwMDAwMDMsMzEuNTAwMDAwNSBMNy44NzUwMDAxMiw2NS4yNTAwMDEgTDMuOTM3NTAwMDYsNjcuNTAwMDAxIEw5LjU2MjUwMDE0LDcyLjU2MjUgTDUuMDYyNTAwMDgsNzYuNTAwMDAxMSBMMTEuMjUsODIuMTI1MDAxMiBMNy4zMTI1MDAxMSw4NS41MDAwMDEzIEwxNi4zMTI1MDAyLDk2Ljc1MDAwMTQgTDU4LjUwMDAwMDksODMuODEyNTAxMiBDNzkuMTI1MDAxMiw2Ny4zMTI1MDA0IDg5LjI1MDAwMTMsNTguODc1MDAwMyA4OC44NzUwMDEzLDU4LjUwMDAwMDkgQzg4LjUwMDAwMTMsNTguMTI1MDAwOSA2My4wMDAwMDA5LDM4LjgxMjUwMDYgMTIuMzc1MDAwMiwwLjU2MjUwMDAwOCBaIi8+PC9nPjwvZz48L3N2Zz4="
                        style={{ width: "20px", height: "20px" }}
                      />{" "}
                      MetaMask
                    </a>{" "}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Tabs END */}
          {/* Tabs Content START */}
          <div className="row g-4">
            <div className="col-12">
              <div className="tab-content">
                {/* Tab content 1 START */}
                <div className="tab-pane show active" id="tab-1">
                  <div className="row g-4">
                    {/* Edit profile START */}
                    <div className="col-lg-12">
                      <div className="card shadow">
                        <div className="card-header border-bottom">
                          <h5 className="card-header-title">
                            Personal Information
                          </h5>
                        </div>
                        <form
                          onSubmit={handleProfileUpdate}
                          className="card-body row g-3"
                        >
                          {/* Profile picture */}
                          <div className="mb-3">
                            <label className="form-label">
                              Upload your profile photo
                              <span className="text-danger">*</span>
                            </label>
                            {/* Avatar upload START */}
                            <div className="d-flex align-items-center">
                              <label
                                className="position-relative me-4"
                                htmlFor="uploadfile-1"
                                title="Replace this pic"
                              >
                                {/* Avatar place holder */}
                                <span className="avatar avatar-xl">
                                  <img
                                    id="uploadfile-1-preview"
                                    className="avatar-img rounded-circle border border-white border-3 shadow"
                                    src={user.image}
                                  />
                                </span>
                              </label>
                              {/* Upload button */}
                              <label
                                className="btn btn-sm btn-primary-soft mb-0"
                                htmlFor="uploadfile-1"
                              >
                                Change
                              </label>
                              <input
                                id="uploadfile-1"
                                className="form-control d-none"
                                type="file"
                                name="image"
                                onChange={handleImage}
                              />
                            </div>
                            {/* Avatar upload END */}
                          </div>
                          {/* First Name */}
                          <div className="col-md-6">
                            <label className="form-label">
                              First name<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="prenom"
                              value={user.prenom || ""}
                              onChange={onchange}
                            />
                            {formErrors.prenom && (
                              <div className="text-danger mt-1">
                                <i className="bi bi-exclamation-triangle"></i>{" "}
                                {formErrors.prenom}
                              </div>
                            )}
                          </div>
                          {/* Last Name */}
                          <div className="col-md-6">
                            <label className="form-label">
                              Last name<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="nom"
                              value={user.nom || ""}
                              onChange={onchange}
                            />
                            {formErrors.nom && (
                              <div className="text-danger mt-1">
                                <i className="bi bi-exclamation-triangle"></i>{" "}
                                {formErrors.nom}
                              </div>
                            )}
                          </div>
                          {/* Email id */}
                          <div className="col-md-6">
                            <label className="form-label">
                              Email address
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              value={user.email || ""}
                              onChange={onchange}
                            />
                            {formErrors.email && (
                              <div className="text-danger mt-1">
                                <i className="bi bi-exclamation-triangle"></i>{" "}
                                {formErrors.email}
                              </div>
                            )}
                          </div>
                          {/* Mobile number */}
                          <div className="col-md-6">
                            <label className="form-label">
                              Phone number
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="telephone"
                              value={user.telephone || ""}
                              onChange={onchange}
                            />
                            {formErrors.telephone && (
                              <div className="text-danger mt-1">
                                <i className="bi bi-exclamation-triangle"></i>{" "}
                                {formErrors.telephone}
                              </div>
                            )}
                          </div>
                          {/* Save button */}
                          <div className="d-flex justify-content-end mt-4">
                            <button type="submit" className="btn btn-primary">
                              Save change
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    {/* Edit profile END */}
                  </div>
                </div>
                {/* Tab content 1 END */}
                {/* Tab content 2 START */}
                <div className="tab-pane" id="tab-2">
                  <div className="col-lg-12">
                    <div className="card shadow">
                      <div className="card-header border-bottom">
                        <h5 className="card-header-title">Update Password</h5>
                      </div>
                      {/* Card body START */}
                      <form
                        className="card-body"
                        onSubmit={handlePasswordUpdate}
                      >
                        {/* Old password */}
                        <div className="mb-3">
                          <label htmlFor="pswo-input" className="form-label">
                            {" "}
                            Current password
                            <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <input
                              className="form-control fakepassword"
                              type={isPasswordVisible ? "text" : "password"}
                              id="pswo-input"
                              name="oldPassword"
                              value={user.oldPassword || ""}
                              onChange={onchange}
                            />
                            <span
                              className="input-group-text p-0 bg-transparent"
                              onClick={togglePasswordVisibility}
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className={`fakepasswordicon fas ${
                                  isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                                } cursor-pointer p-2`}
                              />
                            </span>
                          </div>
                          {formErrors.oldPassword && (
                            <div className="text-danger mt-1">
                              <i className="bi bi-exclamation-triangle"></i>{" "}
                              {formErrors.oldPassword}
                            </div>
                          )}
                        </div>
                        {/* New password */}
                        <div className="mb-3">
                          <label htmlFor="psw-input" className="form-label">
                            {" "}
                            Enter new password
                            <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <input
                              className="form-control fakepassword"
                              type={isPasswordVisible ? "text" : "password"}
                              id="psw-input"
                              name="newPassword"
                              value={user.newPassword || ""}
                              onChange={onchange}
                            />
                            <span
                              className="input-group-text p-0 bg-transparent"
                              onClick={togglePasswordVisibility}
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className={`fakepasswordicon fas ${
                                  isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                                } cursor-pointer p-2`}
                              />
                            </span>
                          </div>
                          {formErrors.newPassword && (
                            <div className="text-danger mt-1">
                              <i className="bi bi-exclamation-triangle"></i>{" "}
                              {formErrors.newPassword}
                            </div>
                          )}
                        </div>
                        <div className="text-end mt-3">
                          <button
                            type="submit"
                            className="btn btn-primary mb-0"
                          >
                            Change Password
                          </button>
                        </div>
                      </form>
                      {/* Card body END */}
                    </div>
                  </div>
                </div>
                {/* Tab content 2 END */}
                {/* Tab content 4 START */}
                <div className="tab-pane" id="tab-4">
                  <div className="col-lg-12">
                    <div className="card shadow">
                      <div className="card-header border-bottom">
                        <h5 className="card-header-title">MetaMask</h5>
                      </div>
                      
                      {/* Card body START */}
                      <div
                        className="alert alert-light mt-4 me-4 ms-4 mb-4"
                        role="alert"
                      >
                        {/* Title */}
                        <div className="d-sm-flex align-items-center mb-3">
                          <h5 className="alert-heading mb-0">MetaMask</h5>
                        </div>
                        {/* Content */}
                        <p className="mb-3">
                          MetaMask is the leading self-custodial wallet. The
                          safe and simple way to access blockchain applications
                          and web3. Trusted by millions of users worldwide.
                        </p>
                        <div>
                          <h6 className="mb-2">
                            1. Install MetaMask app or browser extension
                          </h6>
                          <p className="mb-3">
                            <a href="https://metamask.io/download/">
                              MetaMask app or browser extension
                            </a>
                          </p>
                        </div>
                        <div>
                          <h6 className="mb-2">2. Create a MetaMask account</h6>
                          <div
                            className="mb-3"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ReactPlayer
                              controls={true}
                              width="320px"
                              height="320px"
                              url="/public/assets/Video1.mp4"
                            />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-2">
                            3. Connect MetaMask to the Volta Testnet RPC
                          </h6>
                          <div
                            className="mb-3"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ReactPlayer
                              controls={true}
                              width="320px"
                              height="320px"
                              url="/public/assets/Video2.mp4"
                            />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-2">
                            4. Energy Web Volta testnet faucet
                          </h6>
                          <div
                            className="mb-3"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ReactPlayer
                              controls={true}
                              width="320px"
                              height="320px"
                              url="/public/assets/Video3.mp4"
                            />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-2">5. MetaMask Private Key</h6>
                          <div
                            className="mb-3"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ReactPlayer
                              controls={true}
                              width="320px"
                              height="320px"
                              url="/public/assets/Video4.mp4"
                            />
                          </div>
                        </div>
                        <div className="mb-3 mt-3 col-12 text-center">
                          <button
                            className="btn btn-sm btn-primary mb-3"
                            onClick={requestAccount}
                          >
                            <img
                              className="me-2"
                              src="data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMTIiIGhlaWdodD0iMTg5IiB2aWV3Qm94PSIwIDAgMjEyIDE4OSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cG9seWdvbiBmaWxsPSIjQ0RCREIyIiBwb2ludHM9IjYwLjc1IDE3My4yNSA4OC4zMTMgMTgwLjU2MyA4OC4zMTMgMTcxIDkwLjU2MyAxNjguNzUgMTA2LjMxMyAxNjguNzUgMTA2LjMxMyAxODAgMTA2LjMxMyAxODcuODc1IDg5LjQzOCAxODcuODc1IDY4LjYyNSAxNzguODc1Ii8+PHBvbHlnb24gZmlsbD0iI0NEQkRCMiIgcG9pbnRzPSIxMDUuNzUgMTczLjI1IDEzMi43NSAxODAuNTYzIDEzMi43NSAxNzEgMTM1IDE2OC43NSAxNTAuNzUgMTY4Ljc1IDE1MC43NSAxODAgMTUwLjc1IDE4Ny44NzUgMTMzLjg3NSAxODcuODc1IDExMy4wNjMgMTc4Ljg3NSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjU2LjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjkwLjU2MyAxNTIuNDM4IDg4LjMxMyAxNzEgOTEuMTI1IDE2OC43NSAxMjAuMzc1IDE2OC43NSAxMjMuNzUgMTcxIDEyMS41IDE1Mi40MzggMTE3IDE0OS42MjUgOTQuNSAxNTAuMTg4Ii8+PHBvbHlnb24gZmlsbD0iI0Y4OUMzNSIgcG9pbnRzPSI3NS4zNzUgMjcgODguODc1IDU4LjUgOTUuMDYzIDE1MC4xODggMTE3IDE1MC4xODggMTIzLjc1IDU4LjUgMTM2LjEyNSAyNyIvPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTYuMzEzIDk2LjE4OCAuNTYzIDE0MS43NSAzOS45MzggMTM5LjUgNjUuMjUgMTM5LjUgNjUuMjUgMTE5LjgxMyA2NC4xMjUgNzkuMzEzIDU4LjUgODMuODEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi4zNzUgODcuMTg4IDEyNiA2NS4yNSAxMjAuMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSI0Ni4xMjUgMTAxLjgxMyA2NS4yNSAxMTkuODEzIDY1LjI1IDEzNy44MTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjY1LjI1IDEyMC4zNzUgODcuNzUgMTI2IDk1LjA2MyAxNTAuMTg4IDkwIDE1MyA2NS4yNSAxMzguMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSI2NS4yNSAxMzguMzc1IDYwLjc1IDE3My4yNSA5MC41NjMgMTUyLjQzOCIvPjxwb2x5Z29uIGZpbGw9IiNFQThFM0EiIHBvaW50cz0iOTIuMjUgMTAyLjM3NSA5NS4wNjMgMTUwLjE4OCA4Ni42MjUgMTI1LjcxOSIvPjxwb2x5Z29uIGZpbGw9IiNEODdDMzAiIHBvaW50cz0iMzkuMzc1IDEzOC45MzggNjUuMjUgMTM4LjM3NSA2MC43NSAxNzMuMjUiLz48cG9seWdvbiBmaWxsPSIjRUI4RjM1IiBwb2ludHM9IjEyLjkzOCAxODguNDM4IDYwLjc1IDE3My4yNSAzOS4zNzUgMTM4LjkzOCAuNTYzIDE0MS43NSIvPjxwb2x5Z29uIGZpbGw9IiNFODgyMUUiIHBvaW50cz0iODguODc1IDU4LjUgNjQuNjg4IDc4Ljc1IDQ2LjEyNSAxMDEuMjUgOTIuMjUgMTAyLjkzOCIvPjxwb2x5Z29uIGZpbGw9IiNERkNFQzMiIHBvaW50cz0iNjAuNzUgMTczLjI1IDkwLjU2MyAxNTIuNDM4IDg4LjMxMyAxNzAuNDM4IDg4LjMxMyAxODAuNTYzIDY4LjA2MyAxNzYuNjI1Ii8+PHBvbHlnb24gZmlsbD0iI0RGQ0VDMyIgcG9pbnRzPSIxMjEuNSAxNzMuMjUgMTUwLjc1IDE1Mi40MzggMTQ4LjUgMTcwLjQzOCAxNDguNSAxODAuNTYzIDEyOC4yNSAxNzYuNjI1IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyNzIuMjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjcwLjMxMyAxMTIuNSA2NC4xMjUgMTI1LjQzOCA4Ni4wNjMgMTE5LjgxMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMTUwLjE4OCAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFODhGMzUiIHBvaW50cz0iMTIuMzc1IC41NjMgODguODc1IDU4LjUgNzUuOTM4IDI3Ii8+PHBhdGggZmlsbD0iIzhFNUEzMCIgZD0iTTEyLjM3NTAwMDIsMC41NjI1MDAwMDggTDIuMjUwMDAwMDMsMzEuNTAwMDAwNSBMNy44NzUwMDAxMiw2NS4yNTAwMDEgTDMuOTM3NTAwMDYsNjcuNTAwMDAxIEw5LjU2MjUwMDE0LDcyLjU2MjUgTDUuMDYyNTAwMDgsNzYuNTAwMDAxMSBMMTEuMjUsODIuMTI1MDAxMiBMNy4zMTI1MDAxMSw4NS41MDAwMDEzIEwxNi4zMTI1MDAyLDk2Ljc1MDAwMTQgTDU4LjUwMDAwMDksODMuODEyNTAxMiBDNzkuMTI1MDAxMiw2Ny4zMTI1MDA0IDg5LjI1MDAwMTMsNTguODc1MDAwMyA4OC44NzUwMDEzLDU4LjUwMDAwMDkgQzg4LjUwMDAwMTMsNTguMTI1MDAwOSA2My4wMDAwMDA5LDM4LjgxMjUwMDYgMTIuMzc1MDAwMiwwLjU2MjUwMDAwOCBaIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjExLjUgMCkiPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTYuMzEzIDk2LjE4OCAuNTYzIDE0MS43NSAzOS45MzggMTM5LjUgNjUuMjUgMTM5LjUgNjUuMjUgMTE5LjgxMyA2NC4xMjUgNzkuMzEzIDU4LjUgODMuODEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi4zNzUgODcuMTg4IDEyNiA2NS4yNSAxMjAuMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSI0Ni4xMjUgMTAxLjgxMyA2NS4yNSAxMTkuODEzIDY1LjI1IDEzNy44MTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjY1LjI1IDEyMC4zNzUgODcuNzUgMTI2IDk1LjA2MyAxNTAuMTg4IDkwIDE1MyA2NS4yNSAxMzguMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSI2NS4yNSAxMzguMzc1IDYwLjc1IDE3My4yNSA5MCAxNTMiLz48cG9seWdvbiBmaWxsPSIjRUE4RTNBIiBwb2ludHM9IjkyLjI1IDEwMi4zNzUgOTUuMDYzIDE1MC4xODggODYuNjI1IDEyNS43MTkiLz48cG9seWdvbiBmaWxsPSIjRDg3QzMwIiBwb2ludHM9IjM5LjM3NSAxMzguOTM4IDY1LjI1IDEzOC4zNzUgNjAuNzUgMTczLjI1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSIxMi45MzggMTg4LjQzOCA2MC43NSAxNzMuMjUgMzkuMzc1IDEzOC45MzggLjU2MyAxNDEuNzUiLz48cG9seWdvbiBmaWxsPSIjRTg4MjFFIiBwb2ludHM9Ijg4Ljg3NSA1OC41IDY0LjY4OCA3OC43NSA0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi45MzgiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjcwLjMxMyAxMTIuNSA2NC4xMjUgMTI1LjQzOCA4Ni4wNjMgMTE5LjgxMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMTUwLjE4OCAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFODhGMzUiIHBvaW50cz0iMTIuMzc1IC41NjMgODguODc1IDU4LjUgNzUuOTM4IDI3Ii8+PHBhdGggZmlsbD0iIzhFNUEzMCIgZD0iTTEyLjM3NTAwMDIsMC41NjI1MDAwMDggTDIuMjUwMDAwMDMsMzEuNTAwMDAwNSBMNy44NzUwMDAxMiw2NS4yNTAwMDEgTDMuOTM3NTAwMDYsNjcuNTAwMDAxIEw5LjU2MjUwMDE0LDcyLjU2MjUgTDUuMDYyNTAwMDgsNzYuNTAwMDAxMSBMMTEuMjUsODIuMTI1MDAxMiBMNy4zMTI1MDAxMSw4NS41MDAwMDEzIEwxNi4zMTI1MDAyLDk2Ljc1MDAwMTQgTDU4LjUwMDAwMDksODMuODEyNTAxMiBDNzkuMTI1MDAxMiw2Ny4zMTI1MDA0IDg5LjI1MDAwMTMsNTguODc1MDAwMyA4OC44NzUwMDEzLDU4LjUwMDAwMDkgQzg4LjUwMDAwMTMsNTguMTI1MDAwOSA2My4wMDAwMDA5LDM4LjgxMjUwMDYgMTIuMzc1MDAwMiwwLjU2MjUwMDAwOCBaIi8+PC9nPjwvZz48L3N2Zz4="
                              style={{ width: "25px", height: "25px" }}
                            />{" "}
                            Connect to MetaMask
                          </button>
                          <h6 className="mb-2">
                            MetaMask Address: {ethereumAddress}
                          </h6>
                          <input
                            className="form-control mb-3"
                            placeholder="MetaMask Private Key"
                            type="text"
                            value={ethereumPrivateKey}
                            onChange={(e) =>
                              setEthereumPrivateKey(e.target.value)
                            }
                          />
                          {formErrors.ethereumPrivateKey && (
                            <div className="text-danger mt-1">
                              <i className="bi bi-exclamation-triangle"></i>{" "}
                              {formErrors.ethereumPrivateKey}
                            </div>
                          )}
                        </div>
                        {/* Button and price */}
                        <div className="d-sm-flex align-items-center">
                          <button
                            className="btn btn-sm btn-success mb-2 mb-sm-0 me-3"
                            onClick={handleSaveEthereumPrivateKey}
                          >
                            Save MetaMask Private Key
                          </button>
                        </div>
                      </div>
                      {/* Card body END */}
                    </div>
                  </div>
                </div>
                {/* Tab content 4 END */}
              </div>
            </div>
          </div>
          {/* Tabs Content END */}
        </div>
      </div>
    </>
  );
}

export default EditProfileSuperAdmin;
