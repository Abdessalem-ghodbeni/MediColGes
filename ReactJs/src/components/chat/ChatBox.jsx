import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import axios from "axios";
import "../chat/ChatBox.css";
import { BiPaperclip, BiVideo } from "react-icons/bi"; // Import BiVideo icon
import Swal from 'sweetalert2';
// import cloudinary from 'cloudinary-react';

const ChatBox = () => {
  const { currentChat, user, getUserById, isMessagesLoading, sendTextMessage, onlineUsers, predictText,generateImage } = useContext(ChatContext);
  const loggedInUserData = JSON.parse(localStorage.getItem("USER"));

  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [receiver, setReceiver] = useState(null);
  const scroll = useRef();
  const googleMeetLinks = [
    "vzg-mjsu-xuz",
    "asv-cpjv-vfo",
    "yza-wxub-sth",
    "rqu-hkjn-umh",
  ];
//   const handlePredict = async () => {
//     try {
//         if (messages.length === 0) {
//             console.log("No messages to predict.");
//             return;
//         }

//         // Get the latest received message
//         const latestReceivedMessage = messages[messages.length - 1];

//         // Check if the latest message was sent by the current user
//         if (latestReceivedMessage.senderId === loggedInUserData.data.data._id) {
//             console.log("Latest message was sent by the current user. Skipping prediction.");
//             return;
//         }

//         // Extract the text from the latest received message
//         const text = latestReceivedMessage.text;

//         // Predict concepts for the extracted text
//         const concepts = await predictText(text);

//         console.log("Predicted concepts:", concepts);

//         // Check if the 'toxic' concept has a high value
//         const toxicConcept = concepts.find(concept => concept.name === 'toxic');
//         if (toxicConcept && toxicConcept.value >= 0.5) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Danger: The discussion is not good.',
//                 text: 'Consider ending the conversation.',
//                 footer: '<a href="#">do you want to Inform the administration?</a>'
//             });
//             console.log("Danger: The discussion is not good.");
//             // You can add further actions or alerts here if needed
//         } else {
//             console.log("No toxic behavior detected. Good communication.");
//         }
//     } catch (error) {
//         console.error("Error predicting concepts:", error);
//     }
// };
const handlePredict = async () => {
  try {
      if (messages.length === 0) {
          console.log("No messages to predict.");
          return;
      }

      // Get the latest received message
      const latestReceivedMessage = messages[messages.length - 1];

      // Check if the latest message was sent by the current user
      if (latestReceivedMessage.senderId === loggedInUserData.data.data._id) {
          console.log("Latest message was sent by the current user. Skipping prediction.");
          return;
      }

      // Extract the text from the latest received message
      const text = latestReceivedMessage.text;

      // Predict concepts for the extracted text
      const concepts = await predictText(text);

      console.log("Predicted concepts:", concepts);

      // Define thresholds for toxicity levels
      const thresholds = {
          Low: [0, 0.3],
          Moderate: [0.3, 0.6],
          Severe: [0.6, 1]
      };

      // Define attribute names and their respective toxicities
      const attributeToxicities = {
          toxic: "Toxicity",
          threat: "Threat",
          identity_hate: "Identity Hate",
          severe_toxic: "Severe Toxicity",
          obscene: "Obscenity",
          insult: "Insult"
      };

      // Initialize an object to store the toxicity level for each attribute
      const toxicityLevels = {};

      // Check each attribute and determine its toxicity level
      Object.entries(attributeToxicities).forEach(([attribute, toxicityLabel]) => {
          const concept = concepts.find(concept => concept.name === attribute);
          if (concept) {
              const value = concept.value;
              const toxicityLevel = Object.entries(thresholds).find(([level, [min, max]]) => value >= min && value < max);
              toxicityLevels[toxicityLabel] = toxicityLevel ? toxicityLevel[0] : "Unknown";
          }
      });

      // Prepare the message to display in the popup
      let message = "<ul>";
      Object.entries(toxicityLevels).forEach(([label, level]) => {
          message += `<li>${label}: ${level}</li>`;
      });
      message += "</ul>";

      // Display the toxicity details in a popup
      Swal.fire({
          icon: 'error',
          title: 'Toxicity Details',
          footer: '<a href="#">do you want to Inform the administration?</a>',
          html: message
          
      });

  } catch (error) {
      console.error("Error predicting concepts:", error);
  }
};



const [promptText, setPromptText] = useState("");
const [cloudinaryURL, setCloudinaryURL] = useState(""); // Add state for cloudinaryURL

const handleGenerateImage = async () => {
  try {
    // Call the generateImage function with the prompt text
    console.log('before generate');
    const { cloudinaryURL} = await generateImage(promptText); // Capture cloudinaryURL and output
    console.log('Cloudinary URL:', cloudinaryURL);
   
    const newMessage = {
      chatId: currentChat._id,
      senderId: loggedInUserData.data.data._id,
      text: cloudinaryURL, // Include the base64-encoded image data
      isImage: true,
    };

    // Send the message to the server
    await axios.post("http://localhost:3000/api/messages", newMessage);

    // Update the state to display the message in the chat box
    setMessages([...messages, newMessage]);

    // Update state with cloudinaryURL
    setCloudinaryURL(cloudinaryURL);
    // Clear the prompt text field
    setPromptText("");
  } catch (error) {
    console.error("Error generating or sending image messages:", error);
  }
};

// const cloudinaryUrl = "cloudinary://663346463281337:0pQ8SbDV20Ku9qfM0-c2A6F6gBs@duijyk2qg";

// const handleGenerateImage = async () => {
//   try {
//     // Call the generateImage function with the prompt text
//     const generatedImageURL = await generateImage(promptText);

//     // Fetch the generated image file
//     const response = await fetch(generatedImageURL);
//     if (!response.ok) {
//       throw new Error('Failed to fetch generated image');
//     }
//     const generatedImageFile = await response.blob(); // Convert response to Blob object

//     // Create FormData and append the generated image file
//     const formData = new FormData();
//     formData.append('file', generatedImageFile);
//     formData.append('upload_preset', uploadPreset);

//     // Upload the generated image to Cloudinary
//     const uploadResponse = await fetch(`${cloudinaryUrl}/image/upload`, {
//       method: 'POST',
//       body: formData,
//     });

//     if (!uploadResponse.ok) {
//       throw new Error('Failed to upload image to Cloudinary');
//     }

//     // Parse the Cloudinary response to get the public URL of the uploaded image
//     const cloudinaryResponse = await uploadResponse.json();
//     const uploadedImageURL = cloudinaryResponse.secure_url;

//     // Now you can use the uploadedImageURL as needed
//     console.log('Uploaded image URL:', uploadedImageURL);

//     // Clear the prompt text field
//     setPromptText('');

//   } catch (error) {
//     console.error('Error generating or uploading image:', error);
//   }
// };




  const absoluteMeetLinks = googleMeetLinks.map(link => `https://meet.google.com/${link}`);
  
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) {
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/messages/${currentChat._id}`);
        setMessages(response.data);
        // Scroll to the bottom of the chat
        scroll.current?.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentChat, messages]);

  useEffect(() => {
    const fetchReceiver = async () => {
      if (!currentChat || !loggedInUserData || !currentChat.members) {
        return;
      }

      const receiverId = currentChat.members.find((member) => member !== loggedInUserData.data.data._id);

      if (!receiverId) {
        return;
      }

      try {
        const user2 = await getUserById(receiverId);
        setReceiver(user2);
      } catch (error) {
        console.error("Error fetching recipient:", error);
      }
    };

    fetchReceiver();
  }, [currentChat, user, getUserById]);

  const handleSendMessage = async () => {
    if (!textMessage || textMessage.trim() === "") {
      console.log("Empty message. Please type something...");
      return;
    }

    const newMessage = {
      chatId: currentChat._id,
      senderId: loggedInUserData.data.data._id,
      text: textMessage,
    };

    try {
      await axios.post("http://localhost:3000/api/messages", newMessage);
      setMessages([...messages, newMessage]);
      setTextMessage("");
      // Scroll to the bottom of the chat
      scroll.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      // console.log(imageData);
      // const imageData = "fffff.png";
      const newMessage = {
        chatId: currentChat._id,
        senderId: loggedInUserData.data.data._id,
        text: imageData,
        isImage: true,
      };

      try {
        axios.post("http://localhost:3000/api/messages", newMessage);
        setMessages([...messages, newMessage]);
        setTextMessage("");
        // Scroll to the bottom of the chat
        scroll.current?.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleStaticFileChange = () => {
    const staticImagePath = '../ffff.png'; // Replace with the path to your static image

    // Fetch the static image file
    fetch(staticImagePath)
        .then(response => response.blob()) // Convert the response to a Blob object
        .then(blob => {
            // Create a FileReader instance
            const reader = new FileReader();

            // Define the onload event handler
            reader.onload = () => {
                // Read the image file as a data URL
                const imageDataURL = reader.result;

                // Create a new message object with the data URL
                const newMessage = {
                    chatId: currentChat._id,
                    senderId: loggedInUserData.data.data._id,
                    text: imageDataURL,
                    isImage: true,
                };

                try {
                    // Send the message to the server
                    axios.post("http://localhost:3000/api/messages", newMessage);

                    // Update the state to display the message in the chat box
                    setMessages([...messages, newMessage]);
                    setTextMessage("");

                    // Scroll to the bottom of the chat
                    scroll.current?.scrollIntoView({ behavior: "smooth" });
                } catch (error) {
                    console.error("Error sending message:", error);
                }
            };

            // Read the static image Blob as a data URL
            reader.readAsDataURL(blob);
        })
        .catch(error => {
            console.error("Error fetching static image:", error);
        });
};


  const handleCameraClick = async () => {
    if (!currentChat) {
      console.error("No conversation selected");
      return;
    }

    // Generate a valid Google Meet link using "https://meet.google.com/new"
    const meetLink = await generateGoogleMeetLink();
    console.log('meetLink:', meetLink); // For testing purposes

    // Notify the user that the link has been generated
    console.log("Google Meet link generated. Sending...");

    // Create a new message object for the other user
    const newMessage = {
      chatId: currentChat._id,
      senderId: loggedInUserData.data.data._id,
      text: `${loggedInUserData.data.data.nom} ${loggedInUserData.data.data.prenom} started a video call. Click to join: <a href="${meetLink}" target="_blank" class="meet-link">${meetLink}</a>`,
    };

    try {
      // Send the message to the server
      await axios.post("http://localhost:3000/api/messages", newMessage);
      
      // Update the state to display the message in the chat box
      setMessages([...messages, newMessage]);

      // Optionally, you can also scroll to the bottom of the chat box
      scroll.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message:", error);
    }

    // Open the Google Meet link in a new tab
    window.open(meetLink, "_blank");
  };

  const generateGoogleMeetLink = async () => {
    const randomIndex = Math.floor(Math.random() * absoluteMeetLinks.length);
    const selectedLink = absoluteMeetLinks[randomIndex];
    console.log('google link isssss:',selectedLink)
    return selectedLink; // Replace this with the actual logic to generate the link
  };

  if (!currentChat) {
    return (
      <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "20vh", // Pour centrer verticalement
      }}
    >
      <p
        style={{
          textAlign: "center",
          width: "50%",
          padding: "20px",
          fontSize: "1rem",
          color: "#555",
          fontStyle: "italic",
          border: "1px dashed #aaa",
          borderRadius: "10px",
          backgroundColor: "#f7f7f7",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          animation: "swing 2s ease-in-out infinite",
        }}
      >
        No conversation selected yet...
      </p>
    </div>
  );
};

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong style={{ fontSize: "1.2rem", marginRight: "10px" }}>{receiver ? `${receiver.nom} ${receiver.prenom}` : ""}</strong>
        {/* Add camera icon here */}
        <BiVideo
          style={{ fontSize: "24px", cursor: "pointer" }}
          onClick={handleCameraClick}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter prompt text..."
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)} // Update prompt text state
        />
      <button onClick={handlePredict}>Predict</button>
      <button onClick={handleGenerateImage}>Generate Image</button>
    </div>
      <Stack gap={3} className="messages">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <Stack
              key={index}
              className={`message ${
                message.senderId === loggedInUserData.data.data._id
                  ? "self align-self-end"
                  : "align-self-start"
              } flex-grow-0`}
            >
              {message.isImage ? (
                <img src={message.text} alt="Sent Image" />
              ) : (
                <span className={message.senderId === loggedInUserData.data.data._id ? "sent-message" : "received-message"} dangerouslySetInnerHTML={{ __html: message.text }} />
              )}
              <span className="message-time">{moment(message.createdAt).calendar()}</span>
            </Stack>
          ))
        ) : (
          <p>No messages</p>
        )}
        {/* Placeholder div for scrolling */}
        {/* <div ref={scroll}></div> */}
      </Stack>
      <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="nunito"
          borderColor="rgba(72,112,223, 0.2)"
        />
        <label htmlFor="file-upload" className="send-btn">
          <BiPaperclip />
        </label>
        <input
          id="file-upload"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {/* <button className="upload" onClick={handleStaticFileChange}></button> */}
        <button className="send-btn" onClick={handleSendMessage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
          </svg>
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
