import api from "../utils/axios";

export const getMessages = async (conversationId) => {
  if (!conversationId || conversationId === "undefined") {
    return [];
  }
  try {
    const { data } = await api.get(`/api/chat/get-messages/${conversationId}`);
    return data;
  } catch (error) {
    console.warn("Failed to fetch messages for conversation:", conversationId, error.message);
    return [];
  }
};
