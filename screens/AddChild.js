import React, { useState } from "react";
import { useNavigation, StackActions } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Parse from "parse/react-native";

// Initialize Parse
Parse.initialize(
  "VXLSRSLFzlwWVZnGLbF57Cm9JgBU1nilXN76HYFA",
  "RAzzzAhMZpT8AwpJIHhLubChsR8m7yMvJ1SPvzjW"
);
Parse.serverURL = "https://parseapi.back4app.com/";

const AddChild = ({ navigation }) => {
  const [childData, setChildData] = useState({
    firstName: "",
    surname: "",
    dateOfBirth: null,
    gender: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const setChildValues = (property, value) => {
    setChildData({ ...childData, [property]: value });
  };

  const saveChildData = async () => {
    if (
      !childData.firstName ||
      !childData.surname ||
      !childData.dateOfBirth ||
      !childData.gender
    ) {
      return;
    }
  
    try {
      setIsLoading(true); // Start loading indicator
  
      const ChildData = Parse.Object.extend("ChildData");
      const child = new ChildData();
  
      child.set("firstName", childData.firstName);
      child.set("surname", childData.surname);
      child.set("DateOfBirth", childData.dateOfBirth);
      child.set("gender", childData.gender);
  
      const User = Parse.Object.extend("User");
      
      // Get current user asynchronously
      const currentUser = await Parse.User.currentAsync();
      const user = new User();
      user.id = currentUser.id;
  
      child.set("user", user);
  
      const response = await child.save();
  
      setIsLoading(false); // Stop loading indicator after successful save
  
      const childObjectId = response.id;
  
      const resetAction = StackActions.replace('Login', {
        childObjectId, 
        dateOfBirth: childData.dateOfBirth, 
        gender: childData.gender 
      });
  
      navigation.dispatch(resetAction);
  
      console.log("childObjectId:", childObjectId);
    } catch (error) {
      setIsLoading(false); // Stop loading indicator if there's an error
      console.error("Error saving child data:", error);
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Add Child</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={childData.firstName}
            onChangeText={(text) => setChildValues("firstName", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Surname"
            value={childData.surname}
            onChangeText={(text) => setChildValues("surname", text)}
          />
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerButtonText}>
              Select Date of Birth
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={childData.dateOfBirth || new Date()}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setChildValues("dateOfBirth", selectedDate);
                }
                setShowDatePicker(false);
              }}
            />
          )}
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                childData.gender === "Boy" && styles.selectedGenderButton,
              ]}
              onPress={() => setChildValues("gender", "Boy")}
            >
              <Text style={styles.genderButtonText}>Boy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                childData.gender === "Girl" && styles.selectedGenderButton,
              ]}
              onPress={() => setChildValues("gender", "Girl")}
            >
              <Text style={styles.genderButtonText}>Girl</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={saveChildData}>
            {isLoading ? (
              <ActivityIndicator size="small" color="green" /> 
            ) : (
              <Text style={styles.buttonText}>Save Child Data</Text>
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
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 16,
  },
  formContainer: {
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 30,
  },
  input: {
    width: 250,
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 40,
  },
  datePickerButton: {
    width: 250,
    padding: 8,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 40,
    backgroundColor: "transparent",
    alignItems: "center",
    marginTop: 10,
  },
  datePickerButtonText: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
  },
  genderContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  genderButton: {
    width: 80,
    padding: 8,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 40,
    backgroundColor: "transparent",
    alignItems: "center",
    marginRight: 10,
  },
  selectedGenderButton: {
    backgroundColor: "green",
  },
  genderButtonText: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    width: 200,
    padding: 8,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 40,
    backgroundColor: "transparent",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddChild;
