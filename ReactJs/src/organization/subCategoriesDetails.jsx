import React, { useEffect, useRef, useState } from "react";

export default function subCategoriesDetails({ category, updateSelectedData }) {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
  });
  // Initialization of Data
  useEffect(() => {
    if (category) {
      console.log("category : ", category);
      setFormData({
        name: category?.name || "",
        description: category?.description || "",
        category_id: category?.category_id || "",
      });
    }
  }, [category]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    const updatedSubCategory = { ...formData, [name]: value };
    console.log("category Details : ", updatedSubCategory);
    updateSelectedData(updatedSubCategory);
  };

  // fetch for categories
  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  return (
    <>
      {/* Card body START */}
      <div className="card-body">
        <form className="row g-4 align-items-center">
          {/* Input item */}
          <div className="col-12">
            <label className="form-label">Sub-Category Name</label>
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
            <label className="form-label">Sub-Category Description</label>
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

          {/* Category List  */}
          <div className="col">
            <label className="form-label">Categories</label>
            <select
              className="form-select"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
            >
              <option value="">None</option>
              {Array.isArray(categories) &&
                categories.map((category) => {
                  if (category._id) {
                    // Check if category has an ID
                    return (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    );
                  } else {
                    return null; // Skip rendering categories without an ID
                  }
                })}
            </select>
          </div>

          {/* End Dropdown List  */}
        </form>
      </div>
      {/* Card body END */}
    </>
  );
}
