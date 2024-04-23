import DatabaseHelperheight from "../reusableComp/DatabaseHelperheight";
import DatabaseHelper from "../reusableComp/DatabaseHelper"
import AllergyDatabaseHelper from "../reusableComp/AllergyDatabaseHelper";
import { MealTypeContext } from "../AppContext";
import { insertcategories, getLastTwoInsertedRows } from "./categoryhandler";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Nutrientanalysis = async (data) => {
  console.log("Nutrient Analysis Data:", data);

  const { heightCategory, weightCategory } = data;
  console.log(
    `Calculating nutrient requirements for Height: ${heightCategory}, Weight: ${weightCategory}`
  );

  try {
    if (heightCategory) {
      await insertcategories({
        categoryIdentifier: "heightCategory",
        category: heightCategory,
      });
    }

    if (weightCategory) {
      await insertcategories({
        categoryIdentifier: "weightCategory",
        category: weightCategory,
      });
    }

    console.log("Categories inserted successfully.");

  } catch (error) {
    console.error("Error inserting categories:", error);
  }
};

export const setmealtype = async (mealType) => {
  console.log("Setting meal type:", mealType);

  try {
    const ageInMonths = await DatabaseHelperheight.getLastInsertedRowAgeInMonths();
    console.log(`Age in months of the last inserted row: ${ageInMonths}`);

    const allergies = AllergyDatabaseHelper && typeof AllergyDatabaseHelper.getAllAllergies === 'function'
      ? await AllergyDatabaseHelper.getAllAllergies()
      : null;
    console.log("Allergies:", allergies);

    const lastTwoRows = await getLastTwoInsertedRows();
    console.log("Last two inserted rows from categories:", lastTwoRows);

    let weightCategoryData = {};
    let heightCategoryData = {};

    lastTwoRows.forEach((row) => {
      if (row.categoryIdentifier === 'weightCategory') {
        weightCategoryData = {
          category: row.category,
          ageInMonths,
          mealType,
          allergies,
        };
      }

      if (row.categoryIdentifier === 'heightCategory') {
        heightCategoryData = {
          category: row.category,
          ageInMonths,
          mealType,
          allergies,
        };
      }
    });

    console.log("Weight Category Data:", weightCategoryData);
    console.log("Height Category Data:", heightCategoryData);

    await AsyncStorage.setItem('weightCategoryData', JSON.stringify(weightCategoryData));
    await AsyncStorage.setItem('heightCategoryData', JSON.stringify(heightCategoryData));

    console.log("Data stored in AsyncStorage successfully.");

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
