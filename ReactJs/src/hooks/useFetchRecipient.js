import { useEffect, useState } from "react";
import { getRequest } from "../utils/services";

const useFetchRecipient = (chat, userId) => {
  const [recipientUser, setRecipientUser] = useState(null);

  useEffect(() => {
    const fetchRecipient = async () => {
      // Check if chat, userId, and chat members exist
      if (!chat || !userId || !chat.members) return;

      // Find the recipientId by filtering out the userId from chat members
      const recipientId = chat.members.find((id) => id !== userId);
      if (!recipientId) return;

      try {
        // Make a GET request to fetch recipient user data
        const response = await getRequest(`http://localhost:3000/api/users/find/${recipientId}`);
        
        // If the response does not have an error, set the recipientUser
        if (!response.error) {
          setRecipientUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching recipient:", error);
      }
    };

    // Call the fetchRecipient function
    fetchRecipient();
  }, [chat, userId]);

  // Return the recipientUser state
  return { recipientUser };
};

export default useFetchRecipient;
