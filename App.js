import React, { useEffect, useRef } from "react";
import { AppRegistry, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AnimatedMultistep from "react-native-animated-multistep";
import MultiStepFormScreen from "./screens/MultiStepFormScreen";
import LoginScreen from "./screens/loginScreen";
import foodEntry from "./screens/foodEntry";
import setupNotifications from "./reusableComp/mealReminder";
import { getHeightForAgeReferenceDataFromAPI } from "./classes/calcualteHeightForage";
import RegistrationScreen from "./screens/RegistrationScreen";
import calcualteHeightForage from "./classes/calcualteHeightForage";
import AwaitEmailVerScreen from "./screens/AwaitEmailVerScreen";
import HomeScreen from "./screens/HomeScreen";
import collectedData from "./screens/collectedData";
import AddMeasurement from "./screens/AddMeasurement";
import AddChild from "./screens/AddChild";
import MealPreTtable from "./screens/MealPreTtable";
import * as Linking from "expo-linking";
import Parse from "parse/react-native.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatabaseHelper from "./reusableComp/DatabaseHelper";
import { AppProvider } from "./AppContext";
import ChartsScreen from "./screens/charts";
import ArticleUploadScreen from "./screens/ArticalUploadScreen";
import ArticleDisplayScreen from "./screens/ArticleDisplayScreen";
import chatscreen from "./screens/chatscreen";
import AddFoodAllergyScreen from "./screens/AddFoodAllergyScreen";
//import { SendBirdProvider } from "sendbird-uikit";
Parse.setAsyncStorage(AsyncStorage);
const Stack = createNativeStackNavigator();
const prefix = Linking.createURL("/");
const PARSE_APPLICATION_ID = "VXLSRSLFzlwWVZnGLbF57Cm9JgBU1nilXN76HYFA";
const PARSE_JAVASCRIPT_ID = "RAzzzAhMZpT8AwpJIHhLubChsR8m7yMvJ1SPvzjW";
const PARSE_HOST_URL = "https://parseapi.back4app.com";

function AppWrapper() {
  useEffect(() => {
    DatabaseHelper.getLastInsertedRow();
    return () => {};
  }, []);

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Home: "home",
        AwaitVerification: "awaitVerification",
        Registration: "registration",
        Login: "login",
        collectedData: "collectedData",
        AddChild: "AddChild",
        AddMeasurement: "AddMeasurement",
        MealPreTtable: "MealPreTtable",
        foodEntry: "foodEntry",
      },
    },
  };

  return (
    <AppProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
        <Stack.Screen name="MealPreTtable" component={MealPreTtable} />
          
          {/*   <Stack.Screen name='chatscreen' component={chatscreen} options={{ title: 'Sendbird Chat' }}/> */}
          <Stack.Screen name="AddFoodAllergyScreen" component={AddFoodAllergyScreen} />

          <Stack.Screen
            name="ArticleDisplayScreen"
            component={ArticleDisplayScreen}
          />
          <Stack.Screen
            name="ArticleUploadScreen"
            component={ArticleUploadScreen}
          />
          <Stack.Screen name=" ChartsScreen" component={ChartsScreen} />

          <Stack.Screen name="Login" component={LoginScreen} />

          <Stack.Screen name="Home" component={HomeScreen} />

          {/*  <Stack.Screen name='GrowthChart' component={GrowthChart} />*/}

          <Stack.Screen name="AddChild" component={AddChild} />
          <Stack.Screen name="AddMeasurement" component={AddMeasurement} />

          <Stack.Screen name="foodEntry" component={foodEntry} />

          <Stack.Screen name="Registration" component={RegistrationScreen} />

          <Stack.Screen name="DataEntry" component={MultiStepFormScreen} />
          <Stack.Screen
            name="AwaitVerification"
            component={AwaitEmailVerScreen}
          />
          <Stack.Screen name="collectedData" component={collectedData} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

AppRegistry.registerComponent("main", () => AppWrapper);

export default AppWrapper;
