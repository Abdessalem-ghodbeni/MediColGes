import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form } from "antd";
import DroppedInput from "../DroppedInput/DroppedInput";
import classes from "./ViewOneForm.module.css";
import { FormOutlined, AlignCenterOutlined } from "@ant-design/icons";
import { base_url } from "../../baseUrl";
import Swal from "sweetalert2";
import axios from "axios";
const ViewOneForm = () => {
  const [form] = Form.useForm();

  const params = useLocation();
  useEffect(() => {
    console.log("yello", params?.state?.form);
  }, [form]);
  const USER_ROLE = localStorage.getItem("USER_ROLE");
  const navigate = useNavigate();
  const handleFormSubmit = () => {
    console.log(form.getFieldsValue());
    const formValues = form.getFieldsValue();
    const promises = Object.keys(formValues).map((key) => {
      if (typeof formValues[key] === "object") {
        const fileList = formValues[key].fileList;
        if (fileList && fileList.length > 0) {
          const fileObject = fileList[0].originFileObj;
          const formData = new FormData();
          formData.append("file", fileObject);

          return axios
            .post(`${base_url}/response/add_test`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => res.data.url)
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong while upload file...",
              });
            });
        }
      }
      return formValues[key];
    });

    Promise.all(promises)
      .then((values) => {
        const answers = Object.keys(formValues).map((key, index) => ({
          field: key,
          value:
            typeof formValues[key] === "object" && formValues[key].fileList
              ? values[index]
              : formValues[key],
        }));
        const accessToken = localStorage.getItem("accessToken");
        const axiosConfig = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const userId = localStorage.getItem("USER_ID");

        const data = {
          form: params?.state?.form?._id,
          answers: answers,
          userId: userId,
        };

        axios
          .post(`${base_url}/reponseBlockchain/add`, data, axiosConfig)
          .then((res) => {
            console.log(res.data);
            if (USER_ROLE === "patients") {
              navigate("/patient/listResponse");
            }

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Your work has been saved",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      })
      .catch((error) => {
        console.error("Error processing form data:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while saving.",
        });
      });
  };

  return (
    // <div
    <>
      {USER_ROLE === "internautes" || USER_ROLE === "superAdmin" ? (
        <div className="container vstack mt-4 gap-4 mb-3">
          <div className="row">
            <div className="col-12">
              <h1 className="fs-4 mb-0">
                <FormOutlined className="mx-3" />
                Details du formulaire
              </h1>
            </div>
          </div>
          <Form
            className={classes.formStyle}
            form={form}
            onFinish={handleFormSubmit}
          >
            <h4 style={{ marginBottom: "4rem" }}>bienvenue !</h4>
            {params?.state?.form?.formFields?.map((elem) => (
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
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </div>
      ) : (
        <div className="col-lg-8 col-xl-9">
          <div className="pt-0">
            <div className="container vstack gap-4">
              <div className="page-content-wrapper ">
                <div className="row">
                  <div className="col-12 mb-4 mb-sm-5">
                    <div className="d-sm-flex justify-content-between align-items-center text-center">
                      <p className=" mb-3 mb-sm-0 d-sm-flex justify-content-between align-items-center text-center">
                        {" "}
                        <AlignCenterOutlined className="mx-3" />
                        <strong>
                          {" "}
                          Vous etes invité à repondre a cet formulaire ...
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
                <Form
                  className={classes.formStyle}
                  form={form}
                  onFinish={handleFormSubmit}
                >
                  <h4 style={{ marginBottom: "4rem" }}>bienvenue !</h4>
                  {params?.state?.form?.formFields?.map((elem) => (
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
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewOneForm;
