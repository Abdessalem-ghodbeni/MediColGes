import React, { useState } from "react";
import axios from "axios";

const Test = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let responseUrl = null;

      if (file) {
        const fileObject = file;
        const formData = new FormData();
        formData.append("file", fileObject);

        console.log(formData);

        axios
          .post("http://localhost:3000/response/add_test", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log(res.data);
          });

        responseUrl = response.data.url;
      }

      const responseData = {
        form: "66046a44af7a36f539287858",
        answers: [
          {
            field: "66046a44af7a36f53928785a",
            value: responseUrl || "", // Ensure value is an empty string if file not uploaded
          },
        ],
      };

      await axios.post("http://localhost:3000/response/add", responseData);

      // Reset form after submission
      setFile(null);
    } catch (error) {
      console.error("Error adding response:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>sec</h2>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Test;
