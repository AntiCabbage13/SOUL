import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DatabaseHelperheight from '../reusableComp/DatabaseHelperheight'; // Corrected import
import DatabaseHelper from '../reusableComp/DatabaseHelper'; // Corrected import

const ChartsScreen = () => {
  const [heightZScore, setHeightZScore] = useState(null);
  const [weightZScore, setWeightZScore] = useState(null);

  useEffect(() => {
    // Fetch height z-score
    DatabaseHelperheight.getLastInsertedRowHeight()
      .then((lastInsertedRow) => {
        const { chronological_sds } = lastInsertedRow;
        setHeightZScore(chronological_sds.toFixed(4)); // Round to 4 decimal places
      })
      .catch((error) => {
        console.error("Error fetching height z-score:", error);
      });

    // Fetch weight z-score
    DatabaseHelper.getLastInsertedRow()
      .then((lastInsertedRow) => {
        const { chronological_sds } = lastInsertedRow;
        setWeightZScore(chronological_sds.toFixed(4)); // Round to 4 decimal places
      })
      .catch((error) => {
        console.error("Error fetching weight z-score:", error);
      });
  }, []);

  // Function to get weight category based on z-score
  const getWeightCategory = (zScore) => {
    if (zScore < -2.5) {
      return { category: 'Severe Underweight', color: 'purple' };
    } else if (zScore >= -2.5 && zScore < -1) {
      return { category: 'Underweight', color: 'blue' };
    } else if (zScore >= -1 && zScore < 1) {
      return { category: 'Normal Weight', color: 'green' };
    } else if (zScore >= 1 && zScore < 2) {
      return { category: 'Overweight', color: 'orange' };
    } else if (zScore >= 2) {
      return { category: 'Obese', color: 'red' };
    } else {
      return { category: 'Unknown', color: 'black' };
    }
  };

  // Function to get height category based on z-score
  const getHeightCategory = (zScore) => {
    if (zScore < -2.5) {
      return { category: 'Severe Short Stature', color: 'purple' };
    } else if (zScore >= -2.5 && zScore < -1) {
      return { category: 'Short Stature', color: 'blue' };
    } else if (zScore >= -1 && zScore < 1) {
      return { category: 'Normal Height', color: 'green' };
    } else if (zScore >= 1 && zScore < 2) {
      return { category: 'Tall Stature', color: 'orange' };
    } else if (zScore >= 2) {
      return { category: 'Very Tall Stature', color: 'red' };
    } else {
      return { category: 'Unknown', color: 'black' };
    }
  };

  // Function to render weight z-score message
  const renderWeightMessage = () => {
    if (weightZScore !== null) {
      const { category, color } = getWeightCategory(weightZScore);
      return (
        <View style={[styles.messageContainer, { backgroundColor: color }]}>
          <Text style={styles.message}>
            Weight Z-Score: {weightZScore}{'\n'}
            <Text style={styles.category}>{category}</Text>
          </Text>
          {category !== 'Normal Weight' && (
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
            Height Z-Score: {heightZScore}{'\n'}
            <Text style={styles.category}>{category}</Text>
          </Text>
          {category !== 'Normal Height' && (
            <Text style={styles.advice}>
              Seek professional help immediately.
            </Text>
          )}
        </View>
      );
    }
    return null;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>These z-scores represent the measurements taken recently.</Text>
      {renderWeightMessage()}
      {renderHeightMessage()}
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
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 40,
    borderRadius: 5,
  },
  heading: {
    fontSize: 20,
    color: '#000',
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',

  },
  message: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  category: {
    fontSize: 18,
    color: '#fff',
  },
  advice: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ChartsScreen;
