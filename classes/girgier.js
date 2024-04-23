import { useNavigation } from "@react-navigation/native";
import Parse from "parse/react-native";
import DatabaseHelper from "../reusableComp/DatabaseHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
Parse.initialize(
  "VXLSRSLFzlwWVZnGLbF57Cm9JgBU1nilXN76HYFA",
  "RAzzzAhMZpT8AwpJIHhLubChsR8m7yMvJ1SPvzjW"
);
Parse.serverURL = "https://parseapi.back4app.com/";

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
            weight: measureData.get("weight"),
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

// Function to retrieve weight-for-age reference data from the API
async function getWeightForAgeReferenceDataFromAPI() {
  // Function to retrieve weight-for-age reference data from the API
  try {
    // Call getChildData and wait for the result
    const childData = await getChildData();

    if (!childData) {
      console.log("No child data found.");
      return null;
    }

    const { weight, dateOfBirth, currentDate, gender } = childData;

    // Convert 'boy' or 'girl' to 'male' or 'female'
    const apiGender = gender === 'boy' ? 'male' : 'female';

    const measurementRequest = {
      birth_date: dateOfBirth, // Convert to ISO string
      observation_date: currentDate, // Convert to ISO string
      observation_value: weight,
      sex: apiGender,  // Use the converted gender value
      measurement_method: "weight", // Assuming this should be 'weight' based on the context
    };
    console.log("Measurement Request:", measurementRequest);
    console.log("Request Body:", JSON.stringify(measurementRequest));
    try {
      const response = await fetch(
        "https://api.rcpch.ac.uk/growth/v1/uk-who/calculation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Subscription-Key": "991c9100be9d44f69dbee33875b63819", 
            'Origin': 'https://growth.rcpch.ac.uk/',
          },
          body: JSON.stringify(measurementRequest),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch reference data. Status: ${response.status}`
        );
      }

      const responseData = await response.json();
      const weight = responseData.child_observation_value.observation_value;
      const age = responseData.measurement_dates.corrected_calendar_age;
      const chronological_sds = responseData.measurement_calculated_values.chronological_sds;

      console.log("Extracted weight:", weight);
      console.log("Extracted age:", age);
      console.log("Extracted chronological_sds:", chronological_sds);

      const matches = age.match(/(\d+) year(?:s)? and (\d+) day(?:s)?/);
      const years = matches ? parseInt(matches[1], 10) : 0;
      const days = matches ? parseInt(matches[2], 10) : 0;

      const ageInMonths = Math.floor((years * 365.25 + days) / 30.44);
      console.log("Calculated ageInMonths:", ageInMonths);
     
      try {
        await DatabaseHelper.insertData(
          weight,
          ageInMonths,
          childData.childObjectId,
          chronological_sds
        );
        console.log('Insert successful!');
      } catch (error) {
        console.error('Insert failed:', error);
      }
      

      console.log("Fetched data:", responseData);
      console.log("z score:", chronological_sds);

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

export { getWeightForAgeReferenceDataFromAPI };
