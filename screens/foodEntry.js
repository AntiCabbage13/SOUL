import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MealPrep from "../classes/mealPrep";
import { useNavigation } from "@react-navigation/native";
import setupNotifications from "../reusableComp/mealReminder";
import DatabaseHelperheight from "../reusableComp/DatabaseHelperheight";
import AllergyDatabaseHelper from "../reusableComp/AllergyDatabaseHelper";
import { setmealtype } from "../classes/NutrientAnalysis";
import { FoodAnalysisCall } from "../classes/FoodAnallysisCall";
import DatabaseHelper from "../reusableComp/DatabaseHelper";
const FoodEntryForm = ({ route }) => {
  const mealprep = new MealPrep();

  const { MealType, cellId } = route.params;
  const [foodName, setFoodName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [mealType, setMealType] = useState(""); // New state for mealType
  const [preparationTime, setPreparationTime] = useState(""); // New state for preparationTime
  const [showMenu, setShowMenu] = useState(false); // New state for menu visibility
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  //  const { setmealtype } = useMealType();

  useEffect(() => {
    setmealtype(MealType);
  }, [MealType, setmealtype]);

  const renderMealView = (meal) => (
    <TouchableOpacity
      key={meal.id}
      style={styles.mealView}
      onPress={() => handleMealPress(meal)}
    >
      {/* Placeholder for photo (you can replace this with an actual image component) */}
      <View style={styles.mealPhoto} />

      {/* Meal name */}
      <Text style={styles.mealName}>{meal.name}</Text>

      {/* Ingredients */}
      <Text style={styles.mealIngredients}>{meal.ingredients}</Text>
    </TouchableOpacity>
  );

  const renderOptions = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => handleRemoveMeal(cellId)}>
          <Text>Remove Meal</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleUpdateMeal(cellId)}>
          <Text>Update Meal</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleMealPress = (meal) => {
    // Handle the press event for the meal view
    console.log(`Meal ${meal.name} pressed`);
  };

  const handleRemoveMeal = (cellId) => {
    // Function to remove meal from database
    console.log("Remove meal:", cellId);
    // Call the deleteFromDatabase method of MealPrep class with cellId
    const mealprep = new MealPrep();
    mealprep.cellId = cellId;
    mealprep.deleteFromDatabase();
  };

  const handleUpdateMeal = (cellId) => {
    // Show a simple alert to prompt the user to edit the meal
    Alert.alert(
      "Edit Meal",
      "To edit this  meal details simply fill the form and submit changes.",
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ],
      { cancelable: false }
    );
  };

  const handleAddToDatabase = () => {
    // Initialize mealprep before setting its properties
    const mealprep = new MealPrep();

    // Set properties of mealprep
    mealprep.foodName = foodName;
    mealprep.ingredients = ingredients;
    mealprep.selectedTime = selectedTime;
    mealprep.mealType = MealType;
    mealprep.cellId = cellId;
    mealprep.hasMeal = route.params.hasMeal; // Add hasMeal to the parameters

    // Call the addToDatabase() method with the callback function
    mealprep
      .addToDatabase()
      .then((message) => {
        // Success handler
        console.log("Success: ", message);
        // Proceed with other operations like setupNotifications()
        mealprep.commitToDatabase();
        setupNotifications();
        console.log(foodName, selectedTime, cellId, ingredients);
        setFoodName("");
        setIngredients("");
      })
      .catch((error) => {
        // Error handler
        console.error("Error: ", error);
        // Display an alert to the user if the food has allergens
        if (error === "This food or its ingredient is allergic") {
          Alert.alert(
            "Food Allergy Alert",
            "This food or its ingredient is allergic"
          );
        }
        // Handle other errors as needed
      });
  };

  const MealPreparationInput = () => {
    return (
      <View>
        {/* <TextInput
        /> */}
        {/* <TextInput
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
        breakfast: new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          7,
          0
        ),
        lunch: new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          12,
          0
        ),
        supper: new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          18,
          0
        ),
        snack1: new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          9,
          30
        ),
        snack2: new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          15,
          30
        ),
      };

      const validPrepTime = mealType.toLowerCase().includes("snack") ? 10 : 20;

      const targetTime = new Date(servingTimes[mealType.toLowerCase()]);
      targetTime.setMinutes(targetTime.getMinutes() - validPrepTime);

      if (currentTime.getTime() >= targetTime.getTime()) {
        Alert.alert("Success", `Valid preparation time for ${mealType}`);
      } else {
        Alert.alert(
          "Error",
          `Invalid preparation time for ${mealType}. It should be at least ${validPrepTime} minutes before the serving time.`
        );
      }
    } else {
      Alert.alert("Error", "Please enter a valid preparation time.");
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

        <TouchableOpacity
          onPress={() => setShowMenu(!showMenu)}
          style={styles.ellipsisButton}
        >
          <Text style={styles.ellipsisText}>...</Text>
        </TouchableOpacity>

        {showMenu && (
          <View style={styles.menuOptions}>
            <TouchableOpacity
              onPress={() => handleRemoveMeal(cellId)}
              style={styles.menuOption}
            >
              <Text style={styles.menuOptionText}>Remove Meal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleUpdateMeal(cellId)}
              style={styles.menuOption}
            >
              <Text style={styles.menuOptionText}>Update Meal</Text>
            </TouchableOpacity>
          </View>
        )}

        <MealPreparationInput />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Child's Meal Suggestions:</Text>
          <FoodAnalysisCall />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAddToDatabase}
      >
        <View>
          <Text style={styles.buttonText}>+</Text>
        </View>
      </TouchableOpacity>
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
    marginTop: 50,
  },
  section: {
    marginBottom: 16,
  },
  ellipsisButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: "#003300",
    borderStyle: "dotted",
    borderRadius: 10,
    padding: 8,
    fontSize: 16,
  },
  mealView: {
    borderWidth: 2,
    borderColor: "#003300",
    borderStyle: "dotted",
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
  },
  mealPhoto: {
    width: 100,
    height: 100,
    backgroundColor: "#ccc",
    borderRadius: 10,
    marginBottom: 8,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  mealIngredients: {
    fontSize: 14,
  },
  floatingButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "transparent",
    borderRadius: 30,
    borderColor: "lightgreen",
    borderWidth: 5,
    borderStyle: "dashed",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "green",
    fontSize: 24,
    fontWeight: "bold",
  },
  ellipsisButton: {
    position: "absolute",
    top: -7,
    right: -10,
  },
  ellipsisText: {
    fontSize: 30,
    color: "green",
    fontWeight: "bold",
    transform: [{ rotate: "90deg" }],
  },
  menuOptions: {
    position: "absolute",
    top: 20,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 1,
  },
  menuOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuOptionText: {
    fontSize: 16,
  },
});

export default FoodEntryForm;
