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
function calculateAgeInMonths(birthDate, currentDate) {
  const birth = new Date(birthDate);
  const current = new Date(currentDate);

  const ageInMilliseconds = current - birth;
  const ageInMonths = ageInMilliseconds / (1000 * 60 * 60 * 24 * 30.44); // Approximate number of days in a month
console.log("LOG ageInMonths:", ageInMonths);
  return Math.floor(ageInMonths);
}
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

    // Calculate age in months
    const ageInMonths = calculateAgeInMonths(dateOfBirth, currentDate);

    // Determine the reference data to use based on gender
    const referenceData = apiGender === 'male' 
    ? require("../ReferenceData/boysweightmonhts.json")
    : require("../ReferenceData/weightmothsgirls.json");

    // Filter the reference data to only include rows where "Month" matches ageInMonths
    const filteredData = referenceData.filter(item => parseInt(item.Month) === ageInMonths);

    // Check if we have the necessary data
    if (filteredData.length === 0) {
      console.log("No reference data found for the given age.");
      return null;
    }

    // Extract necessary data for z-score calculation
    const { M,S,L,Month } = filteredData[0]; 
    // Calculate z-score using the standard formula
   // const zScore = (weight - M) /(S * L);
    const zScore =   ((Math.pow((weight/M), L)) - 1) / (L * S);
    console.log('weight',weight);
    console.log('returned month',Month)
    console.log("S,",S );
    console.log("L,",L );
    console.log('M',M);
    console.log("Calculated z-score --:", zScore);

    // Insert z-score into the database
    try {
      await DatabaseHelper.insertData(
        weight,
        ageInMonths,
        childData.childObjectId,
        zScore
      );
      console.log('Insert successful!');
    } catch (error) {
      console.error('Insert failed:', error);
    }

    // Return the calculated z-score for further processing
    return zScore;
  } catch (error) {
    console.error("Error retrieving and calculating z-score:", error);
    return null;
  }
}




export { getWeightForAgeReferenceDataFromAPI };
