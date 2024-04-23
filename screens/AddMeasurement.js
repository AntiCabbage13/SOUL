import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert,ActivityIndicator, } from 'react-native';
import Parse from 'parse/react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../AppContext';
import { getHeightForAgeReferenceDataFromAPI } from "../classes/calcualteHeightForage";
import { getWeightForAgeReferenceDataFromAPI } from "../classes/calcualateweightForage";
import AsyncStorage from '@react-native-async-storage/async-storage';
const AddMeasurement = () => {

  const navigation = useNavigation();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date()); // Initialize with a default date
  const [childObjectId, setChildObjectId] = useState(null);
  const [gender, setGender] = useState(null);
  Parse.initialize('VXLSRSLFzlwWVZnGLbF57Cm9JgBU1nilXN76HYFA', 'RAzzzAhMZpT8AwpJIHhLubChsR8m7yMvJ1SPvzjW');
  Parse.serverURL = 'https://parseapi.back4app.com/';
  const [isLoading, setIsLoading] = useState(false); 
  const retrieveDataFromLocal = async () => {
    try {
      const storedData = await AsyncStorage.getItem('childDatainfo');

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('Retrieved data from local storage:', parsedData);
        return parsedData;
      } else {
        console.log('No data found in local storage');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving data from local storage:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedChildData = await retrieveDataFromLocal();

      if (storedChildData) {
        setChildObjectId(storedChildData.childObjectId);
        setGender(storedChildData.gender);
        setDateOfBirth(new Date(storedChildData.dateOfBirth)); // Convert string to Date
        
      } else {
        console.log('No stored data found.');
      }
    };

    fetchData(); // Call the fetchData function when the component mounts

  }, []);

  // Function to calculate age in months
  const calculateAge = (birthDate, currentDate) => {
    const birth = new Date(birthDate);
    const current = new Date(currentDate);

    const months = (current.getFullYear() - birth.getFullYear()) * 12 +
      (current.getMonth() - birth.getMonth());

    return months;
  };

  const saveMeasurementData = async () => {
    try {

      const storedChildData = await retrieveDataFromLocal();
      setIsLoading(true);
      if (storedChildData) {
        // Now you can use the retrieved data as needed
        const { childObjectId, dateOfBirth, gender } = storedChildData;
        console.log('Using retrieved data:', childObjectId, dateOfBirth, gender);
       
      setIsLoading(false);
       
       
        // Ensure that dateOfBirth is a valid date
        if (!dateOfBirth) {
          console.error('Invalid date of birth:', dateOfBirth);
          return;
        }
      } else {
        // Handle the case where no data is found
        console.log('No stored data found.');
      }

      const MeasurementData = Parse.Object.extend('addmeasure');
      const measurement = new MeasurementData();

      // Ensure that dateOfBirth is not null before setting it in the measurement object
      if (!dateOfBirth) {
        console.error('Invalid date of birth:', dateOfBirth);
        return;
      }

      // Convert the date to a string in the format expected by Parse
      const isoDateString = dateOfBirth.toISOString();

      measurement.set('weight', parseFloat(weight));
      measurement.set('height', parseFloat(height));
      measurement.set('Dob', new Date(isoDateString)); // Convert back to Date object

      const currentDate = new Date();
      measurement.set('DateToday', currentDate);
      measurement.set('child', {
        __type: 'Pointer',
        className: 'ChildData',
        objectId: childObjectId,
      });

      const ageInMonths = calculateAge(dateOfBirth, currentDate);
      console.log('Age in months:', ageInMonths);
      if (ageInMonths >= 0 && ageInMonths <= 6) {
        if (parseFloat(height) < 0 || parseFloat(height) > 75) {
          Alert.alert(
            'Error',
            'Height is outside the acceptable range for the child\'s age (6 months - 2 years).'
          );
          return;
        }
      } else if (ageInMonths > 6 && ageInMonths <= 24) {
        if (parseFloat(height) < 60 || parseFloat(height) > 95) {
          Alert.alert(
            'Error',
            'Height is outside the acceptable range for the child\'s age (2 - 5 years).'
          );
          return;
        }
      } else if (ageInMonths > 24 && ageInMonths <= 60) {
        if (parseFloat(height) < 80 || parseFloat(height) > 125) {
          Alert.alert(
            'Error',
            'Height is outside the acceptable range for the child\'s age (0-5 years).'
          );
          return;
        }
      } else {
        if (parseFloat(height) < 45 || parseFloat(height) > 125) {
          Alert.alert(
            'Error',
            'Height is outside the acceptable range for the child\'s age (0-5 years).'
          );
          return;
        }
      }

      if (gender === 'girl') {
        if (!validateWeight(ageInMonths, 'girl', parseFloat(weight))) {
          Alert.alert(
            'Error',
            'Weight is outside the acceptable range for the child\'s age and gender.'
          );
          return;
        }
      } else if (gender === 'boy') {
        if (!validateWeight(ageInMonths, 'boy', parseFloat(weight))) {
          Alert.alert(
            'Error',
            'Weight is outside the acceptable range for the child\'s age and gender.'
          );
          return;
        }
      }

      await measurement.save();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error saving measurement data:', error);
      console.log('the retrieved date of birth is', dateOfBirth);
      console.log('showing child object ', childObjectId);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Add Measurement</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={(text) => setHeight(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={(text) => setWeight(text)}
          />
          {/* ... other UI components */}
          <TouchableOpacity style={styles.button} onPress={saveMeasurementData}>
          {isLoading ? (
              <ActivityIndicator size="small" color="green" /> 
            ) : (
              <Text style={styles.buttonText}>Add Measurements </Text>

            )}
           
           
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

export default AddMeasurement;
