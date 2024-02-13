import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Alert, ScrollView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MealPrep from '../classes/mealPrep';
import { useNavigation } from '@react-navigation/native';
import setupNotifications from '../reusableComp/mealReminder';

const FoodEntryForm = ({ route }) => {
  const mealprep = new MealPrep();

  const { MealType, cellId } = route.params;
  const [foodName, setFoodName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [mealType, setMealType] = useState(''); // New state for mealType
  const [preparationTime, setPreparationTime] = useState(''); // New state for preparationTime
  const navigation = useNavigation();

  const apiSuggestedMeals = [
    { id: 1, name: 'Meal 1', ingredients: 'Ingredient 1, Ingredient 2, Ingredient 1, Ingredient 2', photo: 'photo1.jpg' },
    { id: 2, name: 'Meal 2', ingredients: 'Ingredient 3, Ingredient 4', photo: 'photo2.jpg' },
    { id: 3, name: 'Meal 3', ingredients: 'Ingredi..ent 5, Ingredient 6', photo: 'photo3.jpg' },
  ];

  const doctorRecommendedMeals = [
    { id: 4, name: 'Recommended Meal 1', ingredients: 'Ingredient 7, Ingredient 8', photo: 'photo4.jpg' },
    { id: 5, name: 'Recommended Meal 2', ingredients: 'Ingredient 9, Ingredient 10', photo: 'photo5.jpg' },
  ];

  const renderMealView = (meal) => (
    <TouchableOpacity key={meal.id} style={styles.mealView} onPress={() => handleMealPress(meal)}>
      {/* Placeholder for photo (you can replace this with an actual image component) */}
      <View style={styles.mealPhoto} />

      {/* Meal name */}
      <Text style={styles.mealName}>{meal.name}</Text>

      {/* Ingredients */}
      <Text style={styles.mealIngredients}>{meal.ingredients}</Text>
    </TouchableOpacity>
  );

  const handleMealPress = (meal) => {
    // Handle the press event for the meal view
    console.log(`Meal ${meal.name} pressed`);
  };

  const handleAddToDatabase = () => {
    // Handle adding data to the database using MealPrep class
    mealprep.foodName = foodName;
    mealprep.ingredients = ingredients;
    mealprep.selectedTime = selectedTime;
    mealprep.mealType = MealType;
    mealprep.cellId = cellId;

    mealprep.commitToDatabase();
    setupNotifications();
    console.log(foodName, selectedTime, cellId, ingredients);
    setFoodName('');
    setIngredients('');
  };

  const MealPreparationInput = () => {
    return (
      <View>
        {/* <TextInput
          placeholder="Enter meal type"
          value={mealType}
          onChangeText={(text) => setMealType(text)}
        /> */}
        {/* <TextInput
          placeholder="Enter preparation time (minutes)"
          keyboardType="numeric"
          value={preparationTime}
          onChangeText={(text) => setPreparationTime(text)}
        />
        <Button title="Submit" onPress={() => handleInputBlur(mealType, preparationTime)} /> */}
      </View>
    );
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    hideTimePicker();
    // Validate input when the time is selected
    handleInputBlur(mealType, preparationTime);
  };

  const handleInputBlur = () => {
    const enteredPrepTime = parseInt(preparationTime, 10);

    if (!isNaN(enteredPrepTime)) {
      const currentTime = new Date();
      const servingTimes = {
        breakfast: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 7, 0),
        lunch: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 12, 0),
        supper: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 18, 0),
        snack1: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 9, 30),
        snack2: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 15, 30),
      };

      const validPrepTime = mealType.toLowerCase().includes('snack') ? 10 : 20;

      const targetTime = new Date(servingTimes[mealType.toLowerCase()]);
      targetTime.setMinutes(targetTime.getMinutes() - validPrepTime);

      if (currentTime.getTime() >= targetTime.getTime()) {
        Alert.alert('Success', `Valid preparation time for ${mealType}`);
      } else {
        Alert.alert('Error', `Invalid preparation time for ${mealType}. It should be at least ${validPrepTime} minutes before the serving time.`);
      }
    } else {
      Alert.alert('Error', 'Please enter a valid preparation time.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Food Name/Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Name/Title:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter food name/title"
            value={foodName}
            onChangeText={(text) => setFoodName(text)}
          />
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients:</Text>
          <TextInput
            style={[styles.textInput, { height: 100 }]}
            placeholder="Enter ingredients (separate with commas)"
            multiline
            value={ingredients}
            onChangeText={(text) => setIngredients(text)}
          />
        </View>

        {/* Time Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time:</Text>
          <TouchableOpacity onPress={showTimePicker}>
            <Text>{selectedTime.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
          />
        </View>

        {/* Meal Preparation Input */}
        <MealPreparationInput />

        {/* API Suggested Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Suggested Meals:</Text>
          {apiSuggestedMeals.map((meal) => renderMealView(meal))}
        </View>

        {/* Doctor Recommended Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Doctor Recommended Meals:</Text>
          {doctorRecommendedMeals.map((meal) => renderMealView(meal))}
        </View>

      </ScrollView>

      {/* Floating Button for Add to Database */}
      <TouchableWithoutFeedback onPress={handleAddToDatabase}>
        <View style={styles.floatingButton}>
          <Text style={styles.buttonText}>+</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#003300',
    borderStyle: 'dotted',
    borderRadius: 10,
    padding: 8,
    fontSize: 16,
  },
  mealView: {
    borderWidth: 2,
    borderColor: '#003300',
    borderStyle: 'dotted',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
  },
  mealPhoto: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginBottom: 8,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mealIngredients: {
    fontSize: 14,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'transparent',
    borderRadius: 30,
    borderColor: 'lightgreen',
    borderWidth: 5,
    borderStyle: 'dashed',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'green',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default FoodEntryForm;
