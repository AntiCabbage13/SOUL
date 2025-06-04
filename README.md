# CDMS

CDMS is a React Native mobile application designed for child health monitoring and management. The app provides features for tracking child growth, managing health data, interacting with healthcare professionals, and engaging with a community for support and information.

## Features

- User registration and login
- Child data entry including measurements and health information
- Growth charts and nutritional analysis
- Questionnaires and surveys for health tracking
- Chat and messaging functionality for community and healthcare professionals
- Notifications and reminders for meals and health activities
- Healthcare professional dashboard for managing patients
- Meal suggestions and food allergy management
- Article upload and display for health education

## Technologies Used

- React Native with Expo
- React Navigation for app navigation
- Firebase for backend services
- Parse Server integration
- AsyncStorage for local data storage
- Various UI libraries including NativeBase and React Native Paper
- Charting libraries such as react-native-chart-kit, victory-native, and recharts
- Expo modules for camera, notifications, media library, and more

## Installation

1. Ensure you have Node.js and npm installed.
2. Install Expo CLI globally if not already installed:
   ```
   npm install -g expo-cli
   ```
3. Clone the repository:
   ```
   git clone <repository-url>
   ```
4. Navigate to the project directory:
   ```
   cd SOUL
   ```
5. Install dependencies:
   ```
   npm install
   ```
6. Start the Expo development server:
   ```
   npm start
   ```
7. Use the Expo app on your Android or iOS device to scan the QR code and run the app, or run on an emulator/simulator.

## Folder Structure

- `screens/` - React Native screen components for different app views
- `classes/` - Business logic and utility classes
- `reusableComp/` - Reusable components and helper modules
- `assets/` - Images, icons, and other static assets
- `ReferenceData/` - JSON data files for growth standards and reference data
- `App.js` - Main app entry point and navigation setup
- `firebase.js` and `firebaseConfig.js` - Firebase configuration and initialization

## Usage

The app allows users to register and log in, add and manage child health data, view growth charts, complete health questionnaires, and communicate with healthcare professionals and community members. Healthcare professionals have dedicated screens for managing patient data and messages.

## License

This project does not specify a license.
