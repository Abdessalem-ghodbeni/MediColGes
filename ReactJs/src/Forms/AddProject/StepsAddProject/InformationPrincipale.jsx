import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { InfoCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
function InformationPrincipale({ onNext, projectData }) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onNext(values);
      })
      .catch((error) => {
        console.log("Validation failed:", error);
      });
  };

  return (
    <div className="card custmer_card p-3">
      <div className="container mt-5">
        <div className="text-center my-4">
          <InfoCircleOutlined
            style={{ fontSize: "24px", color: "#08c" }}
            className="mx-3"
          />

          <strong>Information Principales</strong>
        </div>
        {/* <h5 className="text-center my-4">Information Principales</h5> */}
        <Form
          form={form}
          className="mt-3"
          initialValues={{
            projectName: projectData?.projectName,
            location: projectData?.location,
            description: projectData?.description,
            subject: projectData?.subject,
          }}
        >
          <div className="row">
            <div className="col-12 col-md-6">
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
            </div>
            <div className="col-12 col-md-6">
              <Form.Item
                label="Lieu"
                name="location"
                rules={[{ required: true, message: "Veuillez saisir le lieu" }]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className="row my-3">
            <div className="col-12">
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Veuillez saisir la description" },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Form.Item
                label="Sujet"
                name="subject"
                rules={[
                  { required: true, message: "Veuillez saisir le sujet" },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
            </div>
          </div>
          <div className="row justify-content-center mt-3">
            <Form.Item className="d-flex justify-content-center mt-3">
              <Button
                type="primary"
                htmlType="submit"
                onClick={handleSubmit}
                className="d-flex justify-content-center align-items-center p-3"
              >
                Suivant <ArrowRightOutlined className="mx-1" />
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default InformationPrincipale;
