import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import Parse from 'parse/react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


Parse.initialize('VXLSRSLFzlwWVZnGLbF57Cm9JgBU1nilXN76HYFA', 'RAzzzAhMZpT8AwpJIHhLubChsR8m7yMvJ1SPvzjW');
Parse.serverURL = 'https://parseapi.back4app.com/';

const RegistrationForm = ({ navigation }) => {
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegistration = async () => {
    // Check if all fields are filled
    if (!firstName || !surname || !email || !password || !confirmPassword || !phoneNumber) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    // Check if phone number starts with "+265" and has a total length of 13 characters
    if (!phoneNumber.startsWith('+265') || phoneNumber.length !== 13) {
      setErrorMsg('Please enter a valid Malawian phone number with country code +265');
      return;
    }

    // Check if password meets the required criteria
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg(
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one special character, and one number'
      );
      return;
    }

    setErrorMsg('');
    setLoading(true);

    const User = Parse.Object.extend('User');
    const user = new User();

    // Set the user data in the Back4App object
    user.set('firstName', firstName);
    user.set('surname', surname);
    user.set('username', email);
    user.set('email', email);
    user.set('phoneNumber', phoneNumber);
    user.set('password', password);

    try {
      // Save the user data to Back4App
      await user.save();

      console.log('Registration successful');
      console.log('User ID:', user.id);
      console.log('Email:', user.get('email'));
      console.log('Phone number', user.get('phoneNumber'));

      // Pass the user to the next screen for further actions
      navigation.navigate('AwaitVerification', { user });

    } catch (error) {
      if (error.code === 202) {
        setErrorMsg('Email already exists. Please use a different email.');
      } else {
        setErrorMsg('An error occurred during registration. Please try again later.');
        console.error('Error registering user:', error);
      }
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Create Account</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Surname"
            value={surname}
            onChangeText={setSurname}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number(+265)"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={13}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleRegistration} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Register'}</Text>
          </TouchableOpacity>
          {errorMsg ? (
            <Text style={styles.errorMessage}>{errorMsg}</Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16,
  },
  formContainer: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 30,
  },
  input: {
    width: 250,
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 40,
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
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default RegistrationForm;
