import React, { useState, useEffect } from "react";
import axios from "axios";

function organizationDetails({ organization }) {
  const [categories, setCategories] = useState({
    id: "",
    name: "",
    description: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    category_id: "",
  });
  const [contact, setContact] = useState({
    address: "",
    email: "",
    phone: "",
  });
  const [nameError, setNameError] = useState(false);

  // Update form data when organization prop changes (optional)
  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization?.organization?.name || "",
        description: organization?.organization?.description || "",
        website: organization?.organization?.website || "",
        category_id: organization?.organization?.category_id || "",
      });
      setContact({
        address: organization?.organization?.contact?.address || "",
        email: organization?.organization?.contact?.email || "",
        phone: organization?.organization?.contact?.phone || "",
      });
    }
  }, [organization]);

  //display categories List
  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching organizations:", error));
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Verify organization name format (no numbers allowed)
    if (name === "name" && /\d/.test(value)) {
      setNameError(true); // Set error state to true
      return;
    } else {
      setNameError(false); // Reset error state
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    organization.organization = { ...formData, [name]: value };
  };
  const handleChangeContact = (event) => {
    const { name, value } = event.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
    setFormData((prevFormData) => ({
      ...prevFormData,
      contact: {
        ...prevFormData.contact,
        [name]: value,
      },
    }));
  };

  return (
    <>
      {/* Card body Begin */}
      <div className="card-body">
        <form className="row g-4 align-items-center">
          {/* Name item */}
          <div className="col-xl-6">
            <label className="form-label">Orgonization Name </label>
            <input
              name="name"
              type="text"
              className="form-control"
              placeholder="Site Name"
              value={formData.name}
              onChange={handleChange}
            />
            {/* <div className="form-text">Enter Orgonization Name.</div> */}
            <div
              className="form-text"
              style={{ color: nameError ? "red" : "inherit" }}
            >
              {nameError
                ? "Organization name should not contain numbers."
                : "Enter Organization Name."}
            </div>
          </div>

          {/* Description --> Textarea item */}
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows={3}
              defaultValue={""}
              value={formData.description}
              onChange={handleChange}
            />
            <div className="form-text">
              For writing a brief description of your organization.
            </div>
          </div>

          {/* Begin Contact Object */}
          {/* email item */}
          <div className="col-12">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="text"
              className="form-control"
              placeholder="Email"
              value={contact.email}
              onChange={handleChangeContact}
            />
            <div className="form-text">Should be a valid email address.</div>
          </div>
          {/* Category item */}
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

          {/* Contact Address item */}
          <div className="col-12">
            <label className="form-label">Contact Address</label>
            <textarea
              name="address"
              type="text"
              className="form-control"
              // rows={3}
              // defaultValue={""}
              value={contact.address}
              onChange={handleChangeContact}
            />
            <div className="form-text">Enter support address.</div>
          </div>

          {/* Contact phone item */}
          <div className="col-lg-6">
            <label className="form-label">Contact Phone</label>
            <input
              name="phone"
              type="text"
              className="form-control"
              placeholder="Contact Phone"
              value={contact.phone}
              onChange={handleChangeContact}
            />
            <div className="form-text">Used for contact and support.</div>
          </div>
          {/* End Contact Object */}

          {/* WebSite item */}
          <div className="col-lg-6">
            <label className="form-label">Web Site</label>
            <input
              name="website"
              type="text"
              className="form-control"
              placeholder="WebSite URL"
              value={formData.website}
              onChange={handleChange}
            />
            <div className="form-text">Enter your website URL.</div>
          </div>
        </form>
      </div>

      {/* Card body END */}
    </>
  );
}

export default organizationDetails;
