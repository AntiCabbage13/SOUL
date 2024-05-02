import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import DatabaseHelperheight from "../reusableComp/DatabaseHelperheight"; // Corrected import
import DatabaseHelper from "../reusableComp/DatabaseHelper"; // Corrected import
import {Nutrientanalysis} from "../classes/NutrientAnalysis";
import { getHeightForAgeReferenceDataFromAPI } from "../classes/calcualteHeightForage";
import { getWeightForAgeReferenceDataFromAPI } from "../classes/calcualateweightForage";
const ChartsScreen = () => {
  const [heightZScore, setHeightZScore] = useState(null);
  const [weightZScore, setWeightZScore] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Fetch height z-score
    
    DatabaseHelperheight.getLastInsertedRowHeight()
    .then((lastInsertedRow) => {
      const { chronological_sds } = lastInsertedRow;
      setHeightZScore(chronological_sds.toFixed(4));
      console.log("height z-score:", chronological_sds);
    })
    .catch((error) => {
      console.error("Error fetching height z-score:", error);
      setError("Error fetching height z-score. Please take measurements to see z-scores.");
    });
    // Fetch weight z-score
    DatabaseHelper.getLastInsertedRow()
      .then((lastInsertedRow) => {
        const { chronological_sds } = lastInsertedRow;
        setWeightZScore(chronological_sds.toFixed(4));
        console.log("weight z-score:", chronological_sds);
      })
      .catch((error) => {
        console.error("Error fetching weight z-score:", error);
        setError(
          "Error fetching weight z-score. Please take measurements to see z-scores."
        );
      });
  }, []);

  // Function to get weight category based on z-score
  const getWeightCategory = (zScore) => {
    if (zScore < -2.5) {
      return { category: "Severe Underweight", color: "purple" };
    } else if (zScore >= -2.5 && zScore < -1) {
      return { category: "Underweight", color: "blue" };
    } else if (zScore >= -1 && zScore < 1) {
      return { category: "Normal Weight", color: "green" };
    } else if (zScore >= 1 && zScore < 2) {
      return { category: "Overweight", color: "orange" };
    } else if (zScore >= 2) {
      return { category: "Obese", color: "red" };
    } else {
      return { category: "Unknown", color: "black" };
    }
  };

  // Function to get height category based on z-score
  const getHeightCategory = (zScore) => {
    if (zScore < -2.5) {
      return { category: "Severe Short Stature", color: "purple" };
    } else if (zScore >= -2.5 && zScore < -1) {
      return { category: "Short Stature", color: "blue" };
    } else if (zScore >= -1 && zScore < 1) {
      return { category: "Normal Height", color: "green" };
    } else if (zScore >= 1 && zScore < 2) {
      return { category: "Tall Stature", color: "orange" };
    } else if (zScore >= 2) {
      return { category: "Very Tall Stature", color: "red" };
    } else {
      return { category: "Unknown", color: "black" };
    }
  };

  // Function to render weight z-score message
  const renderWeightMessage = () => {
    if (weightZScore !== null) {
      const { category, color } = getWeightCategory(weightZScore);
      return (
        <View style={[styles.messageContainer, { backgroundColor: color }]}>
          <Text style={styles.message}>
            Weight Z-Score: {weightZScore}
            {"\n"}
            <Text style={styles.category}>{category}</Text>
          </Text>
          {category !== "Normal Weight" && (
            <Text style={styles.advice}>
              Seek professional help immediately.
            </Text>
          )}
        </View>
      );
    }
    return null;
  };

  const renderHeightMessage = () => {
    if (heightZScore !== null) {
      const { category, color } = getHeightCategory(heightZScore);
      return (
        <View style={[styles.messageContainer, { backgroundColor: color }]}>
          <Text style={styles.message}>
            Height Z-Score: {heightZScore}
            {"\n"}
            <Text style={styles.category}>{category}</Text>
          </Text>
          {category !== "Normal Height" && (
            <Text style={styles.advice}>
              Seek professional help immediately.
            </Text>
          )}
        </View>
      );
    }
    return null;
  };

  const callNutrientAnalysis = () => {
    if (heightZScore !== null && weightZScore !== null) {
      const heightCategory = getHeightCategory(heightZScore).category;
      const weightCategory = getWeightCategory(weightZScore).category;
      Nutrientanalysis({ heightCategory, weightCategory });
    }
  };

  useEffect(() => {
    callNutrientAnalysis();
  }, [heightZScore, weightZScore]);


 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        These z-scores represent the measurements taken recently.
      </Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          {renderWeightMessage()}
          {renderHeightMessage()}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 40,
    padding: 40,
    borderRadius: 5,
  },
  heading: {
    fontSize: 20,
    color: "#000",
    marginBottom: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  message: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 5,
  },
  category: {
    fontSize: 18,
    color: "#fff",
  },
  advice: {
    fontSize: 16,
    color: "#fff",
  },
});

export default ChartsScreen;
