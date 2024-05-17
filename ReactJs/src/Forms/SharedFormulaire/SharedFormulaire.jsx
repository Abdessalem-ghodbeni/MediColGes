import { Form } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DroppedInput from "../DroppedInput/DroppedInput";
import classes from "./SharedForms.module.css";
import { FormOutlined } from "@ant-design/icons";
const SharedFormulaire = () => {
  const { id } = useParams();
  const [formulaire, setFormulaire] = useState({});
  useEffect(() => {
    console.log(id);
    axios.get(`http://localhost:3000/forms/get/${id}`).then((res) => {
      console.log(res);
      setFormulaire(res.data.formulaire);
    });
  }, [id]);
  return (
    <>
      <div className="container vstack gap-4 mb-5">
        <Form className={classes.formStyle}>
          <h4 style={{ marginBottom: "4rem" }}>{formulaire?.title}</h4>
          {formulaire?.formFields?.map((elem) => (
            <DroppedInput
              key={elem._id}
              id={elem._id}
              label={elem.label}
              type={elem.fieldType}
              options={elem.options}
              required={elem.validations?.required}
              showDrawer={false}
              labelColor={elem.style?.textColor}
              labelFontSize={elem.style?.fontSize}
              labelFontWeight={elem.style?.fontWeight}
            />
          ))}
        </Form>
      </div>
    </>
  );
};

export default SharedFormulaire;
