// services/schoolService.js
import axios from "axios";
import { ENDPOINTS } from "../utils";

const SCHOOL_API_URL = ENDPOINTS.API_URL + "/schools";
const SCHOOL_SEARCH_URL = ENDPOINTS.API_URL + "/schools/search";

export const fetchSchools = async () => {
  try {
    const response = await axios.get(SCHOOL_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  }
};

export const searchSchools = async (query) => {
  try {
    const response = await axios.get(`${SCHOOL_SEARCH_URL}?query=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching schools:", error);
    throw error;
  }
};
