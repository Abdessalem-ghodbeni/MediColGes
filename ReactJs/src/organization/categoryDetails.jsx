import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";

function categoryDetails({ category, updateSelectedData }) {
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  // Initialization of Data
  useEffect(() => {
    if (category) {
      setFormData({
        name: category?.name || "",
        description: category?.description || "",
      });
    }
    console.log("category Details : ", category);
  }, [category]);

  useEffect(() => {
    if (category && category.subCategories) {
      // Map subcategories to their names
      const categorySubcategories = category.subCategories
        .map((subCategoryId) => {
          // Find the subcategory object in subCategories state by its ID
          const subcategory = subCategories.find(
            (subcategory) => subcategory._id === subCategoryId
          );
          return subcategory ? subcategory.name : null; // Return subcategory name if found, otherwise null
        })
        .filter((name) => name !== null); // Filter out null values

      // Set selected subcategories based on category's subcategories
      setSelectedSubcategories(categorySubcategories);
    }
  }, [category, subCategories]); // Include subCategories in dependency array to ensure the useEffect hook is re-triggered when subCategories state updates

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    const updatedCategory = { ...formData, [name]: value };
    console.log("category Details : ", updatedCategory);
    updateSelectedData(updatedCategory);
  };

  // fetch for sub-categories
  useEffect(() => {
    fetch("http://localhost:3000/sub-categories")
      .then((response) => response.json())
      .then((data) => setSubCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const toggleSubcategory = (subcategory) => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories(
        selectedSubcategories.filter((item) => item !== subcategory)
      );
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcategory]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedSubcategories.length === subCategories.length) {
      setSelectedSubcategories([]);
    } else {
      setSelectedSubcategories(
        subCategories.map((subcategory) => subcategory.name)
      );
    }
  };

  return (
    <>
      {/* Card body START */}
      <div className="card-body">
        <form className="row g-4 align-items-center">
          {/* Input item */}
          <div className="col-12">
            <label className="form-label">Category Name</label>
            <input
              name="name"
              type="text"
              className="form-control"
              placeholder="Name of the category"
              value={formData.name}
              onChange={handleChange}
            />
            <div className="form-text">enshour that needs to be unique</div>
          </div>
          {/* Textarea item */}
          <div className="col-12">
            <label className="form-label">Category Description</label>
            <textarea
              className="form-control"
              rows={3}
              defaultValue={""}
              type="text"
              name="description"
              onChange={handleChange}
              value={formData.description}
            />
            <div className="form-text">
              For write brief description of your category.
            </div>
          </div>
          {/* <div className="col-12">
            <label className="form-label">Sub-Category List </label>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select Options
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={toggleSelectAll}
                  active={selectedSubcategories.length === subCategories.length}
                  style={{ marginBottom: "8px" }}
                >
                  Select All
                </Dropdown.Item>
                {subCategories.length > 0 &&
                  subCategories.map((subcategory) => (
                    <Dropdown.Item
                      key={subcategory._id}
                      onClick={() => toggleSubcategory(subcategory.name)}
                      active={selectedSubcategories.includes(subcategory.name)}
                      style={{ marginBottom: "8px" }}
                    >
                      {subcategory.name}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
            <div>
              <strong>Selected Options: </strong>
              {selectedSubcategories.join(", ")}
            </div>
          </div> */}
          {/* End Dropdown List  */}
        </form>
      </div>
      {/* Card body END */}
    </>
  );
}

export default categoryDetails;
