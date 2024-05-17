import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
function ShowImg({ isModalOpen, setIsModalOpen, url }) {
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    console.log(url);
  }, [url]);
  return (
    <>
      <Modal open={isModalOpen} onCancel={handleCancel} onOk={handleOk}>
        <img src={url} alt="" />
      </Modal>
    </>
  );
}

export default ShowImg;
