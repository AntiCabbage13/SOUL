import React, { useEffect, useRef } from "react";
import { AppRegistry, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AnimatedMultistep from "react-native-animated-multistep";
import MultiStepFormScreen from "./screens/MultiStepFormScreen";
import LoginScreen from "./screens/loginScreen";
import foodEntry from "./screens/foodEntry";
import QuestionnaireUploadScreen from "./screens/QuestionnaireUploadScreen";
import QuestionnaireListScreen from "./screens/QuestionnaireListScreen";
import QuestionnaireSliderScreen from "./screens/QuestionnaireSliderScreen";
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
import ChatScreen from "./screens/ChatScreen";
import AddFoodAllergyScreen from "./screens/AddFoodAllergyScreen";
import HealthcareProfessionalHome from "./screens/HealthcareProfessionalHome";
import ProfMessagesScreen from "./screens/ProfMessagesScreen";
import RegisteredChildrenScreen from "./screens/RegisteredChildrenScreen";
import AddMeasurementprof from "./screens/AddMeasurementprof";
import DrawerNavigator from "./DrawerNavigator";
import MessagesScreen from "./screens/MessagesScreen";
import ChatRoomsScreen from "./screens/ChatRoomsScreen";
import CommunityScreen from "./screens/CommunityScreen";
import CommentSection from "./screens/CommentSection";
import PostScreen from "./screens/PostScreen";
import ArticleDisplayScreen from "./screens/ArticleDisplayScreen";
import AnalyzedFood from "./screens/AnalyzedFood";
import HelpScreen from "./screens/HelpScreen";
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
        RegisteredChildrenScreen: "RegisteredChildrenScreen",
        AddMeasurementprof: "AddMeasurementprof",
      },
    },
  };

  return (
    <AppProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HealthcareProfessionalHome"
            component={HealthcareProfessionalHome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="HelpScreen"
            component={HelpScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="AddFoodAllergyScreen"
            component={AddFoodAllergyScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="AnalyzedFood"
            component={AnalyzedFood}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="QuestionnaireSliderScreen"
            component={QuestionnaireSliderScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="QuestionnaireUploadScreen"
            component={QuestionnaireUploadScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChartsScreen"
            component={ChartsScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="QuestionnaireListScreen"
            component={QuestionnaireListScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen name="CommunityScreen" component={CommunityScreen} />

          <Stack.Screen
            name="PostScreen"
            component={PostScreen}
            options={{ title: "Post" }}
          />

          <Stack.Screen name="CommentSection" component={CommentSection} />

          <Stack.Screen
            name="ProfMessagesScreen "
            component={ProfMessagesScreen}
          />

          <Stack.Screen
            name="DrawerNavigator"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Registration"
            component={RegistrationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ArticleDisplayScreen"
            component={ArticleDisplayScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="MessagesScreen"
            component={MessagesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ChatRoomsScreen"
            component={ChatRoomsScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name=" RegisteredChildrenScreen"
            component={RegisteredChildrenScreen}
          />

          <Stack.Screen
            name="MealPreTtable"
            component={MealPreTtable}
            options={({ navigation }) => ({
              title: "MealPreTtable",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("AnalyzedFood")}
                >
                  <FontAwesome5
                    name="search"
                    size={20}
                    style={{ marginRight: 15 }}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="AddMeasurementprof"
            component={AddMeasurementprof}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ArticleUploadScreen"
            component={ArticleUploadScreen}
            options={{ headerShown: false }}
          />

          {/*  <Stack.Screen name='GrowthChart' component={GrowthChart} />*/}

          <Stack.Screen
            name="AddChild"
            component={AddChild}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddMeasurement"
            component={AddMeasurement}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfMessagesScreen"
            component={ProfMessagesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="foodEntry"
            component={foodEntry}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="DataEntry"
            component={MultiStepFormScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AwaitVerification"
            component={AwaitEmailVerScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="collectedData"
            component={collectedData}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

AppRegistry.registerComponent("main", () => AppWrapper);

export default AppWrapper;
