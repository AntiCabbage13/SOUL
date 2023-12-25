import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

class StepDOBGender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSteps: "",
      currentStep: "",
      gender: "",
      genderItems: [
        { label: "Select Gender", value: "" },
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
      ],
      dateOfBirth: new Date(),
      showDatePicker: false, 
    };
  }

  static getDerivedStateFromProps = (props) => {
    const { getTotalSteps, getCurrentStep } = props;
    return {
      totalSteps: getTotalSteps(),
      currentStep: getCurrentStep(),
    };
    console.log("Total Steps:", getTotalSteps());

  };

  showDatePicker = () => {
    this.setState({ showDatePicker: true });
  };

  hideDatePicker = () => {
    this.setState({ showDatePicker: false });
  };

  handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      this.setState({ dateOfBirth: selectedDate, showDatePicker: false });
    } else {
      this.hideDatePicker();
    }
  };

  nextStep = () => {
    const { next, saveState } = this.props;
    // Save the entered data
    const { gender, dateOfBirth } = this.state;
    saveState({ gender, dateOfBirth });
  
    // Log the values to the console
    console.log("Gender:", gender);
    console.log("Date of Birth:", dateOfBirth);
  
    // Go to the next step
    next();
  };
  
  goBack = () => {
    const { back } = this.props;
    // Go to the previous step
    back();
  };

  render() {
    const {
      currentStep,
      totalSteps,
      genderItems,
      dateOfBirth,
      showDatePicker,
    } = this.state;

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.currentStepText}>{`Step ${currentStep} of ${totalSteps}`}</Text>
        </View>

        {/* Use Picker for the gender dropdown */}
        <Picker
          style={styles.genderPickerStyle}
          selectedValue={this.state.gender}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({ gender: itemValue });
          }}
        >
          {genderItems.map((item, index) => (
            <Picker.Item label={item.label} value={item.value} key={index} />
          ))}
        </Picker>

        {/* Use DateTimePicker for selecting date */}
        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth}
            mode="date"
            display="spinner" 
            onChange={this.handleDateChange}
          />
        )}

        <TouchableOpacity onPress={this.showDatePicker} style={styles.datePickerButton}>
          <Text style={styles.datePickerButtonText}>Select Date of Birth</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.goBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.nextStep} style={styles.nextButton}>
            <Feather name="arrow-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  currentStepText: {
    fontSize: 16,
    marginBottom: 20,
  },
  genderPickerStyle: {
    width: 173, 
    marginTop: 3,
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,

  },
  datePickerButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  datePickerButtonText: {
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  nextButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});
export default StepDOBGender;
