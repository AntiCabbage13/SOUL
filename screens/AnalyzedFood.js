import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { fetchAllMeals } from "../reusableComp/retrivemeals";

const AnalyzedFood = () => {
  const [organizedData, setOrganizedData] = useState([]);
  const [analysisResults, setAnalysisResults] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchMealsAndAnalyzeIngredients = async () => {
      try {
        const meals = await fetchAllMeals();
        console.log("Fetched meals:", meals);

        const organizedMeals = meals.map((meal) => {
          const ingredients = meal.ingredients
            ? meal.ingredients
                .split(",")
                .map((ingredient) => `${ingredient.trim()}`)
            : [];
          return {
            name: meal.name,
            ingredients,
          };
        });
        console.log("Organized meals:", organizedMeals);

        // Filter out meals with empty ingredients
        const mealsWithIngredients = organizedMeals.filter(
          (meal) => meal.ingredients.length > 0
        );
        console.log("Meals with ingredients:", mealsWithIngredients);

        const promises = mealsWithIngredients.map(async (meal) => {
          const analyzedIngredients = await analyzeIngredients(
            meal.ingredients
          );
          return { [meal.name]: analyzedIngredients };
        });

        const results = await Promise.all(promises);
        const analysisMap = results.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        console.log("Analysis results:", analysisMap);
        setAnalysisResults(analysisMap);

        // Update organized data with analyzed ingredients
        const updatedOrganizedMeals = organizedMeals.map((meal) => ({
          ...meal,
          analysis: analysisMap[meal.name] || null,
        }));
        console.log("Updated organized meals:", updatedOrganizedMeals);
        setOrganizedData(updatedOrganizedMeals);
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error("Error fetching meals:", error);
        setLoading(false); // Set loading to false if there's an error
      }
    };

    fetchMealsAndAnalyzeIngredients();
  }, []);

  const analyzeIngredients = async (ingredients, time = "lunch") => {
    // Ensure ingredients is an array before mapping
    const ingrArray = Array.isArray(ingredients) ? ingredients : [];

    console.log("Analyzing ingredients:", ingrArray);

    const response = await fetch(
      "https://api.edamam.com/api/nutrition-details?app_id=303bd636&app_key=eaa58be7c0a6a6ed734358ba724a1a6d",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          title: "Analyze",
          ingr: ingrArray.map((ingredient) => `1 ${ingredient}`),
          yield: "1",
          time, // Add time parameter
          img: "small", // Add img parameter
        }),
      }
    );

    console.log("Request:", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        title: "Analyze",
        ingr: ingrArray.map((ingredient) => `1 ${ingredient}`),
        yield: "4",
        time, // Add time parameter
        img: "small", // Add img parameter
      }),
    });

    const data = await response.json();
    console.log("Response:", data);

    // Extract essential information from the response
    const essentialInfo = {
      calories: data.calories,
      totalNutrients: data.totalNutrients,
      totalWeight: data.totalWeight,
      dietLabels: data.dietLabels,
      healthLabels: data.healthLabels,
    };

    return essentialInfo;
  };

  return (
    <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* Render loader if loading */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Text>Fetching meals...</Text>
            {/* Render the organized data */}
            {organizedData.map(
              (meal, index) =>
                index % 2 !== 0 && (
                  <View
                    key={index}
                    style={{
                      marginBottom: 20,
                      padding: 10,
                      borderWidth: 1,
                      borderColor: "black",
                      borderRadius: 10,
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Text style={{ color: "green" }}>Name: {meal.name}</Text>
                    <Text style={{ color: "green" }}>
                      Ingredients: {meal.ingredients.join(", ")}
                    </Text>
                    <Text style={{ color: "green" }}>Analysis:</Text>
                    <View
                      style={{
                        backgroundColor: "#f2f2f2",
                        padding: 10,
                        borderRadius: 5,
                      }}
                    >
                      <Text>Calories: {meal.analysis.calories}</Text>
                      <Text>
                        Fat: {meal.analysis.totalNutrients.FAT.quantity}{" "}
                        {meal.analysis.totalNutrients.FAT.unit}
                      </Text>
                      <Text>
                        Protein:{" "}
                        {meal.analysis.totalNutrients.PROCNT.quantity}{" "}
                        {meal.analysis.totalNutrients.PROCNT.unit}
                      </Text>
                      <Text>Total Weight: {meal.analysis.totalWeight}</Text>

                      {/* Render more nutrients as needed */}

                      <Text>
                        Diet Labels: {meal.analysis.dietLabels.join(", ")}
                      </Text>
                    </View>
                  </View>
                )
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default AnalyzedFood;
