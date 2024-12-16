import axios from "axios";
import { ENDPOINTS } from "../utils";

const SIGNUP_API_URL = ENDPOINTS.API_URL + "/users";
const SIGNIN_API_URL = ENDPOINTS.API_URL + "/users/email";
const DELETE_API_URL = ENDPOINTS.API_URL + "/users/delete/email";
const FRIEND_API_URL = ENDPOINTS.API_URL + "/friends";
const SEND_INVITE_API_URL = ENDPOINTS.API_URL + "/users/send_invite"; 
const ADD_BONUS_API_URL = ENDPOINTS.API_URL + "/users/add_bonus"; 
const SEND_NOTIFICATION = ENDPOINTS.API_URL + "/users/notification"; 

export const registerUser = async (user) => {
  try {
    const response = await axios.post(SIGNUP_API_URL, user);
    return response;
  } catch (error) {
    console.error("Error signing up user:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${SIGNUP_API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting user by id[${userId}]:`, error);
    throw error;
  }
};

export const signinUser = async (email) => {
  try {
    const response = await axios.post(`${SIGNIN_API_URL}`, { email });
    return response.data;
  } catch (error) {
    console.error("Error signing in user:", error);
    throw error;
  }
};

export const insertFriends = async (userId, friendIds) => {
  try {
    const response = await axios.post(`${FRIEND_API_URL}/${userId}`, {
      friends: friendIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error inserting friends:", error);
    throw error;
  }
};

export const deleteUserByEmail = async (email) => {
  try {
    const response = await axios.post(`${DELETE_API_URL}`, { email: email });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updateUser = async (user_id, data) => {
  try {
    const response = await axios.put(`${SIGNUP_API_URL}/${user_id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}; 

export const sendInvite = async (data) => {
  try {
    const response = await axios.post(SEND_INVITE_API_URL, data); 
    return response; 
  } catch (error) {
    console.error("Error sending an invite email", error);
    throw error;
  }
} 

export const userAddBonusRound = async (data) => {
  try { 
    // console.log("userAddBonusRoundData: ", data); 
    const response = await axios.post(ADD_BONUS_API_URL, data); 
    return response; 
  } catch (error) {
    console.error("Error adding a bonus", error);
    throw error;
  }
}

export const userSendNotification = async (data) => {
  try {
    // console.log("userSendNotification: ", data); 
    const res = await axios.post(SEND_NOTIFICATION, data);
    return res; 
  } catch(error) {
    throw error; 
  }
}
