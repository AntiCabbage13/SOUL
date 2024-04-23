import Parse from 'parse/react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
Parse.initialize('VXLSRSLFzlwWVZnGLbF57Cm9JgBU1nilXN76HYFA', 'RAzzzAhMZpT8AwpJIHhLubChsR8m7yMvJ1SPvzjW');
Parse.serverURL = 'https://parseapi.back4app.com/';
import DatabaseHelperheight from '../reusableComp/DatabaseHelperheight';

const retrieveDataFromLocal = async () => {
  try {
    const storedData = await AsyncStorage.getItem("childDatainfo");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log(
        "LOG Retrieved data from local storage by retrieveDataFromLocal:",
        parsedData
      );

      // Return only the childObjectId
      return parsedData.childObjectId;
    } else {
      console.log("LOG No data found in local storage");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving data from local storage:", error);
    return null;
  }
};

const getChildData = async () => {
  try {
    // Call findChild to get the childObjectId
    const childObjectId = await retrieveDataFromLocal();

    if (childObjectId) {
      // Now you have the childObjectId, proceed with the rest of the logic
      const ChildData = Parse.Object.extend("ChildData");
      const childQuery = new Parse.Query(ChildData);

      // Use the childObjectId to find the child data in ChildData
      const childData = await childQuery.get(childObjectId);

      if (childData) {
        // Retrieve gender from ChildData
        const gender = childData.get("gender");

        // Now, query addmeasure based on the retrieved childObjectId
        const AddMeasure = Parse.Object.extend("addmeasure");
        const measureQuery = new Parse.Query(AddMeasure);

        // Query where childObjectId matches the child field in addmeasure
        measureQuery.equalTo("child", {
          __type: "Pointer",
          className: "ChildData",
          objectId: childObjectId,
        });

        // Sort the results by descending order based on the 'createdAt' field
        measureQuery.descending("createdAt");

        // Limit the query to retrieve only the first result (last inserted row)
        measureQuery.limit(1);

        // Use the childObjectId to find the child data in addmeasure
        const measureData = await measureQuery.first();

        if (measureData) {
          // Extract and return relevant information
          return {
            height: measureData.get("height"),
            dateOfBirth: new Date(measureData.get("Dob"))
              .toISOString()
              .slice(0, 10),
            currentDate: new Date(measureData.get("DateToday"))
              .toISOString()
              .slice(0, 10),
            gender: gender, // Use the retrieved gender
            // Add other properties as needed
            childObjectId: childObjectId,
          };
        } else {
          console.log("No matching child data found in addmeasure.");
          return null;
        }
      } else {
        console.log("No matching child data found in ChildData.");
        return null;
      }
    } else {
      // Handle the case where no childObjectId is found
      console.log("No childObjectId found.");
      return null;
    }
  } catch (error) {
    console.error("Error finding child data:", error);
    return null;
  }
};



async function getHeightForAgeReferenceDataFromAPI() {
  try {
    // Call getChildData and wait for the result
    const childData = await getChildData();

    if (!childData) {
      console.log("No child data found.");
      return null;
    }

    const { height, dateOfBirth, currentDate, gender } = childData;

    // Convert dateOfBirth and currentDate to Date objects if they are not
    const birthDateObj = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    const currentDateObj = typeof currentDate === 'string' ? new Date(currentDate) : currentDate;

    // Format dates as simple strings
    const formattedBirthDate = birthDateObj.toISOString().split('T')[0];
    const formattedCurrentDate = currentDateObj.toISOString().split('T')[0];

    // Construct the request payload
    const measurementRequest = {
      birth_date: formattedBirthDate, // Format as "YYYY-MM-DD"
      observation_date: formattedCurrentDate, // Format as "YYYY-MM-DD"
      observation_value: height,
      sex: gender,
      measurement_method: "height", // Assuming this should be 'height' based on the context
    };
    console.log("Measurement Request:", measurementRequest);

    // Log request headers
    console.log("Request Headers:", {
      'Content-Type': 'application/json',
      'Subscription-Key': '18aaa6b84c5a4077999b1063a8bdc685',
      'Origin': 'https://growth.rcpch.ac.uk/'
    });

    try {
      const response = await fetch(
        "https://api.rcpch.ac.uk/growth/v1/uk-who/calculation",
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Subscription-Key': 'ffcef07c8f924c0ebccc1ce0fe6a85fd',
            'Origin': 'https://growth.rcpch.ac.uk/'
          },
          body: JSON.stringify(measurementRequest),
        }
      );

      // Log response status
      console.log("Response Status:", response.status);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch reference data. Status: ${response.status}`
        );
      }

      const responseData = await response.json();
      console.log("Received JSON response data:", responseData);

      const { child_observation_value, measurement_dates, measurement_calculated_values } = responseData;
      const heightValue = child_observation_value?.observation_value;
      const age = measurement_dates?.corrected_calendar_age;
      const chronological_sds = measurement_calculated_values?.chronological_sds;

      console.log("Extracted height:", heightValue);
      console.log("Extracted age:", age);
      console.log("Extracted chronological_sds:", chronological_sds);

      // Extract years and days as numbers
      const matches = age?.match(/(\d+) year(?:s)? and (\d+) day(?:s)?/);
      const years = matches ? parseInt(matches[1], 10) : 0;
      const days = matches ? parseInt(matches[2], 10) : 0;

      // Convert age to months
      const ageInMonths = Math.floor((years * 365.25 + days) / 30.44);
      console.log("Calculated ageInMonths:", ageInMonths);

      try {
        await DatabaseHelperheight.insertData(
          heightValue,
          ageInMonths,
          childData.childObjectId,
          chronological_sds
        );
        console.log('Insert successful!');
      } catch (error) {
        console.error('Insert failed:', error);
      }

      return responseData;
    } catch (error) {
      console.error("Error fetching reference data:", error);
      return null;
    }
  } catch (error) {
    console.error("Error retrieving child data:", error);
    return null;
  }
}




// Usage
//getHeightForAgeReferenceDataFromAPI();

export { getHeightForAgeReferenceDataFromAPI };
