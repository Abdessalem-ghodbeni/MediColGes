import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CategoryDetails from "./categoryDetails";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
import SubCategoriesList from "./subCategoriesList";

function categoryList() {
  const [categories, setCategories] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  // const [updateSelectedData, setUpdateSelectedData] = useState(null);
  //Modal
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [show, setShow] = useState(false);

  // fetch for categores
  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Begin Modal for Delete item
  const handleDeleteClick = (id) => {
    setItemIdToDelete(id);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleConfirmDelete = async () => {
    try {
      console.log("Deleting item with ID: ", itemIdToDelete);
      const id = categories[itemIdToDelete]._id;
      // Send DELETE request to the endpoint with the item ID
      const response = await axios.delete(
        `http://localhost:3000/categories/${id}`
      );

      // Handle success response
      const updatedOrganizations = categories.filter((org) => org._id !== id);
      setCategories(updatedOrganizations);
      setShowDeleteModal(false); // Close the delete modal
    } catch (error) {
      // Handle error
      console.error("Error deleting item:", error);
      // You may want to display an error message to the user
    }
  };
  const handleDelete = () => {
    setShowDeleteModal(true);
  };
  // End Modal for Delete item

  // Begin Modal for update & create item
  const handleSubmit = async () => {
    try {
      let response;

      if (selectedId == null) {
        response = await axios.post(
          `http://localhost:3000/categories`,
          selectedData
        );
      } else {
        response = await axios.put(
          `http://localhost:3000/categories/${selectedId}`,
          selectedData
        );
      }

      // Check for successful response
      if (response.status >= 200 && response.status < 300) {
        console.log("Data updated successfully:", response.data);
        // Update organizations list after successful update
        const updatedCategory = response.data;

        if (selectedId == null) {
          // If it's a new category, add it to the existing categories
          setCategories((prevCategories) => [
            ...prevCategories,
            updatedCategory,
          ]);
        } else {
          // If it's an existing category, update it in the categories list
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category._id === selectedId ? updatedCategory : category
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
  // const handleShow = (data, updateSelectedData) => {
  const handleShow = (data) => {
    setSelectedData(data);
    setSelectedId(data?._id || null);
    setShow(true);
    // setUpdateSelectedData(updateSelectedData);
  };
  const handleClose = () => setShow(false);
  // End Modal for update & create item

  return (
    <>
      {/* Page main content START */}
      <div className="page-content-wrapper p-xxl-4">
        {/* Title */}
        <div className="row">
          <div className="col-12 mb-4 mb-sm-5">
            <div className="d-sm-flex justify-content-between align-items-center">
              <h1 className="h3 mb-3 mb-sm-0">Category List</h1>
            </div>
          </div>
        </div>
        {/* add new organization button */}
        <div className="row ">
          <div className="d-sm-flex ">
            <a
              onClick={() => handleShow({ selectedData })}
              className="btn btn-primary mb-0"
            >
              <i className="bi bi-plus me-2" />
              New
            </a>
          </div>
        </div>
        {/* Guest list START */}
        <div className="card shadow mt-5">
          {/* Card body START */}
          <div className="card-body">
            {/* Table head */}
            <div className="bg-light rounded p-3 d-none d-lg-block">
              <div className="row row-cols-7 g-4">
                <div className="col">
                  <h6 className="mb-0">Category N⁰</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Name</h6>
                </div>
                <div className="col">
                  <h6 className="mb-0">Description</h6>
                </div>{" "}
                <div className="col">
                  <h6 className="mb-0">Action</h6>
                </div>
              </div>
            </div>
            {/* Table data */}
            {categories.map((category, index) => (
              <div
                key={category._id}
                className="row row-cols-xl-7 align-items-lg-center border-bottom g-4 px-2 py-4"
              >
                <div className="col">
                  <small className="d-block d-lg-none">Category Name:</small>
                  <h6 className="mb-0 fw-normal">{index + 1}</h6>
                </div>
                {/* Name item */}
                <div className="col">
                  <small className="d-block d-lg-none">Category Name:</small>
                  <h6 className="mb-0 fw-normal">
                    {category.name.length > 10
                      ? `${category.name.slice(0, 10)}...`
                      : category?.name || ""}
                  </h6>
                </div>
                {/* Description item */}
                <div className="col">
                  <small className="d-block d-lg-none">
                    Category Description:
                  </small>
                  <p className="mb-0 fw-normal ">
                    {category.description.length > 15
                      ? `${category.description.slice(0, 15)}...`
                      : category?.description || ""}
                  </p>
                </div>
                {/* Action button */}
                <div className="col">
                  <small className="d-block d-lg-none">Action :</small>
                  <button
                    className="btn btn-sm btn-info m-1"
                    onClick={() => handleShow(category)}
                  >
                    <i className="fa-solid fa-cogs"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger m-1"
                    onClick={() => handleDeleteClick(index)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
                <div></div>
              </div>
            ))}
          </div>
          {/* Card body END */}
          {/* Card footer START */}
          <div className="card-footer pt-0">
            {/* Pagination and content */}
            <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
              {/* Content */}
              <p className="mb-sm-0 text-center text-sm-start">
                Showing 1 to {categories.length} of 20 entries
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
                  <li className="page-item active">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item ">
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
        {/* Guest list END */}
      </div>
      {/* Begin sub Categories List  */}
      <SubCategoriesList />
      {/* End sub Categories List  */}

      {/* Page main content END */}

      {/* Modal */}
      <>
        {/* Modal Details Data */}
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Category Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CategoryDetails
              category={selectedData}
              updateSelectedData={(updatedData) => setSelectedData(updatedData)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleSubmit()}>
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
            <Button variant="danger" onClick={() => handleConfirmDelete()}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
}

export default categoryList;
