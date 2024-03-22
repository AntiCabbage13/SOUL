import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import ChartScreen from '../screens/charts';
import ArticleUploadScreen from './ArticalUploadScreen';
import ChatScreen from './ChatScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Chart') {
            iconName = 'chart-line';
          } else if (route.name === 'FileUpload') {
            iconName = 'file-upload';
          } else if (route.name === 'Chat') {
            iconName = 'comment';
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
        activeTintColor: '#808080',
      }}
    >
      <Tab.Screen name="Chart" component={ChartScreen} />
      <Tab.Screen name="FileUpload" component={ArticleUploadScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
