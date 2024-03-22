import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import AddChild from '../screens/AddChild';
import AddMeasurement from '../screens/AddMeasurement';
import MealPreTtable from '../screens/MealPreTtable';
import ChartsScreen from '../screens/charts';
import  ChatScreen from "../screens/ChatScreen";
import 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const HomeTab = () => {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === 'Charts') {
            iconName = 'chart-line';
          } else if (route.name === 'Messages') {
            iconName = 'comment';
          } else if (route.name === 'Utensils') {
            iconName = 'utensils';
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
      <Tab.Screen name="Charts" component={ChartsScreen} />
      <Tab.Screen name="Messages" component={ChatScreen} />
      <Tab.Screen name="Utensils" component={MealPreTtable} />
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
          title: 'Home',
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
        label={() => (
          <FontAwesome5 name="user" size={30} color="#000" />
        )}
        onPress={() => {
          // Handle user profile press
        }}
      />
      <DrawerItem
        label="Add Child"
        icon={() => <FontAwesome5 name="plus" size={20} />}
        onPress={() => {
          props.navigation.navigate('AddChild');
        }}
      />
      <DrawerItem
        label="Take Measurements"
        icon={() => <FontAwesome5 name="ruler" size={20} />}
        onPress={() => {
          props.navigation.navigate('AddMeasurement');
        }}
      />
      <DrawerItem
        label="Add Meals"
        icon={() => <FontAwesome5 name="utensils" size={20} />}
        onPress={() => {
          props.navigation.navigate('MealPreTtable');
        }}
      />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default AppDrawer;
