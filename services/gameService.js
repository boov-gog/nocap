import axios from "axios";
import { ENDPOINTS } from "../utils";

const GAME_API_URL = ENDPOINTS.API_URL + "/game";
const CAP_API_URL = ENDPOINTS.API_URL + "/cap";

export const fetchGameData = async (user_id) => {
  console.log("fetchGameData user_id:", user_id);

  try {
    const response = await axios.get(`${GAME_API_URL}/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching game data:", error);
    throw error;
  }
};

export const saveCap = async (cap) => {
  try {
    const response = await axios.post(CAP_API_URL, cap);
    return response.data;
  } catch (error) {
    console.error("Error saving cap:", error);
    throw error;
  }
};

export const getAnsweredPercentage = async (
  roundId,
  questionId,
  candidateIds
) => {
  try {
    console.log(
      "Getting answered percentage: ",
      roundId,
      questionId,
      candidateIds
    );
    const response = await axios.post(`${GAME_API_URL}/percentage`, {
      data: { roundId, questionId, candidateIds },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
