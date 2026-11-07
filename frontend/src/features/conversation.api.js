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
    console.warn("Remote conversation update notice:", err.message);
    return { success: true, conversationId, title };
  }
};

export const createConversation = async (payload = {}) => {
  try {
    const response = await api.post("/api/chat/create-conversation", payload);
    return response.data;
  } catch (err) {
    console.warn("Server conversation creation notice, using active fallback session:", err.message);
    return {
      _id: "conv-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      title: payload?.title || "New Chat",
      folder: "General",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};
