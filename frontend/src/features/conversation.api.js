import api from "../utils/axios";

export const getConversations = async () => {
  try {
    const response = await api.get("/api/chat/get-conversations");
    return response.data;
  } catch (err) {
    if (err.response?.status !== 401) {
      console.warn("Could not retrieve conversations:", err.message);
    }
    return [];
  }
};

export const updateConversations = async (conversationId, title) => {
  try {
    const response = await api.post("/api/chat/update-conversation", {
      conversationId,
      title,
    });
    return response.data;
  } catch (err) {
    console.error("Failed to update conversation:", err.message);
    throw err;
  }
};

export const createConversation = async (payload = {}) => {
  try {
    const response = await api.post("/api/chat/create-conversation", payload);
    return response.data;
  } catch (err) {
    console.error("Failed to create conversation:", err.message);
    throw err;
  }
};
