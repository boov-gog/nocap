// services/schoolService.js
import axios from "axios";
import { ENDPOINTS } from "../utils";

const SCHOOL_API_URL = ENDPOINTS.API_URL + "/schools";
const SCHOOL_SEARCH_URL = ENDPOINTS.API_URL + "/schools/search"; 
const ADD_GROUP_URL = ENDPOINTS.API_URL + "/schools/add_group"; 
const UPDATE_GROUP_URL = ENDPOINTS.API_URL + "/schools/update_group"; 
const LIMIT_DISTANCE_URL = ENDPOINTS.API_URL + "/schools/get_limit_distance"; 

export const fetchSchools = async () => {
  try {
    const response = await axios.get(SCHOOL_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  }
};

export const getSchoolById = async (schoolId) => {
  try {
    const response = await axios.get(`${SCHOOL_API_URL}/${schoolId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting school by id[${schoolId}]:`, error);
    throw error;
  }
}; 

export const deleteSchoolById = async (schoolId) => {
  try {
    const response = await axios.delete(`${SCHOOL_API_URL}/${schoolId}`);
    return response;
  } catch (error) {
    console.error(`Error getting school by id[${schoolId}]:`, error);
    throw error;
  }
}; 

export const addGroup = async (data) => {
  try {
    const response = await axios.post(`${ADD_GROUP_URL}`, data); 
    return response.data; 
  } catch (error) {
    console.error(`Error adding a group: `, error);
    throw error;
  }
} 

export const updateGroup = async (data) => {
  try {
    const response = await axios.post(`${UPDATE_GROUP_URL}`, data); 
    return response.data; 
  } catch (error) {
    console.error(`Error adding a group: `, error);
    throw error;
  }
} 

export const getLimitDistance = async () => {
  try { 
    const response = await axios.post(LIMIT_DISTANCE_URL); 
    return response.data; 
  } catch (error) {
    console.error(`Error to get limit distance: `, error);
    throw error;
  }
} 

// export const searchSchools = async (query) => {
//   try {
//     const response = await axios.get(`${SCHOOL_SEARCH_URL}?query=${query}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error searching schools:", error);
//     throw error;
//   }
// };
