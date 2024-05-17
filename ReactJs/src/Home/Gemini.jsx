// import React, { useEffect, useState } from "react";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import ChatBot from "react-simple-chatbot";
// function Gemini() {
//   //   const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
//   const API_KEY = "AIzaSyDRit8O2BTD5ulZQsp_JDwBQ4lOi2R290Y";
//   const [data, setData] = useState(undefined);
//   const [inputText, setInputText] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function fetchDataFromGeminiProAPI() {
//     try {
//       // ONLY TEXT
//       if (!inputText) {
//         alert("Please enter text!");
//         return;
//       }
//       setLoading(true);
//       const genAI = new GoogleGenerativeAI(API_KEY);
//       const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//       const result = await model.generateContent(inputText);
//       const text = result.response.text();
//       setLoading(false);
//       setData(text);
//     } catch (error) {
//       setLoading(false);
//       console.error("fetchDataFromGeminiAPI error: ", error);
//     }
//   }

//   async function fetchDataFromGeminiProVisionAPI() {
//     try {
//       // TEXT AND FILE
//       if (!inputText) {
//         alert("Please enter text!");
//         return;
//       }
//       setLoading(true);
//       const genAI = new GoogleGenerativeAI(API_KEY);
//       const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

//       const fileInputEl = document.querySelector("input[type=file]");
//       const imageParts = await Promise.all(
//         [...fileInputEl.files].map(fileToGenerativePart)
//       );
//       const result = await model.generateContent([inputText, ...imageParts]);
//       const text = result.response.text();

//       setLoading(false);
//       setData(text);
//     } catch (error) {
//       setLoading(false);
//       console.error("fetchDataFromGeminiAPI error: ", error);
//     }
//   }

//   async function fileToGenerativePart(file) {
//     const base64EncodedDataPromise = new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result.split(",")[1]);
//       reader.readAsDataURL(file);
//     });
//     return {
//       inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
//     };
//   }
//   useEffect(() => {
//     console.log("zz", API_KEY);
//   }, []);
//   return (
//     <>
//       <div>
//         {/* <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a> */}
//       </div>
//       <h1>Nous sommes ravis de répondre a tous vos questions ...</h1>
//       <div className="card">
//         <input type="file" />
//         <input
//           type="text"
//           style={{ width: 400 }}
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//         />
//         {" | "}
//         <button disabled={loading} onClick={() => fetchDataFromGeminiProAPI()}>
//           {loading ? "Loading..." : "Get PRO data"}
//         </button>
//         <button
//           disabled={loading}
//           onClick={() => fetchDataFromGeminiProVisionAPI()}
//         >
//           {loading ? "Loading..." : "Get PRO Vision data"}
//         </button>
//         <hr />
//         <div>Response: {data}</div>
//       </div>
//     </>
//   );
// }

// export default Gemini;
import React, { useEffect, useState } from "react";
import { Button, Input, Spin, Upload, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { GoogleGenerativeAI } from "@google/generative-ai";

function Gemini() {
  const API_KEY = "AIzaSyDRit8O2BTD5ulZQsp_JDwBQ4lOi2R290Y"; // Remplacez par votre clé d'API Gemini

  const [data, setData] = useState(undefined);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { Dragger } = Upload;

  const fetchGeminiProData = async (model) => {
    if (!inputText) {
      alert("Please enter text!");
      return;
    }

    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const geminiModel = genAI.getGenerativeModel({ model });

      const result = await geminiModel.generateContent(inputText);
      const text = result.response.text();

      setData(text);
      setModalVisible(true);
    } catch (error) {
      console.error("fetchGeminiProData error: ", error);
    }

    setLoading(false);
  };

  const handleTextUpload = () => {
    fetchGeminiProData("gemini-pro");
  };

  const handleVisionUpload = async (file) => {
    const imageParts = await Promise.all([fileToGenerativePart(file)]);
    fetchGeminiProData("gemini-pro-vision");
  };

  const fileToGenerativePart = async (file) => {
    try {
      const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(file);
      });

      const base64EncodedData = await base64EncodedDataPromise;

      return {
        inlineData: { data: base64EncodedData, mimeType: file.type },
      };
    } catch (error) {
      console.error("fileToGenerativePart error: ", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="gemini-container">
      <p className="text-justify my-2">
        <strong>Nous Sommes Ravis de répondre a tous vos questions ...</strong>
      </p>
      <div className="gemini-card">
        <Dragger
          className="my-3"
          accept=".jpg,.jpeg,.png"
          beforeUpload={() => false}
          showUploadList={false}
          onChange={(info) => {
            const file = info.fileList[0];
            handleVisionUpload(file);
          }}
        >
          <Button icon={<UploadOutlined />}>Ajouter fichier </Button>
        </Dragger>

        <Input
          className="text-input my-3 "
          placeholder="Entrez votre texte"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="text-center">
          <Button
            className="pro-button mt-3 "
            type="primary"
            loading={loading}
            onClick={handleTextUpload}
          >
            {loading ? "Chargement..." : "Envoyer"}
          </Button>
        </div>

        <Modal
          visible={modalVisible}
          title="Réponse"
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              Fermer
            </Button>,
          ]}
        >
          {loading ? <Spin size="large" /> : <span>{data}</span>}
        </Modal>
      </div>
    </div>
  );
}

export default Gemini;
