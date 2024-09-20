import axios from "axios";
import { ENDPOINTS } from "../utils";

const REPLY_API_URL = ENDPOINTS.API_URL + "/replies";

export const getReplies = async () => {
  try {
    const response = await axios.get(REPLY_API_URL);
    // console.log("getReplies response", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
