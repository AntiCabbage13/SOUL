// AppContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
import { setmealtype } from './classes/NutrientAnalysis'; // Import the setmealtype function

export const MealTypeContext = createContext();

export const useMealType = () => {
  return useContext(MealTypeContext);
};
export const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    // other properties...
    childObjectId: null, // initialize childObjectId as needed
  });

  useEffect(() => {
    console.log("Context childObjectId:", userData.childObjectId);
    // Use userData.childObjectId here or trigger navigation
  }, [userData.childObjectId]);
  
  return (
    <AppContext.Provider value={{ userData, setUserData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
