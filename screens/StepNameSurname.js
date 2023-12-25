import React, { Component } from "react";
import { View, TouchableOpacity, Text, TextInput, StyleSheet } from "react-native";
import AnimatedMultistep from "react-native-animated-multistep";
import { Feather } from "@expo/vector-icons";

class StepNameSurname extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSteps: "",
      currentStep: "",
      firstName: "",
      lastName: "",
      isButtonEnabled: false // Initially, the button is disabled
    };
    
  }

  static getDerivedStateFromProps = (props) => {
    const { getTotalSteps, getCurrentStep } = props;
    return {
      totalSteps: getTotalSteps(),
      currentStep: getCurrentStep()
    };
    console.log("Total Steps:", getTotalSteps());
  };

  handleFirstNameChange = (text) => {
    // Use regex to remove any non-alphabetic characters
    const cleanedText = text.replace(/[^A-Za-z]/g, "");
    this.setState({ firstName: cleanedText }, this.validateButton);
  };

  handleLastNameChange = (text) => {
    // Use regex to remove any non-alphabetic characters
    const cleanedText = text.replace(/[^A-Za-z]/g, "");
    this.setState({ lastName: cleanedText }, this.validateButton);
  };

  validateButton = () => {
    // Enable the button if both fields are entered
    const { firstName, lastName } = this.state;
    const isButtonEnabled = firstName.length > 0 && lastName.length > 0;
    this.setState({ isButtonEnabled });
  };

  nextStep = () => {
    const { next, saveState } = this.props;
    // Save the entered data
    const { firstName, lastName } = this.state;
    saveState({ firstName, lastName });
    
    // Console log the values of the entered data
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);

    // Go to the next step
    next();
  };

  goBack() {
    const { back } = this.props;
    // Go to the previous step
    back();
  }

  render() {
    const { currentStep, totalSteps, isButtonEnabled } = this.state;

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.currentStepText}>{`Step ${currentStep} of ${totalSteps}`}</Text>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={this.handleFirstNameChange}
          value={this.state.firstName}
          placeholder={"First Name"}
          placeholderTextColor="#fff"
        />
        <TextInput
          style={styles.input}
          onChangeText={this.handleLastNameChange}
          value={this.state.lastName}
          placeholder={"Last Name"}
          placeholderTextColor="#fff"
        />
        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={this.nextStep}
            style={[styles.btnStyle, isButtonEnabled ? styles.enabledButton : styles.disabledButton]}
            disabled={!isButtonEnabled} // Disable the button when fields are not entered
          >
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
    alignItems: "center"
  },
  currentStepText: {
    fontSize: 16,
    marginBottom: 20
  },
  input: {
    backgroundColor: "white",
    width: 200,
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10
  },
  btnContainer: {
    marginTop: 20
  },
  btnStyle: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  enabledButton: {
    // Style for the enabled button
  },
  disabledButton: {
    backgroundColor: "gray" // Style for the disabled button
  }
});

export default StepNameSurname;
