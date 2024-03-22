import React from 'react';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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

export default CustomDrawerContent;
