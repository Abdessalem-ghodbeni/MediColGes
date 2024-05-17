import { Form, Radio, Switch } from "antd";

import AddItemForm from "../../AddItemForm/AddItemForm";
import Forms from "../../Forms";
import ListForms from "../../ListForms/ListForms";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { List, Card, Button, Row, Col, Popconfirm, Tag, Spin } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import classes from "../../ListForms/ListForms.module.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base_url } from "../../../baseUrl";

function FomulairesCollecte({ onImportSwitchChange, onNext, projectData }) {
  const [forms, setForms] = useState([]);
  const [idformulaireToShare, setIdToShare] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    axios.get(`${base_url}/forms/get/all`).then(async (res) => {
      await setForms(res?.data?.formsListe);
      console.log(forms);
    });
    console.log();
  }, []);
  const getFormById = (id) => {
    axios.get(`${base_url}/forms/get/${id}`).then((res) => {
      navigate("/internaute/viewOneForm", {
        state: {
          form: res?.data?.formulaire,
        },
      });
    });
  };

  const EditForm = (id) => {
    axios.get(`${base_url}/forms/get/${id}`).then((res) => {
      navigate("/internaute/AddForm", {
        state: {
          form: res?.data?.formulaire,
        },
      });
    });
  };

  const [importSwitch, setImportSwitch] = useState(true);
  const [newFormsSwitch, setNewFormsSwitch] = useState(true);
  const [isAddFormSwitchDisabled, setIsAddFormSwitchDisabled] = useState(false);
  const [newFormId, setNewFormId] = useState(null);
  const [isImportSwitchDisabled, setIsImportSwitchDisabled] = useState(false);
  const handleImportSwitchChange = (checked) => {
    setImportSwitch(checked);
    onImportSwitchChange(checked);
    console.log(importSwitch);
    setIsAddFormSwitchDisabled(true);
    setNewFormsSwitch(false);
  };
  const handleNewFormId = (newFormId) => {
    // setIdnewFormulaire(newFormId);
    setNewFormId(newFormId);
    console.log("from collect", newFormId);
  };
  useEffect(() => {
    console.log("from collect", newFormId);
  }, [newFormId]);
  const handleNewFormsSwitchChange = (checked) => {
    setNewFormsSwitch(checked);
    console.log(newFormsSwitch);
    setIsImportSwitchDisabled(true);
    setImportSwitch(false);
  };
  const [value, setValue] = useState(1);
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const [form] = Form.useForm();
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = { ...projectData, ...values };

        let newData = {
          ...formData,
        };

        if (importSwitch) {
          newData = {
            ...newData,
            radioValue: value,
          };
        }

        if (newFormsSwitch) {
          newData = {
            ...newData,
            newFormId: newFormId,
          };
        }

        onNext(newData);
      })
      .catch((error) => {
        console.log("Validation failed:", error);
      });
  };

  return (
    <div className="container p-2 mt-5">
      {newFormsSwitch && importSwitch && (
        <div className="row">
          <div className="col-12 col-md-6 p-2">
            <div className="text-center">
              <strong>Importer formulaire deja existant</strong>
              <Switch
                checkedChildren="Oui"
                unCheckedChildren="Non"
                defaultChecked={false}
                className="mx-3"
                onChange={handleImportSwitchChange}
                disabled={isImportSwitchDisabled}
              />
            </div>
            <img
              src="assets/images/addFormulaire.avif"
              className="img-fluid w-100"
              alt=""
            />
          </div>
          <div className="col-12 col-md-6 p-2">
            <div className="text-center">
              <strong>Créer un nouveau formulaire</strong>
              <Switch
                checkedChildren="Oui"
                unCheckedChildren="Non"
                defaultChecked={false}
                className="mx-3"
                onChange={handleNewFormsSwitchChange}
                disabled={isAddFormSwitchDisabled}
              />
            </div>
            <img
              src="assets/images/importerFomulaire.avif"
              className="img-fluid w-100"
              alt=""
            />
          </div>
        </div>
      )}

      {newFormsSwitch && !importSwitch && (
        <Forms newFormsSwitch={newFormsSwitch} onNewFormId={handleNewFormId} />
      )}
      <Form form={form}>
        {importSwitch && !newFormsSwitch && (
          <div className="tab-content mt-4" id="pills-tabContent">
            {/* One way tab START */}
            <div
              className="tab-pane fade show active"
              id="pills-one-way"
              role="tabpanel"
              aria-labelledby="pills-one-way-tab"
            >
              <div className="row g-4 mt-3">
                {/* Leaving From */}

                <div className="col-md-6 col-lg-4 position-relative">
                  <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                    <p className="text-center">
                      <strong>Titre</strong>
                    </p>
                  </div>
                  {/* Auto fill button */}
                  <div className="btn-flip-icon mt-3 mt-md-0">
                    <div className="btn btn-white shadow btn-round mb-0">
                      <i className="fa-solid fa-right-left" />
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 position-relative">
                  <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                    <p className="text-center">
                      {" "}
                      <strong>Description</strong>
                    </p>
                  </div>
                  {/* Auto fill button */}
                  <div className="btn-flip-icon mt-3 mt-md-0">
                    <div className="btn btn-white shadow btn-round mb-0">
                      <i className="fa-solid fa-right-left" />
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                    <p className="text-center">
                      {" "}
                      <strong>Actions</strong>{" "}
                    </p>
                  </div>
                </div>
              </div>
              {forms.length === 0 ? (
                // <Spin spinning={true} size="large" />
                <div class="preloader">
                  <div class="preloader-item">
                    <div class="spinner-grow text-primary"></div>
                  </div>
                </div>
              ) : (
                forms?.map((form) => (
                  <div className="row g-4 mt-3">
                    {/* Leaving From */}

                    <div
                      className="col-md-6 col-lg-4 position-relative"
                      key={form._id}
                    >
                      <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                        <p>{form.title}</p>
                      </div>
                      {/* Auto fill button */}
                      <div className="btn-flip-icon mt-3 mt-md-0">
                        <div className="btn btn-white shadow btn-round mb-0">
                          <i className="fa-solid fa-right-left" />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-4 position-relative">
                      <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                        <p>{form.description}</p>
                      </div>
                      {/* Auto fill button */}
                      <div className="btn-flip-icon mt-3 mt-md-0">
                        <div className="btn btn-white shadow btn-round mb-0">
                          <i className="fa-solid fa-right-left" />
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="form-border-transparent form-fs-lg bg-light rounded-3 h-100 p-3">
                        <div className="d-flex justify-content-center align-items-center">
                          <Button
                            type="button"
                            className={classes.mauve_icon}
                            danger
                            icon={
                              <EditOutlined className={classes.whiteColor} />
                            }
                            size="small"
                            onClick={() => EditForm(form?._id)}
                          ></Button>

                          <Button
                            type="primary"
                            // className={classes.ShareButton}
                            className="mx-3"
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => getFormById(form?._id)}
                          ></Button>
                          <Radio.Group onChange={onChange} value={value}>
                            <Radio value={form?._id}></Radio>
                          </Radio.Group>
                          <div>
                            <Tag
                              className="mx-3"
                              // icon={<SyncOutlined spin />}
                              color="processing"
                              size="large"
                            >
                              {form?.responses.length} Reponses
                            </Tag>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* <ShareLink
           visible={isModalVisible}
           setVisible={setIsModalVisible}
           id={idformulaireToShare}
         /> */}
          </div>
        )}
        <div className="row justify-content-center mt-3">
          <Form.Item className="d-flex justify-content-center mt-3">
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              Suivant <ArrowRightOutlined className="mx-1" />
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}

export default FomulairesCollecte;
