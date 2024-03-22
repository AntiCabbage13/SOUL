import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert,StyleSheet } from 'react-native';
import Parse from 'parse/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import HealthcareProfessionalHome from "./HealthcareProfessionalHome.js";
import {getChildData} from '../classes/getChildData';
import {getChildDataWeight} from '../classes/getChildDataWeight';


const AddMeasurementprof = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { childObjectId,  childGender,  childDateOfBirth } = route.params; // Extracting params from route
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dateOfBirthState, setDateOfBirth] = useState(new Date());
  const [childObjectIdState, setChildObjectId] = useState(null);
  const [genderState, setGender] = useState(null);

  useEffect(() => {
    if (childObjectId && childGender && childDateOfBirth) {
      setChildObjectId(childObjectId);
      setGender(childGender);
      setDateOfBirth(new Date(childDateOfBirth));
    }
console.log('prof screen',childObjectId,childGender,childDateOfBirth);

  }, [childObjectId, childGender, childDateOfBirth]);

  const calculateAge = (childDateOfBirth, currentDate) => {
    const birth = new Date(childDateOfBirth);
    const current = new Date(currentDate);

    const months = (current.getFullYear() - birth.getFullYear()) * 12 +
      (current.getMonth() - birth.getMonth());

    return months;
  };
  const saveMeasurementData = async () => {
    try {
      const MeasurementData = Parse.Object.extend('addmeasure');
      const measurement = new MeasurementData();

      const isoDateString = dateOfBirthState.toISOString();

      measurement.set('weight', parseFloat(weight));
      measurement.set('height', parseFloat(height));
      measurement.set('Dob', new Date(isoDateString));

      const currentDate = new Date();
      measurement.set('DateToday', currentDate);
      measurement.set('child', {
        __type: 'Pointer',
        className: 'ChildData',
        objectId: childObjectIdState,
      });

      const ageInMonths = calculateAge(dateOfBirthState, currentDate);

      // Validation checks
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

      if (height !== '') {
        // If height is available, call getChildData
        getChildData({ objectId: childObjectIdState, childDateOfBirthh: isoDateString, childGender: genderState, height: height });
      }if (weight !== '') {
        // If weight is available, call getChildDataWeight
        getChildDataWeight({ objectId: childObjectIdState, childDateOfBirth: isoDateString, childGender: genderState, weight: weight });
        console.log('Calling getChildDataWeight');
      }

      await measurement.save();
    } catch (error) {
      console.error('Error saving measurement data:', error);
    }

    // Navigate to HealthcareProfessionalHome screen
    navigation.navigate('HealthcareProfessionalHome');
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
          <TouchableOpacity style={styles.button} onPress={saveMeasurementData}>
            <Text style={styles.buttonText}>Add Measurements </Text>
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
export default AddMeasurementprof;
