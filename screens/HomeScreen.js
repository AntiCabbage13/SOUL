import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import{TouchableOpacity} from "react-native";
import { useNavigation, useEffect } from "@react-navigation/native";
import AddChild from "../screens/AddChild";
import AddMeasurement from "../screens/AddMeasurement";
import MealPreTtable from "../screens/MealPreTtable";
import ChartsScreen from "../screens/charts";
import ChatScreen from "../screens/ChatScreen";
import CommunityScreen from "./CommunityScreen";
import ArticleDisplayScreen from "./ArticleDisplayScreen";
import AddFoodAllergyScreen from "../screens/AddFoodAllergyScreen";
import QuestionnaireSliderScreen from "../screens/QuestionnaireSliderScreen"
import "react-native-gesture-handler";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const HomeTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === "Charts") {
            iconName = "chart-line";
          } else if (route.name === "Messages") {
            iconName = "comment";
          } else if (route.name === "TimeTable") {
            iconName = "utensils";
          }

          return <FontAwesome5 name={iconName} size={25} color={color} />;
        },
      })}
      tabBarOptions={{
        style: {
          borderRadius: 30,
          marginHorizontal: 20,
          marginBottom: 20,
          elevation: 40,
        },
        tabStyle: {
          borderRadius: 15,
        },
        showLabel: false,
        activeTintColor: "#808080",
      }}
    >
      <Tab.Screen name="Charts" component={ChartsScreen} />
      <Tab.Screen name="Messages" component={ChatScreen} />
     {/*  <Tab.Screen name="Utensils" component={MealPreTtable} /> */}
      <Tab.Screen
        name="TimeTable"
        component={MealPreTtable}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AnalyzedFood')}>
              <FontAwesome5 name="nutritionix" size={30} style={{ marginRight: 15,color:'green'}} />
            </TouchableOpacity>
          ),
        })}
      />
    </Tab.Navigator>
  );
};

const AppDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeTab}
        options={{
          title: "Home",
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="home" size={20} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label={() => <FontAwesome5 name="user" size={30} color="#000" />}
        onPress={() => {
          // Handle user profile press
        }}
      />
      <DrawerItem
        label="Add Child"
        icon={() => <FontAwesome5 name="plus" size={20} />}
        onPress={() => {
          props.navigation.navigate("AddChild");
        }}
      />
      <DrawerItem
        label="Take Measurements"
        icon={() => <FontAwesome5 name="ruler" size={20} />}
        onPress={() => {
          props.navigation.navigate("AddMeasurement");
        }}
      />
      <DrawerItem
        label="communities"
        icon={() => <FontAwesome5 name="users" size={20} />}
        onPress={() => {
          props.navigation.navigate("CommunityScreen");
        }}
      />
      <DrawerItem
        label="Articles"
        icon={() => <FontAwesome5 name="bullhorn" size={20} />}
        onPress={() => {
          props.navigation.navigate("ArticleDisplayScreen");
        }}
      />
       <DrawerItem
        label="survey"
        icon={() => <FontAwesome5 name="stethoscope" size={20} />}
        onPress={() => {
          props.navigation.navigate("QuestionnaireSliderScreen");
        }}
      />
<DrawerItem
        label="Help"
        icon={() => <FontAwesome5 name="question-mark" size={20} />}
        onPress={() => {
          props.navigation.navigate("HelpScreen");
        }}
      />
       <DrawerItem
        label="Add Allergies"
        icon={() => <FontAwesome5 name="stop" size={20} />}
        onPress={() => {
          props.navigation.navigate("AddFoodAllergyScreen");
        }}
      />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default AppDrawer;
