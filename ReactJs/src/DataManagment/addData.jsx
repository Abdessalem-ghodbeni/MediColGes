import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import { base_url } from "../baseUrl";
import axios from "axios";

// addData

const AddData = ({}) => {
  const [fileData, setFileData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  //******************************************************************* */
  //**************************** User *************************************** */
  //******************************************************************* */

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

  const [user, setUser] = useState({});
  const userRole = localStorage.getItem("USER_ROLE");
  //Geting user

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
  //Geting user
  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");
    console.log("userId : ", userId);
    const fetchProfileData = async () => {
      try {
        let response;
        switch (userRole) {
          case "superAdmin":
            response = await axios.get(
              `${base_url}/superAdmin/getById/${userId}`
            );
            break;
          case "internautes":
            response = await axios.get(
              `${base_url}/internaute/getById/${userId}`
            );
            break;
          default:
            response = await axios.get(`${base_url}/patient/getById/${userId}`);
        }
        setUser({
          ...response.data.data,
          // Utilisez format de date-fns pour formater la date
          // dateNaissance: response.data.data.dateNaissance
          // ? format(new Date(response.data.data.dateNaissance), "yyyy-MM-dd")
          // : "",
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  //******************************************************************* */
  //*************************** End User **************************************** */
  //******************************************************************* */

  const itemsPerPage = 10;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ["text/csv"]; // Define allowed file types (CSV)

    if (!allowedTypes.includes(file.type)) {
      alert("Only CSV files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const fileContent = reader.result;
      const rows = fileContent.split("\n");
      const headers = rows[0].split(",");
      const data = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(",");
        if (row.length === headers.length) {
          const rowData = {};
          for (let j = 0; j < headers.length; j++) {
            rowData[headers[j].trim()] = row[j].trim();
          }
          data.push(rowData);
        }
      }
      setFileData({ fileName: file.name, header: headers, data: data });
      setCurrentPage(1); // Reset pagination to the first page
    };
  };

  const handleSubmit = async () => {
    try {
      const formData = {
        title: title,
        description: description,
        fileData: fileData,
        user_id: user._id, // Ensure you're sending the user ID only
      };

      // Send POST request to the backend
      const response = await axios.post(`${base_url}/dataEntry`, formData);
      console.log("Data entry added:", response.data);
      navigate("/internaute/dataManagement"); // Navigate back to view all entries
    } catch (error) {
      console.error("Error adding data entry:", error);
    }
  };

  if (!fileData || !fileData.data) {
    return (
      <>
        <section className="pt-0">
          <div className="container vstack gap-4">
            {/* Back Button */}
            {/* Navigation */}
            <div className="row mb-3">
              <div className="col">
                <p>
                  <Link to="/internaute/dataManagement">Home</Link> / Add
                </p>
              </div>
            </div>
            {/* Navigation END */}

            {/* Title */}
            <div className="row">
              <div className="col-12">
                <h1 className="fs-4 mb-0">
                  <i className="bi bi-card-heading fa-fw me-1" />
                  Data Management
                </h1>
              </div>
            </div>
            {/* Title END */}

            {/* Title and Description Inputs */}
            <div className=" mb-3">
              <div className="col-6">
                <label className="form-label">Title : </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <br />
              <div className="col-6">
                <label className="form-label">Description : </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="row">
              <div className="col-12">
                <br></br>
                <input
                  type="file"
                  onChange={(e) => {
                    setFileName(e.target.files[0].name);
                    handleFileUpload(e);
                  }}
                />
              </div>
            </div>
            {/* File Upload END */}

            {/* Submit Button */}
            <div className="row">
              <div className="col-12">
                <button className="btn btn-primary" onClick={handleSubmit}>
                  ADD
                </button>
              </div>
            </div>
            {/* Submit Button END */}
          </div>
        </section>
      </>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = fileData.data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="pt-0">
      <div className="container vstack gap-4">
        {/* Navigation */}
        <div className="row mb-3">
          <div className="col">
            <p>
              <Link to="/internaute/dataManagment">Home</Link> / Add
            </p>
          </div>
        </div>
        {/* Navigation END */}
        {/* Title */}
        <div className="row">
          <div className="col-12">
            <h1 className="fs-4 mb-0">
              <i className="bi bi-card-heading fa-fw me-1" />
              Data Management
            </h1>
          </div>
        </div>
        {/* Title END */}

        {/* Title and Description Inputs */}
        <div className=" mb-3">
          <div className="col-6">
            <label className="form-label">Title : </label>
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <br />
          <div className="col-6">
            <label className="form-label">Description : </label>
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* File Upload */}
        <input
          type="file"
          onChange={(e) => {
            setFileName(e.target.files[0].name);
            handleFileUpload(e);
          }}
        />

        <div>
          <table className="table">
            <thead>
              <tr>
                {fileData.header.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((rowData, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(rowData).map((cellData, cellIndex) => (
                    <td key={cellIndex}>{cellData}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="pagination">
            {fileData.data.length > itemsPerPage &&
              Array.from({
                length: Math.ceil(fileData.data.length / itemsPerPage),
              }).map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    onClick={() => paginate(index + 1)}
                    className="page-link"
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
          </ul>
        </div>

        {/* Submit Button */}
        <div className="row">
          <div className="col-12">
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
        {/* Submit Button END */}
      </div>
    </section>
  );
};

export default AddData;
