import * as Yup from "yup";
import Toast from "react-native-toast-message";
import BadWords from "badwords-list";
import Constants from "expo-constants";

const cache = {};

export const setCache = (key, value) => {
  cache[key] = value;
};

export const getCache = (key) => {
  return cache[key] || null;
};

export const clearCache = () => {
  Object.keys(cache).forEach((key) => delete cache[key]);
};

export const GENDER_TYPE = {
  Boy: "B",
  Girl: "G",
  NonBinary: "N",
};

export const ENDPOINTS = {
  API_URL: Constants.expoConfig?.extra?.apiUrl,
};

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

export const signupValidationSchema = Yup.object().shape({
  // email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Confirm Password must match password.")
    .required("Confirm Password is required."),
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required("Please enter a registered email")
    .label("Email")
    .email("Enter a valid email"),
});

export const emailValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

export const showSuccessToast = (text) => {
  Toast.show({
    type: "success",
    text1: text,
    text1Style: { fontSize: 16, fontWeight: "bold", color: "#000" },
    position: "bottom",
  });
};

export const showErrorToast = (text) => {
  Toast.show({
    type: "error",
    text1: text,
    text1Style: { fontSize: 16, fontWeight: "bold", color: "#000" },
    position: "bottom",
  });
};

export const Grades = {
  _9: "9th",
  _10: "10th",
  _11: "11th",
  _12: "12th",
  _Not: "Not In High School",
};

export const checkBadName = (value) => {
  const enBad = BadWords.array;

  value = value.toLowerCase();

  for (const bad of enBad) {
    if (value.includes(bad.toLowerCase())) {
      return true;
    }
  }
  return false;
};

export const degreesToRadians = (degrees) => {
  return (degrees * Math.PI) / 180;
};

export const distanceInMiles = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c * 0.621371; // Convert km to miles
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate(); // getDate() returns 1-31
  const year = date.getFullYear(); // getFullYear() returns the year

  // Pad the month and day with leading zeros if necessary
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;

  // Return the formatted date string
  return `${formattedMonth}/${formattedDay}/${year}`;
};
