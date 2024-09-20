import axios from "axios";
import { ENDPOINTS } from "../utils";

const CAP_API_URL = ENDPOINTS.API_URL + "/cap";

export const saveCap = async (cap) => {
  try {
    const response = await axios.post(CAP_API_URL, cap);
    return response.data;
  } catch (error) {
    console.error("Error saving cap:", error);
    throw error;
  }
};

export const getRestCaps = async (userId) => {
  try {
    const response = await axios.get(`${CAP_API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCapsOfFriend = async (friendId) => {
  try {
    const response = await axios.get(`${CAP_API_URL}/friend/${friendId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRestCap = async (capId) => {
  try {
    const response = await axios.get(`${CAP_API_URL}/get/${capId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRestFollowings = async (userId) => {
  try {
    const response = await axios.get(`${CAP_API_URL}/following/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCapPublicity = async (capId, isPublic) => {
  try {
    const response = await axios.put(`${CAP_API_URL}/${capId}`, {
      cap: {
        showToOthers: isPublic,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCapWithReply = async (capId, replyId) => {
  try {
    const response = await axios.put(`${CAP_API_URL}/${capId}`, {
      cap: {
        reply: replyId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
