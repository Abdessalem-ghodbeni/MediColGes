import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { base_url } from "../baseUrl";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const EditData = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  useEffect(() => {
    const fetchDataEntry = async () => {
      try {
        const response = await axios.get(`${base_url}/dataEntry/${id}`);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setFileData(response.data.fileData);
        setFileName(response.data.fileData.fileName);
      } catch (error) {
        console.error("Error fetching data entry:", error);
      }
    };
    fetchDataEntry();
  }, [id]);

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

  const handleUpdate = async () => {
    setShowConfirmation(false);
    try {
      const formData = {
        title,
        description,
        fileData,
      };
      await axios.put(`${base_url}/dataEntry/${id}`, formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating data entry:", error);
    }
  };

  const totalPages = fileData
    ? Math.ceil(fileData.data.length / entriesPerPage)
    : 0;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const analyzeData = async () => {
    try {
      console.log("ready to analyze data");
      const spinner = document.getElementById("spinner");
      spinner.style.display = "inline-block"; // Show spinner

      const requestData = { data: fileData.data };
      const response = await axios.post(
        "http://localhost:3000/api/analyze-data",
        requestData
      );
      spinner.style.display = "none"; // Hide spinner
      console.log("Analysis result:", response.data);

      if (response.data.success && response.data.data) {
        // Remove Markdown backticks if present and parse JSON
        const cleanData = response.data.data.replace(/```json\n|\n```/g, "");
        setSummaryData(JSON.parse(cleanData)); // Parse cleaned data string
        setShowSummaryModal(true); // Show summary modal on successful data retrieval
      }
    } catch (error) {
      console.error("Failed to analyze data:", error);
      spinner.style.display = "none"; // Ensure spinner is hidden on error
    }
  };

  const renderData = (data) => {
    if (data === null) return "null";
    if (typeof data === "object" && !Array.isArray(data)) {
      return (
        <ul>
          {Object.keys(data).map((key) => (
            <li key={key}>
              {key}: {renderData(data[key])}
            </li>
          ))}
        </ul>
      );
    } else if (Array.isArray(data)) {
      return (
        <ul>
          {data.map((item, index) => (
            <li key={index}>{renderData(item)}</li>
          ))}
        </ul>
      );
    } else {
      return data.toString();
    }
  };

  return (
    <section className="pt-0">
      <div className="container vstack gap-4">
        {showSuccess && (
          <div className="alert alert-success" role="alert">
            Data updated successfully!
          </div>
        )}
        <div className="row mb-3">
          <div className="col">
            <p>
              <Link to="/internaute/dataManagement">Home</Link> / Edit
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h1 className="fs-4 mb-0">
              <i className="bi bi-card-heading fa-fw me-1" /> Edit Data Entry
            </h1>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6">
            <label className="form-label">Title:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label className="form-label">Description:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <label className="form-label">Upload File:</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileUpload}
            />
            {fileName && <p>Loaded File: {fileName}</p>}
          </div>
        </div>
        {fileData && (
          <div>
            <h3>File Data Preview:</h3>
            <table className="table">
              <thead>
                <tr>
                  {fileData.header.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fileData.data
                  .slice(
                    (currentPage - 1) * entriesPerPage,
                    currentPage * entriesPerPage
                  )
                  .map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, idx) => (
                        <td key={idx}>{value}</td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
            <nav>
              <ul className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      index + 1 === currentPage ? "active" : ""
                    }`}
                  >
                    <a
                      onClick={() => paginate(index + 1)}
                      className="page-link"
                    >
                      {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
        <div className="row">
          <div className="col-12">
            <button
              className="btn btn-primary"
              onClick={() => setShowConfirmation(true)}
            >
              Confirm Update
            </button>
            <br />
            <button className="btn btn-secondary" onClick={() => analyzeData()}>
              analyze data
            </button>
            <Modal
              show={showConfirmation}
              onHide={() => setShowConfirmation(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Confirm Update</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to update this data?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdate}>
                  Update
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
      {/*  Begin loading page -------- show spinner ----  */}
      <div
        id="spinner"
        className="spinner-border"
        role="status"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "none",
        }}
      >
        <span className="sr-only">Loading...</span>
        <br />
        <p>Analyzing Data...</p>
      </div>
      {/*  End loading page -------- show spinner ----  */}
      {/* Begin Summary Modal */}

      <Modal show={showSummaryModal} onHide={() => setShowSummaryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Data Analysis Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {summaryData ? renderData(summaryData) : "No data available"}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSummaryModal(false)}
          >
            Close
          </Button>
         
        </Modal.Footer>
      </Modal>

      {/* End Summary Modal */}
    </section>
  );
};

export default EditData;
