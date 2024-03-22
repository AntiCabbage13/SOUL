import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import AddChild from '../screens/AddChild';
import AddMeasurement from '../screens/AddMeasurement';
import MealPreTtable from '../screens/MealPreTtable';
import ChartsScreen from '../screens/charts';
import  ChatRoomsScreen from "../screens/ChatRoomsScreen";
import RegisteredChildrenScreen from '../screens/RegisteredChildrenScreen';
import ArticleUploadScreen from '../screens/ArticalUploadScreen';
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
          } else if (route.name === 'FileUpload') {
            iconName = 'file-upload';
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
      <Tab.Screen name="Messages" component={ChatRoomsScreen} />
      <Tab.Screen name="FileUpload" component={ArticleUploadScreen} />
      
    </Tab.Navigator>
  );
};

const HealthcareProfessionalHome = () => {
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
      <Drawer.Screen
          name="RegisteredChildren"
          component={RegisteredChildrenScreen}
          options={{
            drawerIcon: ({ color }) => <FontAwesome5 name="users" size={20} color={color} />,
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
   
   
      
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default HealthcareProfessionalHome;
