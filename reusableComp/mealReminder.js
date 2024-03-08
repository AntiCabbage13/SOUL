import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { fetchTimeAndMealNameForCellById, fetchAllMealIds } from './retrivemeals'; // Adjust the path as needed

const setupNotifications = async () => {
  try {
    console.log('Setting up notification handler...');
    // Set up the notification handler
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        // Handle incoming notifications
        console.log('Received notification:', notification);

        // Add a console log statement when the notification is received
        console.log(`Notification for ${notification.content.title} received at ${new Date().toLocaleTimeString()}`);


        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        };
      },
    });

    // Fetch all meal IDs from the database
    const allMealIds = await fetchAllMealIds();
    console.log('All Meal IDs:', allMealIds);

    console.log('Requesting permissions...');
    // Request permission to receive push notifications
    const { status } = await Notifications.requestPermissionsAsync();
    console.log('Notification permission status:', status);

    if (status !== 'granted') {
      console.log('Permission to receive notifications denied. You will not receive notification reminders.');
    } else {
      console.log('Permission to receive notifications granted. Setting up notifications...');
      console.log('Setting up notifications for each meal...');
      // Set up scheduling options for each meal
      for (const id of allMealIds) {
        console.log(`Processing meal ID: ${id}`);
        const { time, name } = await fetchTimeAndMealNameForCellById(id);

        // Log the retrieved values
        console.log(`Retrieved data for ID ${id}:`, { time, name });

        // Parse the time to get the hour and minute
        const [hour, minute, second] = time.split(/:| /).map(Number);

        // Convert AM/PM to 24-hour format
        let convertedHour = hour;
        if (time.includes('PM') && hour !== 12) {
          convertedHour += 12;
        } else if (time.includes('AM') && hour === 12) {
          convertedHour = 0;
        }

        const currentTime = new Date();
        console.log('Current Time:', currentTime.toLocaleTimeString());

        const schedulingOptions = {
          content: {
            title: 'Meal Reminder',
            body: `It's time for your ${name} meal!`, // Use the retrieved name
           // sound: Platform.OS === 'android' ? 'default' : 'default', 
            sound: Platform.OS === "android" ? null : "default",
          },
          trigger: {
            hour: convertedHour,
            minute,
            repeats: true,
          },
        };
        console.log('Scheduling Options:', schedulingOptions);

        // Schedule the notification
        const schedulingResult = await Notifications.scheduleNotificationAsync(schedulingOptions);// i think  this is where the error start occuring coz the upper side is providing all it's processed info through the console 

        // Log after scheduling
        console.log('Notification scheduled for ID', id, 'Scheduling result:', schedulingResult);
      }
    }
  } catch (error) {
    console.error('Error in setupNotifications:', error);// another excution happens here 
  }
};

export default setupNotifications;
