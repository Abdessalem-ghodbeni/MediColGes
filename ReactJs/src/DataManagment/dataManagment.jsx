import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { base_url } from "../baseUrl";

const DataManagement = () => {
  const [dataEntries, setDataEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataEntries = async () => {
      try {
        const userId = localStorage.getItem("USER_ID");
        // const response = await axios.get(`${base_url}/dataEntry`);
        const response = await axios.get(
          `${base_url}/dataEntry/user/${userId}`
        );
        setDataEntries(response.data);
      } catch (error) {
        console.error("Error fetching data entries:", error);
      }
    };

    fetchDataEntries();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await axios.delete(`${base_url}/dataEntry/${id}`);
        setDataEntries(dataEntries.filter((entry) => entry._id !== id));
      } catch (error) {
        console.error("Error deleting data entry:", error);
      }
    }
  };

  return (
    <section className="pt-0">
      <div className="container vstack gap-4">
        <div className="row ">
          <div className="d-sm-flex ">
            <a
              onClick={() => navigate("/internaute/addData")}
              className="btn btn-primary mb-0"
            >
              <i className="bi bi-plus me-2" />
              New Data Entry
            </a>
          </div>
        </div>
        <div className="card shadow mt-5">
          <div className="card-body">
            <div className="bg-light rounded p-3 d-none d-lg-block">
              <div className="row row-cols-4 g-4">
                <div className="col">
                  <h6 className="mb-0">Index</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Title</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Description</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Action</h6>
                </div>
              </div>
            </div>
            {dataEntries.length === 0 ? (
              <p>No data available.</p>
            ) : (
              <>
                {dataEntries.map((entry, index) => (
                  <div
                    key={entry._id}
                    className="row row-cols-4 align-items-center border-bottom g-4 px-2 py-4"
                  >
                    <div className="col">{index + 1}</div>
                    <div className="col">{entry.title}</div>
                    <div className="col">{entry.description}</div>
                    <div className="col">
                      <button
                        className="btn btn-sm btn-info m-1"
                        onClick={() =>
                          navigate(`/internaute/editData/${entry._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger m-1"
                        onClick={() => handleDelete(entry._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataManagement;
