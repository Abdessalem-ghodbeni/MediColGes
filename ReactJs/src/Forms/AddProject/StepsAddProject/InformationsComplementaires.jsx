import {
  DatePicker,
  Form,
  Input,
  Button,
  Collapse,
  Checkbox,
  Timeline,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  TeamOutlined,
  ArrowRightOutlined,
  LeftOutlined,
  ClusterOutlined,
} from "@ant-design/icons";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { base_url } from "../../../baseUrl";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const { Panel } = Collapse;
function InformationsComplementaires({ projectData, onNext }) {
  const [listeInternauteUser, setListeInternauteUser] = useState([]);
  const [listeOrganisation, setListeOrganistation] = useState([]);
  const [listePatient, setListePatient] = useState([]);
  const [selectedInternauteEmails, setSelectedInternauteEmails] = useState([]);
  const [selectedPatientEmails, setSelectedPatientEmails] = useState(
    sessionStorage.getItem("selectedPatientEmails")
      ? JSON.parse(sessionStorage.getItem("selectedPatientEmails"))
      : []
  );
  const [displayedEmails, setDisplayedEmails] = useState(
    sessionStorage.getItem("displayedEmails")
      ? JSON.parse(sessionStorage.getItem("displayedEmails"))
      : []
  );
  const [membresCollaborateur, setmembresCollaborateur] = useState(
    sessionStorage.getItem("membresCollaborateur")
      ? JSON.parse(sessionStorage.getItem("membresCollaborateur"))
      : []
  );
  const [organisationCollaboration, setOrganisationsCollaboration] = useState(
    []
  );
  useEffect(() => {
    console.log(projectData);
    const getAllInternaute = async () => {
      try {
        const response = await axios.get(`${base_url}/internaute/`);
        setListeInternauteUser(response.data.data);
      } catch (error) {
        alert("Something went wrong");
      }
    };

    const getAllPatientUser = async () => {
      try {
        const response = await axios.get(`${base_url}/patient/`);
        setListePatient(response.data.data);
      } catch (error) {
        alert("Something went wrong");
      }
    };

    getAllInternaute();
    console.log("yup", listeInternauteUser);

    getAllPatientUser();
    console.log("dd", listePatient);

    const getAllOrganisation = async () => {
      try {
        const response = await axios.get(`${base_url}/organizations/`);
        // setListePatient(response.data.data);
        console.log("organisation liste is : ", response);
        setListeOrganistation(response.data);
      } catch (error) {
        alert("Something went wrong");
      }
    };
    getAllOrganisation();
  }, []);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const combinedEmails = [
          ...selectedInternauteEmails,
          ...selectedPatientEmails,
        ];
        const newData = {
          ...projectData,
          ...values,
          membresCollaborateur: combinedEmails,
          organisation: organisationCollaboration,
        };
        onNext(newData);
        sessionStorage.setItem(
          "membresCollaborateur",
          JSON.stringify(membresCollaborateur)
        );
        sessionStorage.setItem(
          "displayedEmails",
          JSON.stringify(displayedEmails)
        );
        sessionStorage.setItem(
          "selectedPatientEmails",
          JSON.stringify(selectedPatientEmails)
        );
      })
      .catch((error) => {
        console.log("Validation failed:", error);
      });
  };

  const [form] = Form.useForm();

  const handleInternauteEmailCheckboxChange = (e, email, internauteId) => {
    if (e.target.checked) {
      setSelectedInternauteEmails((prevEmails) => [...prevEmails, email]);
      setDisplayedEmails((prevEmails) => [...prevEmails, email]);
      setmembresCollaborateur((prevMembres) => [...prevMembres, internauteId]);
      console.log(membresCollaborateur);
    } else {
      setSelectedInternauteEmails((prevEmails) =>
        prevEmails.filter((prevEmail) => prevEmail !== email)
      );
      setDisplayedEmails((prevEmails) =>
        prevEmails.filter((prevEmail) => prevEmail !== email)
      );
    }
  };

  const handleOrganisationNameCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setOrganisationsCollaboration((prevIds) => [...prevIds, id]);
      // setDisplayedEmails((prevIds) => [...prevIds, id]);
      console.log("a", organisationCollaboration);
    } else {
      setOrganisationsCollaboration(
        (prevIds) => prevIds.filter((prevId) => prevId !== id) // Utilisez prevIds au lieu de prevEmails
      );
      // setDisplayedEmails(
      //   (prevIds) => prevIds.filter((prevId) => prevId !== id) // Utilisez prevIds au lieu de prevEmails
      // );
    }
  };

  // const handlePatientEmailCheckboxChange = (e, email) => {
  //   if (e.target.checked) {
  //     setSelectedPatientEmails((prevEmails) => [...prevEmails, email]);
  //     setDisplayedEmails((prevEmails) => [...prevEmails, email]);
  //     console.log("a", selectedPatientEmails);
  //   } else {
  //     setSelectedPatientEmails((prevEmails) =>
  //       prevEmails.filter((prevEmail) => prevEmail !== email)
  //     );
  //     setDisplayedEmails((prevEmails) =>
  //       prevEmails.filter((prevEmail) => prevEmail !== email)
  //     );
  //   }
  // };

  const handlePatientEmailCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSelectedPatientEmails((prevIds) => [...prevIds, id]);
      setDisplayedEmails((prevIds) => [...prevIds, id]);
      console.log("a", selectedPatientEmails);
    } else {
      setSelectedPatientEmails((prevIds) =>
        prevIds.filter((prevId) => prevId !== id)
      );
      setDisplayedEmails((prevIds) =>
        prevIds.filter((prevId) => prevId !== id)
      );
    }
  };
  // const handlePatientEmailCheckboxChanges = (e, internauteId) => {
  //   if (e.target.checked) {
  //     setmembresCollaborateur((prevMembres) => [...prevMembres, internauteId]);
  //     console.log(membresCollaborateur);
  //   } else {
  //     console.log("ss");
  //     setmembresCollaborateur((prevMembres) => {
  //       prevMembres.filter((prevMembres) => prevMembres != internauteId);
  //     });
  //   }
  // };
  const handlePatientEmailCheckboxChanges = (e, internauteId) => {
    if (e.target.checked) {
      setmembresCollaborateur((prevMembres) => [...prevMembres, internauteId]);
      console.log(membresCollaborateur);
    } else {
      console.log("ss");
      setmembresCollaborateur((prevMembres) =>
        prevMembres?.filter((prevMembre) => prevMembre !== internauteId)
      );
    }
  };
  return (
    <div className="container mt-5">
      <div className="text-center my-4">
        <InfoCircleOutlined
          style={{ fontSize: "24px", color: "#08c" }}
          className="mx-3"
        />

        <strong>Information Complémentaires</strong>
      </div>

      <Form
        form={form}
        className="mt-3"
        initialValues={{
          objective: projectData?.objective,
          domain: projectData?.domain,
          startDate: dayjs(projectData?.startDate),
          endDate: dayjs(projectData?.endDate),
        }}
      >
        <div className="row">
          <div className="col-12 col-md-6 pt-2 mt-3">
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
          </div>
          <div className="col-12 col-md-6 pt-2 mt-3">
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
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-6 pt-2 mt-3">
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
          </div>
          <div className="col-12 col-md-6 pt-2 mt-3">
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
          </div>
        </div>
        <div
          className="text-center my-4"
          style={{ color: "#96969a", fontSize: "100%" }}
        >
          <TeamOutlined
            style={{ fontSize: "24px", color: "#08c" }}
            className="mx-3"
          />
          <strong>Collaboration </strong>
        </div>

        <Collapse className="my-3">
          <Panel header="Liste des e-mails des internautes " key="1">
            {listeInternauteUser.map((internaute) => (
              <div key={internaute._id}>
                <Checkbox
                  name={internaute._id}
                  defaultChecked={membresCollaborateur.includes(internaute._id)}
                  className="mx-2"
                  onChange={async (e) => {
                    await handleInternauteEmailCheckboxChange(
                      e,
                      internaute._id
                    );
                    handlePatientEmailCheckboxChanges(e, internaute._id);

                    console.log(membresCollaborateur);
                  }}
                />
                <span>{internaute.email}</span>
              </div>
            ))}
          </Panel>
        </Collapse>
        {/* <Collapse>
          <Panel header="Liste des e-mails des patients" key="2">
            {listePatient.map((patient) => (
              <div key={patient.id}>
                <Checkbox
                  defaultChecked={selectedPatientEmails?.includes(
                    patient.email
                  )}
                  className="mx-2"
                  onChange={(e) =>
                    handlePatientEmailCheckboxChange(e, patient.email)
                  }
                />
                <span>{patient.email}</span>
              </div>
            ))}
          </Panel>
        </Collapse> */}
        <Collapse>
          <Panel header="Liste des e-mails des patients" key="2">
            {listePatient.map((patient) => (
              <div key={patient._id}>
                <Checkbox
                  defaultChecked={selectedPatientEmails?.includes(patient._id)}
                  className="mx-2"
                  onChange={(e) =>
                    handlePatientEmailCheckboxChange(e, patient._id)
                  }
                />
                <span>{patient.email}</span>
              </div>
            ))}
          </Panel>
        </Collapse>
        {/* <div className="mt-5">
          <Timeline>
            {displayedEmails?.map((email, index) => (
              <Timeline.Item key={index}>{email}</Timeline.Item>
            ))}
          </Timeline>
        </div> */}
        <div
          className="text-center my-4"
          style={{ color: "#96969a", fontSize: "100%" }}
        >
          <ClusterOutlined
            style={{ fontSize: "24px", color: "#08c" }}
            className="mx-3"
          />
          <strong>Organisations </strong>
        </div>

        <Collapse>
          <Panel header="Liste des noms d'organisations " key="3">
            {listeOrganisation.map((organisation) => (
              <div key={organisation._id}>
                <Checkbox
                  defaultChecked={organisationCollaboration?.includes(
                    organisation._id
                  )}
                  className="mx-2"
                  onChange={(e) =>
                    handleOrganisationNameCheckboxChange(e, organisation._id)
                  }
                />
                <span>{organisation.name}</span>
              </div>
            ))}
          </Panel>
        </Collapse>
        <div className="row justify-content-center mt-5">
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
  );
}

export default InformationsComplementaires;
