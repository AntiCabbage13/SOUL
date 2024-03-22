import DatabaseHelperheight from '../reusableComp/DatabaseHelperheight';

const getChildData = async (childData) => {
  try {
    console.log("Child Data:", childData); // Log the childData object

    if (!childData) {
      console.log("No child data found.");
      return null;
    }

    const { height, childDateOfBirthh, childGender, objectId } = childData;
    const dateOfBirth = new Date(childDateOfBirthh); // Convert childDateOfBirthh to Date object
    const currentDate = new Date(); // Generate the current date

    // Construct the request payload
    const measurementRequest = {
      birth_date: dateOfBirth.toISOString().slice(0, 10), // Use dateOfBirth instead of childDateOfBirthh
      observation_date: currentDate.toISOString().slice(0, 10), // Use currentDate for observation date
      observation_value: height,
      sex: childGender,
      measurement_method: "height",
    };
    console.log("Measurement Request:", measurementRequest);

    try {
      const response = await fetch(
        "https://api.rcpch.ac.uk/growth/v1/uk-who/calculation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Subscription-Key": "d2b7b0f5608540c6bc831e1d37158185", // Replace with your actual API key
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
      const height = responseData.child_observation_value.observation_value;
      const age = responseData.measurement_dates.corrected_calendar_age;
      const chronological_sds = responseData.measurement_calculated_values.chronological_sds;

      // Extract years and days as numbers
      const matches = age.match(/(\d+) year(?:s)? and (\d+) day(?:s)?/);
      const years = matches ? parseInt(matches[1], 10) : 0;
      const days = matches ? parseInt(matches[2], 10) : 0;

      // Convert age to months
      const ageInMonths = Math.floor((years * 365.25 + days) / 30.44);
      console.log("Calculated ageInMonths:", ageInMonths);

      try {
        await DatabaseHelperheight.insertData(
          height,
          ageInMonths,
          objectId,
          chronological_sds
        );
        console.log('Insert successful!');
      } catch (error) {
        console.error('Insert failed:', error);
      }

      // Log the fetched data
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

export { getChildData };
