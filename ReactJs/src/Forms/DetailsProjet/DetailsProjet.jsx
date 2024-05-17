import React, { useEffect, useState } from "react";
import { Avatar, Col, Divider, Drawer, List, Row, Timeline } from "antd";
import {
  InfoCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import "./DetailsProject.css";
const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);
function DetailsProjet({ open, setOpen, detailProjet }) {
  //   const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    console.log("detailsProjet", detailProjet.projet);
  }, [detailProjet]);
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}-${formattedMonth}-${year}`;
  }
  return (
    <>
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <p
          className="site-description-item-profile-p text-center"
          style={{
            marginBottom: 50,
          }}
        >
          <strong>
            {" "}
            <InfoCircleOutlined className="mx-1" /> Details Project
          </strong>
        </p>

        <Row>
          <Col span={12}>
            <strong>
              <DescriptionItem
                title="Project Name"
                content={detailProjet.projet?.name}
              />
              {/* {detailProjet.projet.name} */}
            </strong>
          </Col>
          <Col span={12}>
            <strong>
              <DescriptionItem
                title="Lieux"
                content={detailProjet.projet?.lieu}
              />
            </strong>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <strong>
              <DescriptionItem
                title="Start Date"
                content={
                  detailProjet.projet?.startDate
                    ? formatDate(detailProjet.projet.startDate)
                    : ""
                }
              />

              {/* {detailProjet.projet.name} */}
            </strong>
          </Col>

          <Col span={12}>
            <strong>
              <DescriptionItem
                title="End Date"
                content={
                  detailProjet.projet?.startDate
                    ? formatDate(detailProjet.projet.endDate)
                    : ""
                }
              />
            </strong>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <strong>
              <DescriptionItem
                title="Description"
                content={detailProjet.projet?.description}
              />

              {/* {detailProjet.projet.name} */}
            </strong>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <strong>
              <DescriptionItem
                title="Subject"
                content={detailProjet.projet?.sujet}
              />

              {/* {detailProjet.projet.name} */}
            </strong>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <strong>
              <DescriptionItem
                title="Ojbectif"
                content={detailProjet.projet?.objectif}
              />

              {/* {detailProjet.projet.name} */}
            </strong>
          </Col>
        </Row>

        <Divider />
        <p className="site-description-item-profile-p">
          <strong>
            {" "}
            <UserOutlined className="mx-2" />
            Createur
          </strong>
        </p>
        <Row>
          <Col span={12}>
            <strong>
              {" "}
              <DescriptionItem
                title="Created by"
                content={detailProjet.projet?.user?.nom}
              />
            </strong>
          </Col>
          <Col span={12}>
            <strong>
              {" "}
              <DescriptionItem
                title="CreatedAt
                "
                content={
                  detailProjet.projet?.createdAt
                    ? formatDate(detailProjet.projet.createdAt)
                    : ""
                }
              />
            </strong>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <strong>
              {" "}
              <DescriptionItem title="Formulaire ASOCIE" />
              <Timeline className="mx-4">
                {detailProjet?.projet?.forms?.map((form) => (
                  <Timeline.Item key={form._id}>{form.title}</Timeline.Item>
                ))}
              </Timeline>
            </strong>
          </Col>
        </Row>

        <Divider />
        <p className="site-description-item-profile-p">
          <strong> Collaborations </strong>
        </p>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Membres collaborteurs"
              content={<TeamOutlined className="mx-2" />}
            />
            {detailProjet?.projet?.membresCollaborateur &&
            detailProjet?.projet?.membresCollaborateur.length > 0 ? (
              <ul>
                {detailProjet?.projet?.membresCollaborateur.map((membre) => (
                  <li key={membre._id}>{membre.nom}</li>
                ))}
              </ul>
            ) : (
              <p>Aucun membre collaborateur associé</p>
            )}
          </Col>

          <Col span={12}>
            <DescriptionItem
              title="Organisations"
              content={<ApartmentOutlined />}
            />

            {detailProjet?.projet?.organisation &&
            detailProjet?.projet?.organisation.length > 0 ? (
              <ul>
                {detailProjet?.projet?.organisation.map((organisation) => (
                  <li key={organisation._id}>{organisation.name}</li>
                ))}
              </ul>
            ) : (
              <p>Aucune organisation associée</p>
            )}
          </Col>
        </Row>
      </Drawer>
    </>
  );
}

export default DetailsProjet;
