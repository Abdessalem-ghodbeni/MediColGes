import { Button, Checkbox, Collapse, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { base_url } from "../../baseUrl";
import Swal from "sweetalert2";
const { Panel } = Collapse;
function AffectationFormsInToProjects({
  id,
  isModalOpenAffecte,
  setIsModalOpenAffecte,
}) {
  const handleOk = () => {
    setIsModalOpenAffecte(false);
  };
  const handleCancel = () => {
    setIsModalOpenAffecte(false);
  };
  const [listeProjet, setListeProjets] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  useEffect(() => {
    axios
      .get(`${base_url}/project/liste`)
      .then((response) => {
        console.log("aaaaaaaaaaa", response);
        setListeProjets(response.data.ListeProjects);
      })
      .catch((error) => {
        console.error(`Error fetching project loste `, error);
      });
  }, []);

  const handleCheckboxChange = async (projectId) => {
    await setSelectedProjects((prevSelectedProjects) => {
      if (prevSelectedProjects.includes(projectId)) {
        return prevSelectedProjects.filter((id) => id !== projectId);
      } else {
        return [...prevSelectedProjects, projectId];
      }
    });
    console.log(selectedProjects);
  };
  const affecter = async () => {
    const data = {
      projectIdArray: selectedProjects,
      formulaireId: id,
    };
    console.log("sss", data);
    axios
      .post(`${base_url}/forms/affecter`, data)
      .then((response) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to affecte this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, affect it!",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Your forms has been affected ",
              showConfirmButton: false,
              timer: 1500,
            });
          }
          setIsModalOpenAffecte(false);
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while saving.",
        });
      });
  };
  return (
    <>
      <Modal
        title="Basic Modal"
        open={isModalOpenAffecte}
        // onOk={handleOk}
        onCancel={handleCancel}
      >
        <Collapse>
          {listeProjet.map((projet) => (
            <Panel header={projet.name} key={projet._id}>
              <Checkbox
                checked={selectedProjects.includes(projet._id)}
                onChange={() => handleCheckboxChange(projet._id)}
              >
                Je valide l'affectation de ce projet a cet formulaire
              </Checkbox>
            </Panel>
          ))}
        </Collapse>

        <div className="d-flex mt-5 mx-1">
          <Button type="primary" onClick={affecter}>
            Affecter
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default AffectationFormsInToProjects;
