import axios from "axios";
import { ENDPOINTS } from "../utils";

const SIGNUP_API_URL = ENDPOINTS.API_URL + "/users";
const SIGNIN_API_URL = ENDPOINTS.API_URL + "/users/email";
const DELETE_API_URL = ENDPOINTS.API_URL + "/users/delete/email";
const FRIEND_API_URL = ENDPOINTS.API_URL + "/friends";

export const registerUser = async (user) => {
  try {
    const response = await axios.post(SIGNUP_API_URL, user);
    return response.data;
  } catch (error) {
    console.error("Error signing up user:", error);
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
