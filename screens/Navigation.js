// src/navigation/Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupChannelListScreen from '../screens/GroupChannelListScreen';
import GroupChannelCreateScreen from '../screens/GroupChannelCreateScreen';
import GroupChannelScreen from '../screens/GroupChannelScreen';

const RootStack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {/* Add your other screens here */}
                <RootStack.Screen name={'GroupChannelList'} component={GroupChannelListScreen} />
                <RootStack.Screen name={'GroupChannelCreate'} component={GroupChannelCreateScreen} />
                <RootStack.Screen name={'GroupChannel'} component={GroupChannelScreen} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
