import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import OrganizationDetails from "./organizationDetails";
import axios from "axios";

function organizationList() {
  const [organizations, setOrganizations] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState({});
  const [show, setShow] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [saveDisabled, setSaveDisabled] = useState(false);


  //display organizations List
  useEffect(() => {
    fetch("http://localhost:3000/organizations")
      .then((response) => response.json())
      .then((data) => setOrganizations(data))
      .catch((error) => console.error("Error fetching organizations:", error));
  }, []);

  //display categories List
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        const data = await response.json();
        // Convert categories array to object for easier lookup
        const categoriesObject = {};
        data.forEach((category) => {
          categoriesObject[category._id] = category.name;
        });
        setCategories(categoriesObject);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // show & close modal Details item
  const handleShow = (data) => {
    setSelectedData(data);
    setSelectedId(data?.organization?._id || null);
    setShow(true);
  };
  const handleClose = () => setShow(false);

  // Modal for Delete item
  const handleDeleteClick = (id) => {
    setItemIdToDelete(id);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleConfirmDelete = async () => {
    try {
      // console.log(
      //   `Deleting item with ID: ${organizations[itemIdToDelete]._id}`
      // );
      const id = organizations[itemIdToDelete]._id;
      // Send DELETE request to the endpoint with the item ID
      const response = await axios.delete(
        `http://localhost:3000/organizations/${id}`
      );

      // Handle success response
      // console.log("Item deleted successfully:", response.data);
      // Filter out the deleted item from the organizations list
      const updatedOrganizations = organizations.filter(
        (org) => org._id !== id
      );
      setOrganizations(updatedOrganizations);
      setShowDeleteModal(false); // Close the delete modal
    } catch (error) {
      // Handle error
      console.error("Error deleting item:", error);
      // You may want to display an error message to the user
    }
  };

  // Modal for update & create item
  const handleSubmit = async () => {
    // Check if the category ID is empty and remove it from the data to submit
    if (selectedData.organization.category_id === "") {
      delete selectedData.organization.category_id;
    }

    try {
      let response;

      if (selectedId == null) {
        response = await axios.post(
          `http://localhost:3000/organizations`,
          selectedData.organization
        );
      } else {
        response = await axios.put(
          `http://localhost:3000/organizations/${selectedId}`,
          selectedData.organization
        );
      }

      // Check for successful response
      if (response.status >= 200 && response.status < 300) {
        console.log("Data updated successfully:", response.data);
        // Update organizations list after successful update
        const updatedOrganization = response.data;

        if (selectedId == null) {
          // If it's a new organization, add it to the existing organizations
          setOrganizations((prevOrganizations) => [
            ...prevOrganizations,
            updatedOrganization,
          ]);
        } else {
          // If it's an existing organization, update it in the organizations list
          setOrganizations((prevOrganizations) =>
            prevOrganizations.map((organization) =>
              organization._id === selectedId
                ? updatedOrganization
                : organization
            )
          );
        }

        // Close the modal after completion
        handleClose();
      } else {
        throw new Error("Error updating data");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle errors appropriately, e.g., display error message to user
    }
  };

  return (
    <>
      {/* list of items */}
      <>
        {/* Page main content START */}
        <div className="page-content-wrapper p-xxl-4">
          {/* Title */}
          <div className="row">
            <div className="col-12 mb-4 mb-sm-5">
              <div className="d-sm-flex justify-content-between align-items-center">
                <h1 className="h3 mb-3 mb-sm-0">Organization List</h1>
              </div>
            </div>
          </div>
          <br />
          {/* add new organization button */}
          <div className="row ">
            <div className="d-sm-flex ">
              <a
                onClick={() => handleShow({})}
                className="btn btn-primary mb-0"
              >
                <i className="bi bi-plus me-2" />
                New
              </a>
            </div>
          </div>

          {/* list Begin */}
          <div className="card shadow mt-5">
            {/* Card body Begin */}
            <div className="card-body">
              {/* Table head */}
              <div className="bg-light rounded p-3 d-none d-lg-block">
                <div className="row row-cols-7 g-4">
                  <div className="col">
                    <h6 className="mb-0">organization N⁰</h6>
                  </div>
                  <div className="col">
                    <h6 className="mb-0">name</h6>
                  </div>
                  <div className="col">
                    <h6 className="mb-0">email</h6>
                  </div>
                  <div className="col">
                    <h6 className="mb-0">phone</h6>
                  </div>
                  <div className="col">
                    <h6 className="mb-0">description</h6>
                  </div>
                  <div className="col">
                    <h6 className="mb-0">category</h6>
                  </div>
                  <div className="col">
                    <h6 className="mb-0">Action</h6>
                  </div>
                </div>
              </div>
              {/* Table data */}
              {organizations.map((organization, index) => (
                <div
                  key={organization._id}
                  className="row row-cols-xl-7 align-items-lg-center border-bottom g-4 px-2 py-4"
                >
                  {/* index item */}
                  <div className="col">
                    <small className="d-block d-lg-none">N⁰ :</small>
                    <h6 className="mb-0 fw-normal">{index + 1}</h6>
                  </div>
                  {/* Name of item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Organization :</small>
                    <h6 className="mb-0 fw-normal">
                      {organization.name.length > 10
                        ? `${organization.name.slice(0, 10)}...`
                        : organization?.name || ""}
                    </h6>
                  </div>

                  {/* Email item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Email:</small>
                    <h6 className="mb-0 fw-normal">
                      {organization.contact?.email &&
                      organization.contact.email.length > 15
                        ? `${organization.contact.email.slice(0, 15)}...`
                        : organization?.contact?.email || ""}
                    </h6>
                  </div>

                  {/* Phone item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Phone:</small>
                    <h6 className="mb-0 fw-normal">
                      {organization.contact?.phone &&
                      organization.contact.phone.length > 10
                        ? `${organization.contact.phone.slice(0, 10)}...`
                        : organization?.contact?.phone || ""}
                    </h6>
                  </div>

                  {/* Description item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Description:</small>
                    <h6 className="mb-0 fw-normal">
                      {organization.description &&
                      organization.description.length > 15
                        ? `${organization.description.slice(0, 15)}...`
                        : organization?.description || ""}
                    </h6>
                  </div>

                  {/* Category item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Category:</small>
                    {categories[organization.category_id] ? (
                      <div className="badge bg-success bg-opacity-10 text-success">
                        {categories[organization.category_id].length > 15
                          ? `${categories[organization.category_id].slice(
                              0,
                              15
                            )}...`
                          : categories[organization.category_id]}
                      </div>
                    ) : (
                      <div className="badge bg-danger bg-opacity-10 text-danger">
                        None
                      </div>
                    )}
                  </div>

                  {/* Action button */}
                  <div className="col">
                    <small className="d-block d-lg-none">Action :</small>
                    <button
                      className="btn btn-sm btn-info m-1"
                      onClick={() => handleShow({ organization })}
                    >
                      <i className="fa-solid fa-cogs"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger m-1"
                      // onClick={() => handleDelete(organization._id)}
                      onClick={() => handleDeleteClick(index)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Card body END */}
            {/* Card footer Begin */}
            <div className="card-footer pt-0">
              {/* Pagination and content */}
              <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                {/* Content */}
                <p className="mb-sm-0 text-center text-sm-start">
                  Showing 1 to 8 of 20 entries
                </p>
                {/* Pagination */}
                <nav
                  className="mb-sm-0 d-flex justify-content-center"
                  aria-label="navigation"
                >
                  <ul className="pagination pagination-sm pagination-primary-soft mb-0">
                    <li className="page-item disabled">
                      <a className="page-link" href="#" tabIndex={-1}>
                        Prev
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        1
                      </a>
                    </li>
                    <li className="page-item active">
                      <a className="page-link" href="#">
                        2
                      </a>
                    </li>
                    <li className="page-item disabled">
                      <a className="page-link" href="#">
                        ..
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        15
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        Next
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            {/* Card footer END */}
          </div>
          {/* list END */}
        </div>
        {/* Page main content END */}/
      </>
      {/* Modal */}
      <>
        {/* Modal Details Data */}
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Organization Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <OrganizationDetails organization={selectedData} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleSubmit()} >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
}

export default organizationList;
