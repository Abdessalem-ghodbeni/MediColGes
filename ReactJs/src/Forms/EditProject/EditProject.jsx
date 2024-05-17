import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import React from "react";
import { useLocation } from "react-router-dom";
import { base_url } from "../../baseUrl";

const EditProject = () => {
  const [form] = Form.useForm();
  const params = useLocation();
  const project = params?.state?.project;
  const accessToken = localStorage.getItem("accessToken");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const userId = localStorage.getItem("USER_ID");
  const modifyProject = () => {
    const fieldsValue = form.getFieldsValue();
    const data = {
      location: fieldsValue?.location,
      projectName: fieldsValue?.projectName,
      description: fieldsValue?.description,
      subject: fieldsValue?.subject,
      objective: fieldsValue?.objective,
      domain: fieldsValue?.domain,
      startDate: fieldsValue?.startDate,
      endDate: fieldsValue?.endDate,
      userId: userId,
    };

    axios
      .put(`${base_url}/project/update/${project?._id}`, data)
      .then(() => {})
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="card custmer_card p-3">
      <div className="container">
        <div className="text-center my-4">
          <strong>Modifier votre projet</strong>
        </div>
        <Form
          form={form}
          className="mt-3"
          layout="vertical"
          initialValues={{
            projectName: project?.name,
            location: project?.lieu,
            description: project?.description,
            objective: project?.objectif,
            domain: project?.domaine,
            startDate: dayjs(project?.startDate),
            endDate: dayjs(project?.endDate),
            subject: project?.sujet,
          }}
        >
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item
                label="Nom du projet"
                name="projectName"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le nom du projet",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item
                label="Lieu"
                name="location"
                rules={[{ required: true, message: "Veuillez saisir le lieu" }]}
              >
                <Input />
              </Form.Item>
            </Col>{" "}
            <Col lg={12}>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Veuillez saisir la description" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item
                label="Objectif"
                name="objective"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir l'objectif du projet",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item
                label="Domaine"
                name="domain"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le doamine du projet",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item
                label="Date de début"
                name="startDate"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir la date de début du projet",
                  },
                ]}
              >
                <DatePicker className="w-100" />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item
                label="Date de fin"
                name="endDate"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir la date de fin du projet",
                  },
                ]}
              >
                <DatePicker className="w-100" />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item
                label="Sujet"
                name="subject"
                rules={[
                  { required: true, message: "Veuillez saisir le sujet" },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <Button
              style={{
                backgroundColor: "rgba(81, 67, 217, 0.1)",
                color: "#5143d9",
              }}
              onClick={modifyProject}
            >
              Modifier
            </Button>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default EditProject;
