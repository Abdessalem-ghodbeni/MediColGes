import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";

const PotentialChats = () => {
  const { onlineUsers, createChat, getUserById } = useContext(ChatContext);
  const loggedInUserId = localStorage.getItem("USER_ID");
  const [userNames, setUserNames] = useState({});
  const firstId = '65e6e8694bdf7e7c185982f1';
  const secondId = '65f41940ed958f8ea3c1ccbc';

  useEffect(() => {
    const fetchUserNames = async () => {
      const names = {};
      for (const user of onlineUsers) {
        const userData = await getUserById(user.userId);
        names[user.userId] = `${userData.nom} ${userData.prenom}`;
      }
      setUserNames(names);
    };

    fetchUserNames();
  }, [onlineUsers, getUserById]);

  const handleCreateChat = () => {
    createChat(firstId, secondId);
  };

  return (
    <div className="all-users">
      {onlineUsers.length > 0 ? (
        onlineUsers.map((user, index) => (
          <div className={`single-user`} key={index} onClick={() => createChat(loggedInUserId, user.userId)}>
            {userNames[user.userId] || "Unknown User"} {/* Display the name or "Unknown User" if name not available */}
            <span className={onlineUsers.some((u) => u.userId === user.userId) ? "user-online" : ""}></span>
          </div>
        ))
      ) : (
        <p>No online users available.</p>
      )}
      
      {/* Button to create a chat */}
      {/* <button onClick={handleCreateChat}>Create Chat</button> */}
    </div>
  );
};

export default PotentialChats;
