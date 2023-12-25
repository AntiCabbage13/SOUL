import React, { Component } from "react";
import { View, TouchableOpacity, Text, TextInput, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

class StepWeightHeight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSteps: "",
      currentStep: "",
      weight: "",
      height: "",
      headCircumference: ""
    };
  }

  static getDerivedStateFromProps = (props) => {
    const { getTotalSteps, getCurrentStep, getState } = props;
    const state = getState();
    return {
      totalSteps: getTotalSteps(),
      currentStep: getCurrentStep(),
      weight: state.weight || "",
      height: state.height || "",
      headCircumference: state.headCircumference || ""
    };
  };

  handleInputChange = (field, numeric) => {
    this.setState({ [field]: numeric });
  };

  // Add onBlur event handler to save the input value when the field loses focus
  handleInputBlur = (field) => {
    const { [field]: value } = this.state;
    this.props.saveState({ [field]: value });
  };

  navigateToCollectedData = () => {
    const { navigation } = this.props;
    navigation.navigate('CollectedData');
  };

  nextStep = () => {
    const { next, saveState } = this.props;
    // Save the entered data
    const { weight, height, headCircumference } = this.state;
    saveState({ weight, height, headCircumference });

    // Go to the next step
    next();
  };

  goBack = () => {
    const { back } = this.props;
    // Go to the previous step
    back();
  };

  render() {
    const { currentStep, totalSteps } = this.state;

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.currentStepText}>{`Step ${currentStep} of ${totalSteps}`}</Text>
        </View>
        
        <TextInput
          style={styles.input}
          onChangeText={(numeric) => this.handleInputChange("weight", numeric)}
          onBlur={() => this.handleInputBlur("weight")} // Save on onBlur
          value={this.state.weight}
          placeholder={"Weight"}
          placeholderTextColor="#fff"
          keyboardType="numeric"
          onKeyPress={(e) => {
            // Prevent non-numeric characters from being entered
            if (e.nativeEvent.key && !/^[0-9]+$/.test(e.nativeEvent.key)) {
              e.preventDefault();
            }
          }}
        />

        <TextInput
          style={styles.input}
          onChangeText={(numeric) => this.handleInputChange("height", numeric)}
          onBlur={() => this.handleInputBlur("height")} // Save on onBlur
          value={this.state.height}
          placeholder={"Height"}
          placeholderTextColor="#fff"
          keyboardType="numeric"
          onKeyPress={(e) => {
            // Prevent non-numeric characters from being entered
            if (e.nativeEvent.key && !/^[0-9]+$/.test(e.nativeEvent.key)) {
              e.preventDefault();
            }
          }}
        />

        <TextInput
          style={styles.input}
          onChangeText={(numeric) => this.handleInputChange("headCircumference", numeric)}
          onBlur={() => this.handleInputBlur("headCircumference")} // Save on onBlur
          value={this.state.headCircumference}
          placeholder={"Head Circumference"}
          placeholderTextColor="#fff"
          keyboardType="numeric"
          onKeyPress={(e) => {
            // Prevent non-numeric characters from being entered
            if (e.nativeEvent.key && !/^[0-9]+$/.test(e.nativeEvent.key)) {
              e.preventDefault();
            }
          }}
        />

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
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20
  },
  backButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10
  },
  nextButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  }
});

export default StepWeightHeight;
