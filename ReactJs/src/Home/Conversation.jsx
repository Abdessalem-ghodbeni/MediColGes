// import React, { useState } from "react";
// import { RobotOutlined } from "@ant-design/icons";
// import "./Gemini.css";
// import Gemini from "./Gemini";
// function Conversation() {
//   const [conversationVisible, setConversationVisible] = useState(false);

//   const handleConversationToggle = () => {
//     setConversationVisible(!conversationVisible);
//   };

//   function renderConversation() {
//     if (conversationVisible) {
//       return (
//         <div className="col-2">
//           <Gemini />
//         </div>
//       );
//     }
//     return null;
//   }

//   return (
//     <>
//       <img
//         src="public/assets/chat.webp"
//         className="cusumer_img img-fluid"
//         onClick={handleConversationToggle}
//         alt=""
//       />
//       {/* <div className="fixed-button">
//         <button >
//           <RobotOutlined /> Ouvrir la conversation
//         </button>
//       </div> */}
//       {renderConversation()}
//     </>
//   );
// }

// export default Conversation;
import React, { useState } from "react";
import { Modal } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import "./Gemini.css";
import Gemini from "./Gemini";

function Conversation() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleConversationToggle = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <img
        src="public/assets/chh.jpg"
        className="cusumer_img img-fluid "
        onClick={handleConversationToggle}
        alt=""
      />

      <Modal
        className="mt-5 center"
        visible={modalVisible}
        title="Commencer vos questions"
        onCancel={handleConversationToggle}
        footer={null}
      >
        <Gemini />
      </Modal>
    </>
  );
}

export default Conversation;
