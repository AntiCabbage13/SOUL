import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesome5 } from '@expo/vector-icons';

import ChatScreen from './screens/ChatScreen';
import CommunityScreen from './screens/CommunityScreen';
import AnnouncementsScreen from './screens/AnnouncementsScreen';
import ArticleDisplayScreen from './screens/ArticleDisplayScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Chat') {
            iconName = 'comment'; // Using chat icon for Chat screen
          } else if (route.name === 'Community') {
            iconName = 'users'; // Using group chat icon for Community screen
          } else if (route.name === 'Announcements') {
            iconName = 'bullhorn'; // Using bullhorn icon for Announcements screen
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        style: {
          elevation: 8, // Elevating the tab bar
        },
        tabStyle: {
          elevation: 8, // Elevating each tab
        },
        labelStyle: {
          display: 'none', // Hiding tab labels
        },
      }}
    >
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Announcements" component={ArticleDisplayScreen} />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
