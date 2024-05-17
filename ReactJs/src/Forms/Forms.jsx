import React, { useState, useEffect } from "react";
import { Input, Form, Row, Col, Radio, ColorPicker, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  DragOutlined,
  BoldOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import classes from "./Forms.module.css";
import { v4 as uuidv4 } from "uuid";
import "react-phone-input-2/lib/style.css";

import DraggableInput from "./DraggableInput/DraggableInput";
import DroppedInput from "./DroppedInput/DroppedInput";
import AddItemForm from "./AddItemForm/AddItemForm";
import {
  FormOutlined,
  NumberOutlined,
  DownOutlined,
  LockOutlined,
  MailOutlined,
  DotChartOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SlidersOutlined,
  ClockCircleOutlined,
  UploadOutlined,
  PhoneOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ListForms from "./ListForms/ListForms";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { base_url } from "../baseUrl";
const { Item: FormItem } = Form;
const { TextArea } = Input;

const Forms = ({ newFormsSwitch, onNewFormId }) => {
  const [color, setColor] = useState("");
  const params = useLocation();
  const [selectedInputs, setSelectedInputs] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedInputDetails, setSelectedInputDetails] = useState({});
  const [form] = Form.useForm();
  const [idnewFormulaire, setIdnewFormulaire] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (params?.state?.form) {
      const { formFields, style, title, description } = params.state.form;
      const initialInputs = formFields.map((field) => ({
        id: field._id,
        label: field.label,
        type: field.fieldType,
        options: field.options
          ? field.options.map((option) => option.label)
          : undefined,
        required: field.validations.required,
        labelFontSize: field.style.fontSize,
        labelFontWeight: undefined,
        labelColor: field.style.textColor,
      }));

      setSelectedInputs(initialInputs);

      setColor(style.backgroundColor || "");
      form.setFieldsValue({
        title: title || "",
        description: description || "",
      });
    }
  }, []);
  const onDragStart = (e, id, label, type, options) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ id, label, type, options })
    );
  };

  const onDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    setSelectedInputs([...selectedInputs, data]);
  };

  const onRemoveOptions = (id) => {
    const updatedSelectedInputs = selectedInputs.map((input) =>
      input.id === id
        ? { ...input, options: undefined } // Remove options for checkbox and radio
        : input
    );
    setSelectedInputs(updatedSelectedInputs);
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const addNewItem = (values) => {
    const newItem = {
      ...selectedInputDetails,
      label: values.label,
      type: values.type,
      options: values.options,
      required: values.required,
      labelFontSize: values.labelFontSize,
      labelFontWeight: values.labelFontWeight,
      labelColor: values.labelColor,
    };
    const updatedInputs = selectedInputs.map((input) =>
      input.id === selectedInputDetails.id ? newItem : input
    );
    setSelectedInputs(updatedInputs);
    closeDrawer();
  };

  const editInputDetails = (
    id,
    label,
    type,
    options,
    required,
    labelFontSize,
    labelFontWeight,
    labelColor
  ) => {
    setSelectedInputDetails({
      id,
      label,
      type,
      options,
      required,
      labelFontSize,
      labelFontWeight,
      labelColor,
    });
  };

  const onFinish = () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      let data = {
        title: form.getFieldsValue().title,
        description: form.getFieldsValue().description,
        style: {
          backgroundColor: color,
        },
        formFields: [],
        userId: localStorage.getItem("USER_ID"),
      };

      selectedInputs.forEach((e) => {
        let inputItem = {
          label: e.label,
          fieldType: e.type,
          validations: {
            required: e.required,
          },
          style: {
            backgroundColor: "white",
            textColor: e.labelColor,
            fontSize: e.labelFontSize,
            textAlign: "center",
          },
          name: e.label,
          placeholder: "",
        };

        if (e.options && e.options.length > 0) {
          inputItem.options = e.options.map((option) => ({
            label: option,
            value: option,
          }));
        }

        const existingField = params?.state?.form?.formFields.find(
          (field) => field.label === e.label
        );

        if (existingField) {
          inputItem._id = existingField._id;
        }

        data.formFields.push(inputItem);
      });
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      if (params?.state?.form) {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
        }).then((result) => {
          if (result.isConfirmed) {
            axios
              .put(
                `${base_url}/forms/update/${params?.state?.form._id}`,
                data,
                axiosConfig
              )
              .then((resultat) => {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Your work has been saved",
                  showConfirmButton: false,
                  timer: 1500,
                });
                navigate("/internaute/listForms");
              })
              .catch((error) => {
                console.error(error);
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong while updating.",
                });
              });
          }
        });
      } else {
        axios
          .post(`${base_url}/forms/add_forms`, data, axiosConfig)
          .then((response) => {
            const responseData = response.data;
            console.log("Response Data:", responseData);
            if (
              responseData.success &&
              responseData.data &&
              responseData.data._id
            ) {
              const newFormId = responseData.data._id;
              console.log("New Form ID:", newFormId);
              setIdnewFormulaire(newFormId);
              onNewFormId(newFormId);
            }
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Your work has been saved",
              showConfirmButton: false,
              timer: 1500,
            });
            if (!newFormsSwitch) {
              navigate("/internaute/listForms");
            }
          })
          .catch((error) => {
            console.error(error);
            // Swal.fire({
            //   icon: "error",
            //   title: "Oops...",
            //   text: "Something went wrong while aa saving.",
            // });
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Your work has been saved",
              showConfirmButton: false,
              timer: 1500,
            });
            if (!newFormsSwitch) {
              navigate("/internaute/listForms");
            }
          });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while saving.",
      });
    }
  };

  const onDeleteField = (id) => {
    const updatedInputs = selectedInputs.filter((input) => input.id !== id);
    setSelectedInputs(updatedInputs);
  };

  return (
    <div className="container vstack gap-4 mb-5 mt-5">
      <div className="row mb-5 card rounded-3 border p-4 pb-2">
        <div className="col-12 mb-5 mt-3">
          <h1 className="fs-4 mb-0">
            {/* <UnorderedListOutlined className="mx-3" />     */}
            <PlusOutlined className="mx-3" />
            Ajouter un formulaire
          </h1>
          <p className="text-center text-justify mt-5">
            <strong>
              "Un bon formulaire médical est comme une carte précise : il guide
              efficacement le chemin vers une compréhension claire et une prise
              en charge appropriée. Créer un formulaire médical, c'est comme
              concevoir un puzzle où chaque pièce est une question précieuse,
              contribuant à la vue d'ensemble de la santé du patient"
            </strong>
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <Row gutter={[16, 16]} style={{ width: "90vw" }}>
            <Col lg={6} className={classes.availableFields}>
              <h5 style={{ marginTop: "1rem" }}>Eléments de formulaire </h5>

              <Row
                gutter={[16, 16]}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  width: "100%",
                }}
              >
                <DraggableInput
                  id={uuidv4()}
                  label="Text Input"
                  type="text"
                  options={undefined}
                  prefix={<FormOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="Number Input"
                  type="number"
                  options={undefined}
                  prefix={<NumberOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="Date Picker"
                  type="date"
                  options={undefined}
                  prefix={<CalendarOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="Checkbox"
                  type="checkbox"
                  options={[]}
                  prefix={<CheckSquareOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="Radio Group"
                  type="radio"
                  options={[]}
                  prefix={<DotChartOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="Select"
                  type="select"
                  options={[]}
                  prefix={<DownOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="Password"
                  type="password"
                  options={undefined}
                  prefix={<LockOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="Email"
                  type="email"
                  options={undefined}
                  prefix={<MailOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="Phone"
                  type="phone"
                  options={undefined}
                  prefix={<PhoneOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="Upload"
                  type="upload"
                  options={undefined}
                  prefix={<UploadOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="Year"
                  type="year"
                  options={undefined}
                  prefix={<CalendarOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="Week"
                  type="week"
                  options={undefined}
                  prefix={<CalendarOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="button"
                  type="Button"
                  prefix={<BoldOutlined />}
                  options={undefined}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="Month"
                  type="month"
                  options={undefined}
                  prefix={<CalendarOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="Time"
                  type="time"
                  options={undefined}
                  prefix={<ClockCircleOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="Slider"
                  type="slider"
                  options={undefined}
                  prefix={<SlidersOutlined />}
                />
                <DraggableInput
                  id={uuidv4()}
                  label="TextArea"
                  type="TextArea"
                  options={undefined}
                  prefix={<FileTextOutlined />}
                />
              </Row>
            </Col>

            <Col
              lg={18}
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              className={classes.dragCol}
            >
              <h5 style={{ marginBlock: "2rem" }}>
                <InfoCircleOutlined className="mx-2" />
                Informations du Formulaire Médicale{" "}
              </h5>
              <div
                className={classes.dragInputs}
                style={{ backgroundColor: color ? color : "white" }}
              >
                <Form form={form}>
                  <fieldset className="custumer_filedSet">
                    <legend>À remplir :</legend>
                    <Form.Item label="Titre" name="title">
                      <Input placeholder="Entrez le titre" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                      <TextArea placeholder="Entrez la description" />
                    </Form.Item>

                    <div className="custumer_color_palltte d-flex align-items-center">
                      <label className="me-3"> couleur Arriere plan : </label>
                      <ColorPicker
                        defaultValue="lightgray"
                        onChangeComplete={(e) => setColor(e.toHexString())}
                      />
                    </div>
                  </fieldset>
                </Form>
              </div>
              <h5 className="d-flex" style={{ marginBlock: "2rem" }}>
                {" "}
                <DragOutlined className="mx-2" />
                Glissez les éléments ici
              </h5>

              <Form
                className={classes.dragInputs}
                form={form}
                style={{ backgroundColor: color ? color : "white" }}
                onFinish={onFinish}
              >
                {selectedInputs.map(
                  (
                    {
                      id,
                      label,
                      type,
                      options,
                      required,
                      labelColor,
                      labelFontSize,
                      labelFontWeight,
                    },
                    index
                  ) => (
                    <Row
                      key={index}
                      onClick={() => {
                        editInputDetails(
                          id,
                          label,
                          type,
                          options,
                          required,
                          labelColor,
                          labelFontSize,
                          labelFontWeight
                        );
                      }}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <DroppedInput
                        key={id}
                        id={id}
                        label={label}
                        type={type}
                        options={options}
                        showDrawer={showDrawer}
                        required={required}
                        labelColor={labelColor}
                        labelFontSize={labelFontSize}
                        labelFontWeight={labelFontWeight}
                      />
                      <EditOutlined onClick={showDrawer} />
                      <DeleteOutlined onClick={() => onDeleteField(id)} />
                    </Row>
                  )
                )}
                {selectedInputs.length > 0 && (
                  <div className="d-flex justify-content-center align-items-center">
                    <button type="submit" class="btn btn-secondary-soft mx-3">
                      {params?.state?.form ? "Edit" : "Save"}
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      onClick={() => {
                        navigate("/internaute/listForms");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* <Button type="primary" htmlType="submit">
            {params?.state?.form ? "Edit" : "Submit"}
          </Button> */}
              </Form>
            </Col>

            <AddItemForm
              visible={drawerVisible}
              onClose={closeDrawer}
              onAddItem={addNewItem}
              selectedInputDetails={selectedInputDetails}
            />
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Forms;
