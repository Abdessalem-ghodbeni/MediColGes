import React, { useEffect, useState } from "react";
import { Button, Modal, Input, Checkbox, Collapse, Timeline } from "antd";
import axios from "axios";
import { base_url } from "../../baseUrl";
import Swal from "sweetalert2";

const { Panel } = Collapse;

const ShareLink = ({ visible, setVisible, id }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [listeInternauteUser, setListeInternauteUser] = useState([]);
  const [listePatient, setListePatient] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [tab, seTab] = useState([]);
  const [selectedInternauteEmails, setSelectedInternauteEmails] = useState([]);
  const [selectedPatientEmails, setSelectedPatientEmails] = useState([]);
  const [displayedEmails, setDisplayedEmails] = useState([]);

  useEffect(() => {
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
    getAllPatientUser();
  }, [visible]);

  const handleOk = () => {
    setVisible(false);
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  const handleEmailInputChange = (e) => {
    setEmailInput(e.target.value);
  };

  const handleSaveEmail = () => {
    if (emailInput !== "") {
      setDisplayedEmails((prevEmails) => [...prevEmails, emailInput]);
      setEmailInput("");
    }
  };

  const handleInternauteEmailCheckboxChange = (e, email) => {
    if (e.target.checked) {
      setSelectedInternauteEmails((prevEmails) => [...prevEmails, email]);
      setDisplayedEmails((prevEmails) => [...prevEmails, email]);
    } else {
      setSelectedInternauteEmails((prevEmails) =>
        prevEmails.filter((prevEmail) => prevEmail !== email)
      );
      setDisplayedEmails((prevEmails) =>
        prevEmails.filter((prevEmail) => prevEmail !== email)
      );
    }
  };

  const handlePatientEmailCheckboxChange = (e, email) => {
    if (e.target.checked) {
      setSelectedPatientEmails((prevEmails) => [...prevEmails, email]);
      setDisplayedEmails((prevEmails) => [...prevEmails, email]);
    } else {
      setSelectedPatientEmails((prevEmails) =>
        prevEmails.filter((prevEmail) => prevEmail !== email)
      );
      setDisplayedEmails((prevEmails) =>
        prevEmails.filter((prevEmail) => prevEmail !== email)
      );
    }
  };
  const shareUrl = `${window.location.origin}/formulaire/${id}`;
  const handleSubmit = async () => {
    const data = {
      members: [
        ...selectedInternauteEmails.map((email) => ({ email })),
        ...selectedPatientEmails.map((email) => ({ email })),
        ...displayedEmails.map((email) => ({ email })),
      ],
      formulaireLink: shareUrl,
    };
    console.log("sharewith", data);

    await axios.post(`${base_url}/forms/send`, data).then((response) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to share this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, share it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your forms has been shared",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    });

    setDisplayedEmails([]);
    setSelectedInternauteEmails([]);
    setSelectedPatientEmails([]);
    setEmailInput("");
    setVisible(false);
  };

  return (
    <>
      <Modal
        title="Title"
        visible={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <div className="row my-3   ">
          <div className="col">
            <Input
              addonBefore="Inviter quelqu'un"
              value={emailInput}
              onChange={handleEmailInputChange}
              placeholder="Entrez une adresse e-mail"
            />
          </div>
          {/* <Button onClick={handleSaveEmail}>Enregistrer</Button> */}
          <div className="col mt-3 mt-md-0">
            <Button
              type="primary"
              ghost
              size="default"
              onClick={handleSaveEmail}
              //   className="mx-3 "
            >
              Ajouter
            </Button>
          </div>
        </div>

        <Collapse className="my-3">
          <Panel header="Liste des e-mails des internautes " key="1">
            {listeInternauteUser.map((internaute) => (
              <div key={internaute.id}>
                <Checkbox
                  className="mx-2"
                  onChange={(e) =>
                    handleInternauteEmailCheckboxChange(e, internaute.email)
                  }
                />
                <span>{internaute.email}</span>
              </div>
            ))}
          </Panel>
        </Collapse>
        <Collapse>
          <Panel header="Liste des e-mails des patients" key="2">
            {listePatient.map((patient) => (
              <div key={patient.id}>
                <Checkbox
                  className="mx-2"
                  onChange={(e) =>
                    handlePatientEmailCheckboxChange(e, patient.email)
                  }
                />
                <span>{patient.email}</span>
              </div>
            ))}
          </Panel>
        </Collapse>
        <div className="mt-5">
          {/* <ul>
            {displayedEmails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul> */}
          <Timeline>
            {displayedEmails.map((email, index) => (
              <Timeline.Item key={index}>{email}</Timeline.Item>
            ))}
          </Timeline>
        </div>
        {/* <Button onClick={handleSubmit}>Submit</Button> */}
      </Modal>
    </>
  );
};

export default ShareLink;
