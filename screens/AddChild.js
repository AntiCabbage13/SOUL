import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Parse from 'parse/react-native';

Parse.initialize('VXLSRSLFzlwWVZnGLbF57Cm9JgBU1nilXN76HYFA', 'RAzzzAhMZpT8AwpJIHhLubChsR8m7yMvJ1SPvzjW');
Parse.serverURL = 'https://parseapi.back4app.com/';

const AddChild = ({ navigation }) => {
  const [childData, setChildData] = useState({
    firstName: '',
    surname: '',
    dateOfBirth: null,
    gender: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const setChildValues = (property, value) => {
    setChildData({ ...childData, [property]: value });
  };

 // Other code ...

const saveChildData = async () => {
  // Check if all required fields are filled
  if (!childData.firstName || !childData.surname || !childData.dateOfBirth || !childData.gender) {
    // Handle validation error, e.g., show an error message
    return;
  }

  try {
    // Create a new Parse object for storing child data
    const ChildData = Parse.Object.extend('ChildData');
    const child = new ChildData();

    // Set child data properties
    child.set('firstName', childData.firstName);
    child.set('surname', childData.surname);
    child.set('DateOfBirth', childData.dateOfBirth);
    child.set('gender', childData.gender);

    // Create a pointer to the User table
    const User = Parse.Object.extend('User');
    const user = new User();
    user.id = Parse.User.current().id; // Use the current user's objectId as the pointer

    // Set the User pointer in the ChildData table
    child.set('user', user);

    // Save the child data to Back4App
    const response = await child.save();

    // Retrieve the objectId from the response
    const childObjectId = response.id;

    // Now you can navigate to the AddMeasurement screen and pass both childObjectId and dateOfBirth
    navigation.navigate('AddMeasurement', { childObjectId, dateOfBirth: childData.dateOfBirth, gender: childData.gender });
    console.log('childObjectId:', childObjectId);
  } catch (error) {
    // Handle the error, e.g., show an error message
    console.error('Error saving child data:', error);
  }
};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Add Child</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={childData.firstName}
            onChangeText={(text) => setChildValues('firstName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Surname"
            value={childData.surname}
            onChangeText={(text) => setChildValues('surname', text)}
          />
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerButtonText}>Select Date of Birth</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={childData.dateOfBirth || new Date()}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setChildValues('dateOfBirth', selectedDate);
                }
                setShowDatePicker(false);
              }}
            />
          )}
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, childData.gender === 'Boy' && styles.selectedGenderButton]}
              onPress={() => setChildValues('gender', 'Boy')}
            >
              <Text style={styles.genderButtonText}>Boy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, childData.gender === 'Girl' && styles.selectedGenderButton]}
              onPress={() => setChildValues('gender', 'Girl')}
            >
              <Text style={styles.genderButtonText}>Girl</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={saveChildData}>
            <Text style={styles.buttonText}>Save Child Data</Text>
          </TouchableOpacity>
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
  datePickerButton: {
    width: 250,
    padding: 8,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 40,
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginTop: 10,
  },
  datePickerButtonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
  genderContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  genderButton: {
    width: 80,
    padding: 8,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 40,
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedGenderButton: {
    backgroundColor: 'green',
  },
  genderButtonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    width: 200,
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

export default AddChild;
