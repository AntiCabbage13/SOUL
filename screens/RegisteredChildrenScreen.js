import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Parse from 'parse/react-native';
import { useNavigation } from '@react-navigation/native';
import AddMeasurementprof from '../screens/AddMeasurementprof';

const RegisteredChildrenScreen = () => {
  const [childrenData, setChildrenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchData() {
      try {
        const ChildData = Parse.Object.extend('ChildData');
        const query = new Parse.Query(ChildData);
        const result = await query.find();

        const data = result.map((child) => ({
          objectId: child.id,
          gender: child.get('gender'),
          surname: child.get('surname'),
          firstName: child.get('firstName'),
          dateOfBirth: child.get('DateOfBirth').toDateString(),
        }));

        setChildrenData(data);
        await AsyncStorage.setItem('childrenData', JSON.stringify(data));
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching children data:', error);
        setLoading(false); // Set loading to false in case of error
      }
    }

    fetchData();
  }, []);

  const handleMeasurement = (objectId, gender, dateOfBirth) => {
    navigation.navigate('AddMeasurementprof', {
      childObjectId: objectId,
      childGender: gender,
      childDateOfBirth: dateOfBirth,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
        <Text style={styles.loadingText}>Getting registered children...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {childrenData.map((child) => (
        <View key={child.objectId} style={styles.row}>
          <Text style={styles.text}>Name: {child.firstName} {child.surname}</Text>
          <Text style={styles.text}>Gender: {child.gender}</Text>
          <Text style={styles.text}>Date of Birth: {child.dateOfBirth}</Text>
          <TouchableOpacity 
            style={styles.buttonContainer}
            onPress={() => handleMeasurement(child.objectId, child.gender, child.dateOfBirth)} 
          >
            <Text style={styles.buttonText}>Take Measurement</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  row: {
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 10,
    borderStyle: 'dotted',
    padding: 10,
    marginBottom: 10,
    width: '80%',
    alignSelf: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
  buttonContainer: {
    borderColor: 'green',
    backgroundColor: 'transparent',
    borderRadius: 40,
    borderWidth: 2,
    borderStyle:'dotted',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'green',
  },
});

export default RegisteredChildrenScreen;
