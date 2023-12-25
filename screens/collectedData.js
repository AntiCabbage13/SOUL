import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CollectedData = ({ collectedData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Collected Data</Text>
      <View style={styles.dataContainer}>
        <Text>Weight: {collectedData.weight}</Text>
        <Text>Height: {collectedData.height}</Text>
        <Text>Head Circumference: {collectedData.headCircumference}</Text>
        <Text>Gender: {collectedData.gender}</Text>
        <Text>Date of Birth: {collectedData.dateOfBirth}</Text>
        {/* Add more data fields as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  dataContainer: {
    width: "80%",
  },
});

export default CollectedData;
