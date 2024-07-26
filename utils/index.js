import * as Yup from "yup";
import Toast from "react-native-toast-message";

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
