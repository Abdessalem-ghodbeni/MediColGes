import React, { useEffect } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ChatContextProvider } from "./context/ChatContext";
import { useNavigate } from "react-router-dom";
import { base_url } from "./baseUrl.js";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  // useNavigate,
  useLocation,
} from "react-router-dom";
import "../public/assets/css/style.css";
import "../public/assets/js/bootstrap.bundle.min.js";

import HomePage from "./Home/home.jsx";
import LoginPage from "./Home/login.jsx";
import TwoFactorAuthenticationPage from "./Home/twoFactorAuthentication.jsx";
import RegisterPage from "./Home/register.jsx";
import RegisterInternautePage from "./Home/registerInternaute.jsx";
import RegisterPatientPage from "./Home/registerPatient.jsx";
import ForgotPasswordPage from "./Home/forgotPassword.jsx";
import ResetPasswordPage from "./Home/resetPassword.jsx";
import VerificationEmailSuccessPage from "./Home/verificationEmailSuccess.jsx";
import VerificationEmailErrorPage from "./Home/verificationEmailError.jsx";
import SuperAdminPage from "./SuperAdmin/dashboardSuperAdmin.jsx";
import DashboardContentSuperAdminPage from "./SuperAdmin/dashboardContentSuperAdmin.jsx";
import ProfileSuperAdminPage from "./SuperAdmin/profileSuperAdmin.jsx";
import EditProfileSuperAdminPage from "./SuperAdmin/editProfileSuperAdmin.jsx";
import ListInternautePage from "./SuperAdmin/listInternaute.jsx";
import ListPatientPage from "./SuperAdmin/listPatient.jsx";
import DomaineProfessionnelPage from "./SuperAdmin/domaineProfessionnel.jsx";
import ListPublicationAPage from "./SuperAdmin/listPublication.jsx";
import DetailPublicationAPage from "./SuperAdmin/detailPublication.jsx";
import HistoryPage from "./SuperAdmin/history.jsx";
import InternautePage from "./Internaute/dashboardInternaute.jsx";
import ProfileInternautePage from "./Internaute/profileInternaute.jsx";
import EditProfileInternautePage from "./Internaute/editProfileInternaute.jsx";
import AddPublicationPage from "./Internaute/addPublication.jsx";
import ListPublicationPage from "./Internaute/listPublication.jsx";
import DetailPublicationPage from "./Internaute/detailPublication.jsx";
import UpdatePublicationPage from "./Internaute/updatePublication.jsx";
import PatientPage from "./Patient/dashboardPatient.jsx";
import ProfilePatientPage from "./Patient/profilePatient.jsx";
import EditProfilePatientPage from "./Patient/editProfilePatient.jsx";
import ErrorPage from "./Home/error.jsx";
import Forms from "./Forms/Forms.jsx";
import ListForms from "./Forms/ListForms/ListForms.jsx";
import ViewOneForm from "./Forms/ViewOneForm/ViewOneForm.jsx";
import SharedFormulaire from "./Forms/SharedFormulaire/SharedFormulaire.jsx";
import AddProjet from "./Forms/AddProject/AddProjet.jsx";
import ListeProjets from "./Forms/ListeDesProjets/ListeProjets.jsx";
import ResponseListe from "./Forms/ResponsesModule/ListeResponses/ResponseListe.jsx";
import Test from "./Forms/test/Test.jsx";
import ListePatientParticipations from "./Patient/ListePatientParticipations.jsx";
import ResponsePatient from "./Patient/ResponsePatient.jsx";
import ListeProjetCreatedByInternaute from "./Forms/ListeDesProjets/ListeProjetCreatedByInternaute.jsx";
// import ProjetById from "./Forms/ProjetDetails/ProjetById.jsx";
import DashboardMainPage from "./organization/dashboardMainPage.jsx";
import OrganizationList from "./organization/organizationList";
import OrganizationDetails from "./organization/organizationDetails";
import CategoryDetails from "./organization/categoryDetails";
import CategoryList from "./organization/categoryList";
import FeedbackList from "./Feedback/feedbackList";
import EditProject from "./Forms/EditProject/EditProject.jsx";
import Chat from "./Home/Chat/Chat.jsx";
import DataManagment from './DataManagment/dataManagment';
import AddData from './DataManagment/addData';
import EditData from './DataManagment/editData.jsx';
import Statistique from "./Internaute/Statistique.jsx";
import ListeDesProjetASupervise from "./Forms/ListeDesProjets/ListeDesProjetASupervise.jsx";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/assets/js/functions.js";
    script.async = true;

    script.onload = () => console.log("Le script a été chargé avec succès.");
    script.onerror = () => console.error("Erreur de chargement du script.");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${base_url}/authentification/verifyRefreshToken`,
            { refreshToken }
          );
          const { accessToken } = response.data.data;
          localStorage.setItem("accessToken", accessToken);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
        } catch (error) {
          console.error("Error on refresh token:", error);
          localStorage.clear();
          window.location.reload();
          navigate("/login");
        }
      }
    };

    verifyRefreshToken();
  }, [navigate]);

  const PublicRoute = ({ children }) => {
    const userRole = localStorage.getItem("USER_ROLE");

    if (userRole) {
      const homePath =
        userRole === "superAdmin"
          ? "/superAdmin"
          : userRole === "internautes"
          ? "/internaute"
          : userRole === "patients"
          ? "/patient"
          : "/";
      return <Navigate to={homePath} replace />;
    }

    return children;
  };

  const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const userRole = localStorage.getItem("USER_ROLE");
    const isTwoFactorEnabled = JSON.parse(
      localStorage.getItem("isTwoFactorEnabled")
    );
    const twoFactorVerified = JSON.parse(
      localStorage.getItem("twoFactorVerified") || "false"
    );

    console.log("isTwoFactorEnabled", isTwoFactorEnabled);
    console.log("twoFactorVerified", twoFactorVerified);
    // Déterminez si le chemin actuel commence par le chemin de rôle attendu
    const isCorrectRolePath = (role) => {
      const rolePath = {
        superAdmin: "/superAdmin",
        internautes: "/internaute",
        patients: "/patient",
      };

      return location.pathname.startsWith(rolePath[role]);
    };

    if (!userRole) {
      // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
      return <Navigate to="/login" replace />;
    } else if (userRole === "superAdmin" && !isCorrectRolePath("superAdmin")) {
      // Utilisateur est superAdmin mais pas sur un chemin superAdmin, redirigez
      return <Navigate to="/superAdmin" replace />;
    } else if (
      userRole === "internautes" &&
      !isCorrectRolePath("internautes")
    ) {
      // Vérifie si l'authentification à deux facteurs est désactivée ou si elle est activée et vérifiée
      if (!isTwoFactorEnabled || (isTwoFactorEnabled && twoFactorVerified)) {
        return <Navigate to="/internaute" replace />;
      } else {
        // Redirigez vers la page d'authentification à deux facteurs si elle est activée mais pas encore vérifiée
        return <Navigate to="/twoFactorAuthentication" replace />;
      }
    } else if (userRole === "patients" && !isCorrectRolePath("patients")) {
      // Appliquez une logique similaire pour les patients
      if (!isTwoFactorEnabled || (isTwoFactorEnabled && twoFactorVerified)) {
        return <Navigate to="/patient" replace />;
      } else {
        return <Navigate to="/twoFactorAuthentication" replace />;
      }
    }

    // Si l'utilisateur est connecté et sur un chemin correct, permettez l'accès
    return children;
  };

  return (
    <ChatContextProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/registerInternaute"
          element={
            <PublicRoute>
              <RegisterInternautePage />
            </PublicRoute>
          }
        />
        <Route
          path="/registerPatient"
          element={
            <PublicRoute>
              <RegisterPatientPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgotPassword"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/resetPassword/:resetToken"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/verificationEmailSuccess"
          element={
            <PublicRoute>
              <VerificationEmailSuccessPage />
            </PublicRoute>
          }
        />
        <Route
          path="/verificationEmailError"
          element={
            <PublicRoute>
              <VerificationEmailErrorPage />
            </PublicRoute>
          }
        />

        <Route
          path="/twoFactorAuthentication"
          element={<TwoFactorAuthenticationPage />}
        />

        <Route
          path="/superAdmin"
          element={
            <PrivateRoute>
              <SuperAdminPage />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route
            path="dashboard"
            element={<DashboardContentSuperAdminPage />}
          />
          <Route path="profile" element={<ProfileSuperAdminPage />} />
          <Route path="editProfile" element={<EditProfileSuperAdminPage />} />
          <Route path="listInternaute" element={<ListInternautePage />} />
          <Route path="listPatient" element={<ListPatientPage />} />
          <Route
            path="domaineProfessionnel"
            element={<DomaineProfessionnelPage />}
          />
          <Route path="listPublications" element={<ListPublicationAPage />} />
          <Route
            path="detailPublication/:id"
            element={<DetailPublicationAPage />}
          />
          <Route path="forms/liste" element={<ListForms />} />
          <Route path="projets/liste" element={<ListeProjets />} />
          <Route path="viewOneForm" element={<ViewOneForm />} />
          <Route path="organizationlist" element={<OrganizationList />} />
          <Route path="categorylist" element={<CategoryList />} />
          <Route path="feedbacklist" element={<FeedbackList />} />
          <Route path="historical" element={<HistoryPage />} />
        </Route>

        <Route
          path="/internaute"
          element={
            <PrivateRoute>
              <InternautePage />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate replace to="profile" />} />
          <Route path="profile" element={<ProfileInternautePage />} />
          <Route path="editProfile" element={<EditProfileInternautePage />} />
          <Route path="addPublication" element={<AddPublicationPage />} />
          <Route path="listPublication" element={<ListPublicationPage />} />
          <Route path="list/response" element={<ResponseListe />} />
          <Route path="statiqtiques/views" element={<Statistique />} />
          <Route
            path="invitations/projects"
            element={<ListeDesProjetASupervise />}
          />
          <Route
            path="detailPublication/:id"
            element={<DetailPublicationPage />}
          />
          <Route
            path="editPublication/:id"
            element={<UpdatePublicationPage />}
          />
          <Route path="chat" element={<Chat />} />
          <Route path="listForms" element={<ListForms />} />
          <Route path="viewOneForm" element={<ViewOneForm />} />
          <Route path="addForm" element={<Forms />} />
          <Route path="dataManagement" element={<DataManagment />} />
          <Route path="addData" element={<AddData />} />
          <Route path="editData/:id" element={<EditData />} />
          <Route path="add/project" element={<AddProjet />} />
          <Route path="editProject" element={<EditProject />} />
          <Route path="liste" element={<ListeProjetCreatedByInternaute />} />
          <Route path="response/liste" element={<ResponseListe />} />
          {/* <Route path="projet" element={<ProjetById />} /> */}
        </Route>

        <Route
          path="/patient"
          element={
            <PrivateRoute>
              <PatientPage />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate replace to="profile" />} />
          <Route path="profile" element={<ProfilePatientPage />} />
          <Route path="editProfile" element={<EditProfilePatientPage />} />
          <Route path="liste" element={<ListePatientParticipations />} />
          <Route path="listResponse" element={<ResponsePatient />} />
          <Route path="forms/liste" element={<ListForms />} />
          <Route path="viewOneForm" element={<ViewOneForm />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </ChatContextProvider>
  );
}

export default App;
