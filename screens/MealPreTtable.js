import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { initDatabase, fetchMealForCell } from '../reusableComp/retrivemeals.js';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
const mealTimes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const WeeklyMealPlanner = () => {
  const navigation = useNavigation();
  const [mealData, setMealData] = useState({});

  const generateCellId = (day, time) => `${day}-${time}`;

  useEffect(() => {
    initDatabase(); 
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Fetch meal data for each cell when the screen is focused
      const fetchData = async () => {
        const mealData = {};
        for (const day of daysOfWeek) {
          for (const time of mealTimes) {
            const cellId = generateCellId(day, time);
            const meal = await fetchMealForCell(cellId);

            mealData[cellId] = meal;
          }
        }
        setMealData(mealData);
      };

      fetchData(); // Initial fetch when the screen is mounted

      return () => {
        // Clean up any subscriptions or timers when the component is unmounted
      };
    }, [])
  );

  const handleCellPress = (day, time) => {
    const cellId = generateCellId(day, time);
    const MealType = time;
    const hasMeal = mealData[cellId] !== undefined && mealData[cellId] !== null;
    navigation.navigate('foodEntry', { MealType, cellId, hasMeal });
    console.log('has meal =',hasMeal)
    console.log(`Cell pressed for ${day} at ${time}`);
    // Add your navigation logic here
  };

  const handleUpdateMeal = (day, time) => {
    const cellId = generateCellId(day, time);
    const MealType = time;
    navigation.navigate('foodEntry', { MealType, cellId, isUpdate: true });
    console.log(`Update meal for ${day} at ${time}`);
    // Add your navigation logic here
  };
 

  const cellWidth = 100; // Adjust the width as needed

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
                onLongPress={() => handleUpdateMeal(day, time)} // Long press for update
              >
                {/* Display meal name if available, otherwise show "Add Meal" */}
                <Text>{mealData[generateCellId(day, time)]?.name || 'Add Meal'}</Text>
                
                <Text>{mealData[generateCellId(day, time)]?.time || ''}</Text>
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
    height: 90,
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
