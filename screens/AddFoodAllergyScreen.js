import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Button } from 'react-native';
import AllergyDatabaseHelper from '../reusableComp/AllergyDatabaseHelper';
import Ionicons from '@expo/vector-icons/Ionicons';
const AddFoodAllergyScreen = () => {
  const [allergy, setAllergy] = useState('');
  const [allergies, setAllergies] = useState([]);
  const db = new AllergyDatabaseHelper(); // Create an instance of DatabaseHelper

  useEffect(() => {
    // Fetch all allergies from the database when the component mounts
    fetchAllAllergies();
  }, []);

  const fetchAllAllergies = () => {
    // Fetch all allergies from the database
    db.getAllAllergies()
      .then(allergies => setAllergies(allergies))
      .catch(error => console.error('Error fetching allergies:', error));
  };

  const handleAddAllergy = () => {
    // Prompt for confirmation
    Alert.alert(
      'Confirm Allergy Addition',
      `Are you sure you want to add "${allergy}" to the food allergy list?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // Call the addAllergy function from DatabaseHelper to insert the allergy
            db.addAllergy(allergy)
              .then(() => {
                // Clear the input field after submission
                setAllergy('');
                // Show feedback alert
                Alert.alert('Success', `Allergy "${allergy}" has been added.`);
                // Fetch updated list of allergies
                fetchAllAllergies();
              })
              .catch(error => console.error('Error adding allergy:', error));
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleRemoveAllergy = (id) => {
    // Prompt for confirmation
    Alert.alert(
      'Confirm Allergy Removal',
      `Are you sure you want to remove this allergy?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // Call the removeAllergy function from DatabaseHelper to delete the allergy
            db.removeAllergy(id)
              .then(() => {
                // Show feedback alert
                Alert.alert('Success', 'Allergy has been removed.');
                // Fetch updated list of allergies
                fetchAllAllergies();
              })
              .catch(error => console.error('Error removing allergy:', error));
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Food Allergy:</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g., Peanuts, Dairy, Gluten"
        value={allergy.trim().toLowerCase()}
        onChangeText={setAllergy}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleAddAllergy}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      
      <Text style={styles.label}>Allergies:</Text>
      <FlatList
        data={allergies}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
          <Text>{item.allergy}</Text>
          <TouchableOpacity onPress={() => handleRemoveAllergy(item.id)}>
            {/* Use Ionicons for the trash icon */}
            <Ionicons name="trash-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  submitButton: {
    width: 150,
    padding: 8,
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 40,
    backgroundColor: 'transparent',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    borderStyle: 'dotted',
  },
  buttonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 16,
    padding: 8,
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 5,
    borderStyle: 'dotted',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderStyle: 'dotted',
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 5,
    marginBottom: 10,
    width: '78.3%', // Adjust the width as needed to fit the content
    overflow: 'hidden', // Add this line to hide overflowing content
  },
  
  
});

export default AddFoodAllergyScreen;
