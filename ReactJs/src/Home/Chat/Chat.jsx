import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Stack } from "react-bootstrap";
import UserChat from "../../components/chat/UserChat";
import ChatBox from "../../components/chat/ChatBox";
import PotentialChats from "../../components/chat/PotentialChats"; 
import axios from "axios";
import "./Chat.css";
import { ChatContext } from "../../context/ChatContext";
import logo from "../Chat/logo.png";

const Chat = () => {
  const [userChats, setUserChats] = useState([]);
  const { currentChat, updateCurrentChat, getUserById } = useContext(ChatContext); // Use currentChat
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoadingChats(true);
      try {
        const loggedInUserData = JSON.parse(localStorage.getItem("USER"));
        console.log("loggedInUserData:", loggedInUserData);
        setLoggedInUser(loggedInUserData);
        const userId = loggedInUserData?.data?.data?._id;

        if (userId) {
          const response = await axios.get(`http://localhost:3000/api/chats/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setUserChats(response.data);
          console.log(response);
        } else {
          console.error("User ID is undefined");
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
      setIsLoadingChats(false);
    };

    fetchChats();
  }, [accessToken]);

  return (
    <Container fluid className="text-center">
      <Row>
        <Col sm={12} md={4} lg={3}>
          <Stack className="messages-box pe-3" gap={3}>
            {isLoadingChats && <p>Loading chats ...</p>}
            <div className="chat-list">
              {Array.isArray(userChats) && userChats.length > 0 ? (
                userChats.map((chat, index) => (
                  <div key={index} onClick={() => updateCurrentChat(chat)}>
                    <UserChat chat={chat} user={loggedInUser} getUserById={getUserById} />
                    <hr />
                  </div>
                ))
              ) : (
                <p>No chats found</p>
              )}
            </div>
          </Stack>
        </Col>
        <Col sm={12} md={8} lg={6}>
          <ChatBox currentChat={currentChat} />
        </Col>
        <Col sm={12} md={12} lg={3}>
          <PotentialChats />
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
