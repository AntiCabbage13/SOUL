/* import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import firebase from '../firebase';
import Parse from "parse/react-native.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');

  const sendVerification = () => {
  };

  const confirmCode = () => {
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    text: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 10,
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      marginLeft: 6,
    },
    inputBox: {
      width: 45,
      height: 45,
      borderWidth: 1.4,
      borderColor: 'green',
      borderRadius: 6,
      textAlign: 'center',
      fontSize: 24,
    },
    button: {
      width: 150,
      padding: 8,
      borderWidth: 1,
      borderColor: 'green',
      borderRadius: 40,
      backgroundColor: 'transparent',
      alignItems: 'center',
    },
    buttonText: {
      color: 'green',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      
      
      <Text style={styles.text}>Please enter the verification code:</Text>
      <View style={styles.inputContainer}>
        {[...Array(6)].map((_, index) => (
          <TextInput
            key={index}
            style={styles.inputBox}
            value={code[index] || ''}
            onChangeText={(text) => {
              const newCode = [...code];
              newCode[index] = text;
              setCode(newCode.join(''));
            }}
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </View>
      <TouchableOpacity onPress={confirmCode} style={styles.button}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const App = ({ navigation }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    text: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 10,
    },
    button: {
      width: 150,
      padding: 8,
      borderWidth: 1,
      borderColor: 'green',
      borderRadius: 40,
      backgroundColor: 'transparent',
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: 'green',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
      Check your email to verify your account.
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;



