import { MediaType } from 'expo-media-library';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
const mealTimes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const WeeklyMealPlanner = () => {
  const navigation = useNavigation();

  const generateCellId = (day, time) => `${day}-${time}`;
  // Find the maximum length among the content in daysOfWeek and mealTimes
  const maxContentLength = Math.max(
    ...daysOfWeek.map(day => day.length),
    ...mealTimes.map(time => time.length)
  );

  // Calculate the dynamic width based on the maximum content length
  const cellWidth = maxContentLength * 10; // You can adjust the multiplier as needed

  // Function to handle cell press
  const handleCellPress = (day, time) => {
    // Perform actions when a cell is pressed, e.g., navigate to a form

    const cellId = generateCellId(day, time);
    const MealType=(time);
    navigation.navigate('foodEntry', { MealType, cellId });
        console.log(`Cell pressed for ${day} at ${time}`);
    // Add your navigation logic here
  };

  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        {/* Meal Times */}
        <View style={styles.row}>
          <View style={[styles.cell, styles.mealTimeCell, { width: cellWidth }]}>
            {/* Background color applied here */}
          </View>
          {daysOfWeek.map((day, index) => (
            <View key={index} style={[styles.cell, styles.weekdayCell, { width: cellWidth }]}>
              <Text>{day}</Text>
            </View>
          ))}
        </View>

        {/* Days of the Week */}
        {mealTimes.map((time, timeIndex) => (
          <View key={timeIndex} style={styles.row}>
            <TouchableOpacity
              style={[styles.cell, styles.weekdaysColumn, { width: cellWidth }]}
              disabled // Disabling touch for meal times row
            >
              <Text>{time}</Text>
            </TouchableOpacity>
            {daysOfWeek.map((day, dayIndex) => (
              <TouchableOpacity
                key={dayIndex}
                style={[styles.cell, styles.weekdayCell, { width: cellWidth }]}
                onPress={() => handleCellPress(day, time)}
              >
                {/* Your meal planning component goes here */}
                {/* You can use this cell to display and edit meals for a specific day and time */}
                {/* For simplicity, let's just display a placeholder for now */}
                <Text>Add Meal</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 16,
    marginLeft: 5,
    marginRight: 5,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
    height: 110,
    paddingHorizontal: 1,
  },
  weekdaysColumn: {
    backgroundColor: 'purple', // Background color for weekdays column
  },
  mealTimeCell: {
    backgroundColor: 'purple', // Background color for meal times row
  },
  weekdayCell: {
    backgroundColor: 'lightyellow', // Background color for individual weekday cells
  },
});

export default WeeklyMealPlanner;
