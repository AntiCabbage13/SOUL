/* Sure, I can help you with that! To make an API request from JavaScript, you can use the fetch function. Here's an example of how you can modify the cURL command you provided to work with fetch:
const findChild = async () => {
  try {
    // Use retrieveDataFromLocal to get the childObjectId
    const childObjectId = await retrieveDataFromLocal();

    if (childObjectId) {
      // Use the retrieved childObjectId to find the child data
      console.log('here is the childobjectid', childObjectId);

      // Log before calling getChildData
      console.log('About to call getChildData with childObjectId:', childObjectId);

      const childData = await getChildData(childObjectId);

      // Log after calling getChildData
      console.log('the child data object is:', childData);

      if (childData) {
        // Check if childData has the expected properties
        if ('height' in childData && 'dateOfBirth' in childData && 'currentDate' in childData && 'gender' in childData) {
          return childData;
        } else {
          console.log('LOG Unexpected child data format:', childData);
          return null;
        }
      } else {
        // Handle the case where no data is found in local storage
        console.log('LOG No child data found in getChildData.');
        return null;
      }
    } else {
      // Handle the case where no data is found in local storage
      console.log('LOG No childObjectId found.');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving child data from local storage:', error);
    return null;
  }
};


javascript
Copy code
fetch('https://api.rcpch.ac.uk/growth/v1/uk-who/calculation', {
  method: 'POST',
  headers: {
    'Origin': 'https://growth.rcpch.ac.uk/',
    'Subscription-Key': 'd2b7b0f5608540c6bc831e1d37158185',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "birth_date": "2020-04-12",
    "observation_date": "2028-06-12",
    "observation_value": 115,
    "sex": "female",
    "gestation_weeks": 40,
    "gestation_days": 0,
    "measurement_method": "weight", // change this to "weight" for weight-for-age calculation
    "bone_age": null,
    "bone_age_centile": null,
    "bone_age_sds": null,
    "bone_age_text": null,
    "bone_age_type": null,
    "events_text": null
  })
})
.then(response => response.json())
.then(data => {
  // do something with the data here
  console.log(data);
})
.catch(error => {
  console.error('Error:', error);
});
Note that I changed the measurement_method to "weight" to request weight-for-age data instead of height-for-age data. You can change this back to "height" if you want to request height-for-age data instead.

To retrieve information for calculating age for height, you can look for the age property in the response data. Here's an example of how you can extract the age from the response data:

javascript
Copy code
.then(data => {
  const age = data.age;
  console.log(`The child's age is ${age} years.`);
})
I hope this helps! Let me know if you have any further questions. */



/* Linking requires a build-time setting `scheme` in the project's
 Expo config (app.config.js or app.json) for production apps, if it
 's left blank, your app may crash. The scheme does not apply to development in the Expo client but you should add it as soon as you start working with Linking to avoid creating a broken build. Learn more: https://docs.expo.dev/guides/linking/
 LOG  Fetched data: {"birth_data": {"birth_date": "2020-06-12", 
 "estimated_date_delivery": "2020-06-12", "estimated_date_delivery
 _string": "Fri 12 June, 2020", 
 "gestation_days": 0, "gestation_
 weeks": 40, "sex": "female"}, "bone_age": {"bone_age": null
 , "bone_age_centile": null, "bone_age_sds": null, "bone_age_text"

 : null, "bone_age_type": null}, "child_observation_value": 
 {"measurement_method": "height", "observation_value": 114,
 "observation_value_error": null}, "events_data": {"events_text": 
 null}, "measurement_calculated_values": {"chronological_centile":
  0.7, "chronological_centile_band": "This height measurement is
   between the 0.4th and 2nd centiles.", "chronological_measurement
   _error": null, "chronological_percentage_median_bmi": null,
    "chronological_sds": -2.4373874626781893, "corrected_centile": 
    0.7, "corrected_centile_band": "This height measurement is 
    between the 0.4th and 2nd centiles.",
     "corrected_measurement_error": null,
      "corrected_percentage_median_bmi": null, 
      "corrected_sds": -2.4373874626781893}, "measurement_dates":
       {"chronological_calendar_age": "8 years", 
       "chronological_decimal_age": 8, 
       "chronological_decimal_age_error": null, "comments": 
       {"clinician_chronological_decimal_age_comment": "Born Term. 
       No correction has been made for gestation.",
       "clinician_corrected_decimal_age_comment": "Born at term.
       No correction has been made for gestation.",
       "lay_chronological_decimal_age_comment":
       "Your child was born on their due date.",
       "lay_corrected_decimal_age_comment": 
       "Your child was born on their due date."},
       "corrected_calendar_age": "8 years",
       "corrected_decimal_age": 8, 
       "corrected_decimal_age_error": 
       null, "corrected_gestational_age": 
       {"corrected_gestation_days": null, 
       "corrected_gestation_weeks": null},
       "observation_date": "2028-06-12"},
       "plottable_data": {"centile_data":
       {"chronological_decimal_age
       data": [Object], "corrected_decimal_age_data": [Object]}, "sds_
       data": {"chronological_decimal_age_data": [Object], "corrected_
       decimal_age_data": [Object]}}}
 */