import Parse from "parse/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatabaseHelperheight from "../reusableComp/DatabaseHelperheight";

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
    const childObjectId = await retrieveDataFromLocal();

    if (childObjectId) {
      const ChildData = Parse.Object.extend("ChildData");
      const childQuery = new Parse.Query(ChildData);

      const childData = await childQuery.get(childObjectId);

      if (childData) {
        const gender = childData.get("gender");

        const AddMeasure = Parse.Object.extend("addmeasure");
        const measureQuery = new Parse.Query(AddMeasure);

        measureQuery.equalTo("child", {
          __type: "Pointer",
          className: "ChildData",
          objectId: childObjectId,
        });

        measureQuery.descending("createdAt");
        measureQuery.limit(1);

        const measureData = await measureQuery.first();

        if (measureData) {
          return {
            height: measureData.get("height"),
            dateOfBirth: new Date(measureData.get("Dob"))
              .toISOString()
              .slice(0, 10),
            currentDate: new Date(measureData.get("DateToday"))
              .toISOString()
              .slice(0, 10),
            gender: gender,
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
    const childData = await getChildData();

    if (!childData) {
      console.log("No child data found.");
      return null;
    }

    const { height, dateOfBirth, currentDate, gender } = childData;

    const ageInMonths = calculateAgeInMonths(dateOfBirth, currentDate);
    const apiGender = gender === 'boy' ? 'male' : 'female';

    let referenceData;

    if (apiGender === 'male') {
      referenceData = ageInMonths <= 24 
        ? require('../ReferenceData/0-2yrboysheight.json')
        : require('../ReferenceData/2-5yrheigtforboys.json');
    } else {
      referenceData = ageInMonths <= 24 
        ? require('../ReferenceData/0-2yrheightgirls.json')
        : require('../ReferenceData/2-5yrsheightgirls.json');
    }

    // Filter the reference data to only include rows where "Month" matches ageInMonths
    const filteredData = referenceData.filter(item => parseInt(item.Month) === ageInMonths);

    // Check if we have the necessary data
    if (filteredData.length === 0) {
      console.log("No reference data found for the given age.");
      return null;
    }

    const { M,L,S,SD } = filteredData[0]; 

   // const zScore = (height - parseFloat(M)) / parseFloat(SD);
   // const zScore = ((Math.pow((height/M), L)) - 1) / (L * S);
    //const  zScore=
    const zScore = (height- M) / SD;
    // Log the calculated z-score
    console.log("Height:", height);
    console.log("Age in months:", ageInMonths);
    console.log('m',M);
    console.log('SD',SD);
    console.log("Calculated z-score:", zScore);

    // Insert z-score into the database
    try {
      await DatabaseHelperheight.insertData(
        height,
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

// Function to calculate age in months
function calculateAgeInMonths(birthDate, currentDate) {
  const birth = new Date(birthDate);
  const current = new Date(currentDate);

  const ageInMilliseconds = current - birth;
  const ageInMonths = ageInMilliseconds / (1000 * 60 * 60 * 24 * 30.44); // Approximate number of days in a month

  return Math.floor(ageInMonths);
}

export { getHeightForAgeReferenceDataFromAPI };
