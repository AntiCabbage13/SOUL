import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesome5 } from '@expo/vector-icons';
import CustomDrawerContent from './CustomDrawerContent';
import RegisteredChildrenScreen from '../screens/RegisteredChildrenScreen';

const Drawer = createDrawerNavigator();

const LeftDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerPosition="left"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
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

export default LeftDrawerNavigator;
