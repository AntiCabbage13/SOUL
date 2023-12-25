import React, { useState } from "react";

const ChildClass = () => {
  const [childData, setChildData] = useState({
    firstName: "",
    surname: "",
    dateOfBirth: null,
    gender: "",
    weight: null,
    height: null,
    headLength: null,
  });

  // Getters
  const getFirstName = () => {
    return childData.firstName;
  };

  const getSurname = () => {
    return childData.surname;
  };

  const getDateOfBirth = () => {
    return childData.dateOfBirth;
  };

  const getGender = () => {
    return childData.gender;
  };

  const getWeight = () => {
    return childData.weight;
  };

  const getHeight = () => {
    return childData.height;
  };

  const getHeadLength = () => {
    return childData.headLength;
  };

  // Setters
  const setFirstName = (firstName) => {
    setChildData({ ...childData, firstName });
  };

  const setSurname = (surname) => {
    setChildData({ ...childData, surname });
  };

  const setDateOfBirth = (dateOfBirth) => {
    setChildData({ ...childData, dateOfBirth });
  };

  const setGender = (gender) => {
    setChildData({ ...childData, gender });
  };

  const setWeight = (weight) => {
    setChildData({ ...childData, weight });
  };

  const setHeight = (height) => {
    setChildData({ ...childData, height });
  };

  const setHeadLength = (headLength) => {
    setChildData({ ...childData, headLength });
  };

  return null; // No rendering for this component
};

export { ChildClass };
