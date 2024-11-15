import { setIn } from "formik";
import React, { useState, createContext } from "react";

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [grade, setGrade] = useState(0);
  const [school, setSchool] = useState("");
  const [phone, setPhone] = useState("");
  const [friends, setFriends] = useState({}); 
  const [onAudio, setOnAudio] = useState(false); 

  const [inviter, setInviter] = useState(""); 
  
  const [groupName, setGroupName] = useState(""); 
  const [groupCode, setGroupCode] = useState(""); 
  const [groupQuestions, setGroupQuestions] = useState([]); 

  return (
    <AuthenticatedUserContext.Provider
      value={{
        user,
        setUser,
        email,
        setEmail,
        age,
        setAge,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        gender,
        setGender,
        grade,
        setGrade,
        school,
        setSchool,
        phone,
        setPhone,
        friends,
        setFriends, 
        onAudio, 
        setOnAudio, 
        inviter, 
        setInviter, 
        groupName, 
        setGroupName, 
        groupCode, 
        setGroupCode, 
        groupQuestions, 
        setGroupQuestions, 
      }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
