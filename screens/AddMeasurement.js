import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Parse from 'parse/react-native';

const AddMeasurement = ({ route }) => {
  const { childObjectId } = route.params;

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');

  Parse.initialize('VXLSRSLFzlwWVZnGLbF57Cm9JgBU1nilXN76HYFA', 'RAzzzAhMZpT8AwpJIHhLubChsR8m7yMvJ1SPvzjW');
  Parse.serverURL = 'https://parseapi.back4app.com/';

  const saveMeasurementData = async () => {
    const MeasurementData = Parse.Object.extend('addmeasure');
    const measurement = new MeasurementData();

    // Set measurement data properties
    measurement.set('weight', parseFloat(weight));
    measurement.set('height', parseFloat(height));
    measurement.set('headCircumference', parseFloat(headCircumference));

    // Set a reference to the child's objectId
    measurement.set('child', {
      __type: 'Pointer',
      className: 'ChildData',
      objectId: childObjectId,
    });

    try {
      // Save the measurement data to the "addmeasure" table
      await measurement.save();

      // Measurement data has been saved successfully
    } catch (error) {
      // Handle any errors that occur during the save process
      console.error('Error saving measurement data:', error);
    }
  }

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
          <TextInput
            style={styles.input}
            placeholder="Head Circumference (cm)"
            keyboardType="numeric"
            value={headCircumference}
            onChangeText={(text) => setHeadCircumference(text)}
          />
          <TouchableOpacity style={styles.button} onPress={saveMeasurementData}>
            <Text style={styles.buttonText}>Save Measurement Data</Text>
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
