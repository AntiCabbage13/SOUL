import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ChartScreen from '../screens/ChartScreen';
import FileUploadScreen from '../screens/FileUploadScreen';
import ChatScreen from '../screens/ChatScreen';
//import MeasurementScreen from '../screens/MeasurementScreen';
import RegisteredChildrenScreen from '../screens/RegisteredChildrenScreen';
import AddMeasurement from '../screens/AddMeasurement';
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

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
      <Tab.Screen name="FileUpload" component={FileUploadScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
};

const LeftDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerPosition="left"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Measurement"
        component={MeasurementScreen}
        options={{
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="ruler" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="RegisteredChildren"
        component={RegisteredChildrenScreen}
        options={{
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="users" size={20} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label={() => (
          <FontAwesome5 name="user" size={30} color="#000" />
        )}
        onPress={() => {
          // Handle user profile press
        }}
      />

      <DrawerItem
        label="Measurement"
        icon={() => <FontAwesome5 name="ruler" size={20} />}
        onPress={() => {
          navigation.navigate('AddMeasurement');
        }}
      />
      <DrawerItem
        label="Registered Children"
        icon={() => <FontAwesome5 name="users" size={20} />}
        onPress={() => {
          navigation.navigate('RegisteredChildren');
        }}
      />

      {/* Original Drawer Items */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );















  
};



export { BottomTabNavigator, LeftDrawerNavigator };
