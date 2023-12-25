import React from 'react';
import { AppRegistry, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnimatedMultistep from 'react-native-animated-multistep'; // Import AnimatedMultistep
import MultiStepFormScreen from './screens/MultiStepFormScreen'; // Import the MultiStepFormScreen
import LoginScreen from './screens/loginScreen';
import foodEntry from'./screens/foodEntry';
/* import chartScreen from './screens/chartScreen'; */
import RegistrationScreen from './screens/RegistrationScreen';
import AwaitEmailVerScreen from './screens/AwaitEmailVerScreen';
import HomeScreen from './screens/HomeScreen';
import collectedData from './screens/collectedData';
import AddMeasurement from'./screens/AddMeasurement';
import AddChild from './screens/AddChild';
import MealPreTtable from './screens/MealPreTtable';
/* import GirlWeightChartScreen from './screens/GirlWeightChartScreen'; */
import * as Linking from 'expo-linking';
import Parse from "parse/react-native.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

Parse.setAsyncStorage(AsyncStorage);

const Stack = createNativeStackNavigator();
const prefix = Linking.createURL('/');
const PARSE_APPLICATION_ID = 'VXLSRSLFzlwWVZnGLbF57Cm9JgBU1nilXN76HYFA';
const PARSE_JAVASCRIPT_ID = 'RAzzzAhMZpT8AwpJIHhLubChsR8m7yMvJ1SPvzjW';
const PARSE_HOST_URL = 'https://parseapi.back4app.com';

function AppWrapper() {
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Home: 'home',
        AwaitVerification: 'awaitVerification',
        Registration: 'registration',
        Login: 'login',
        collectedData: 'collectedData',
        AddChild:'AddChild',
        AddMeasurement:' AddMeasurement',
        /* chartScreen:'chartScreen', */
        MealPreTtable:'MealPreTtable',
        foodEntry:'foodEntry',
       /*  GirlWeightChartScreen:'GirlWeightChartScreen', */
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
    {/*  <Stack.Screen name='GrowthChart' component={GrowthChart} />*/}  

      <Stack.Screen name='MealPreTtable' component={MealPreTtable} />
      <Stack.Screen name='foodEntry' component={foodEntry}/>

     {/*  <Stack.Screen name='GirlWeightChartScreen' component={GirlWeightChartScreen} /> */}

        {/* <Stack.Screen name='chartScreen' component={chartScreen}/> */}
        <Stack.Screen name='Home' component={HomeScreen} />

      <Stack.Screen name='Login' component={LoginScreen} />

   
      <Stack.Screen name='Registration' component={RegistrationScreen} />


      <Stack.Screen name='AddMeasurement' component={AddMeasurement}/>
        <Stack.Screen name='DataEntry' component={MultiStepFormScreen} />
        <Stack.Screen name='AddChild' component={AddChild}/>
        <Stack.Screen name='AwaitVerification' component={AwaitEmailVerScreen} />
        <Stack.Screen name='collectedData' component={collectedData} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent('main', () => AppWrapper);

export default AppWrapper;
