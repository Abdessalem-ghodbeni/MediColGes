import React, { useState, useEffect, useContext } from "react";
import { Stack } from "react-bootstrap";
import { format } from "date-fns";
import "./UserChat.css"; // Import the CSS file for styling
import { ChatContext } from "../../context/ChatContext";

const UserChat = ({ chat, user, getUserById }) => {
  const [receiver, setReceiver] = useState(null);
  const { onlineUsers } = useContext(ChatContext);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy hh:mm a");
  };
  
  useEffect(() => {
    const fetchReceiver = async () => {
      const receiverId = chat?.members.find((member) => member !== user.data.data._id);
      const user2 = await getUserById(receiverId);
      setReceiver(user2);
    };

    fetchReceiver();
  }, [chat, user, getUserById]);

  // Determine the user's online status based on the onlineUsers context
  const userStatus = onlineUsers.some((u) => u.userId === receiver?._id)
    ? "Online"
    : "Offline";

  return (
    <div className="user-chat">
      <Stack
        direction="horizontal"
        gap={3} 
        className="align-items-center p-2 justify-content-between"
      >
        <div className="user-info d-flex align-items-center">
          <div className="user-avatar">{receiver ? receiver.nom.charAt(0) : ""}</div>
          <div className="user-details">
            <div className="user-name">{receiver ? `${receiver.nom} ${receiver.prenom}` : ""}</div>
            {/* Display the dynamic online status with lamp icons */}
            <div className={`user-status ${userStatus.toLowerCase()}`}>
              <img
                className="lamp-icon"
                src={userStatus === "Online" ? "online-lamp-icon.svg" : "offline-lamp-icon.svg"}
                alt={userStatus === "Online" ? "Online Lamp" : "Offline Lamp"}
              />
              {userStatus}
            </div>
            {/* Move the chat date inside the user details block */}
            {/* <div className="chat-date">{formatDate(chat?.createdAt)}</div> */}
          </div>
        </div>
      </Stack>
    </div>
  );
};

export default UserChat;
