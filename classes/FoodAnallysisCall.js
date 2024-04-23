import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Image,TouchableOpacity,StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
const APP_ID = "33e1a57f";
const APP_KEY = "5dc32e9193282abcd32ccec1592fd7a7";
const categoryToDietLabels = {
  "Severe Underweight": ["high-protein", "balanced"],
  Underweight: ["high-protein", "balanced"],
  "Normal Weight": ["balanced", "high-fiber"],
  Overweight: ["low-fat", "low-carb"],
  Obese: ["low-fat", "low-carb"],
  "Severe Short Stature": ["balanced", "high-protein"],
  "Short Stature": ["balanced", "high-protein"],
  "Normal Height": ["balanced", "high-fiber"],
  "Tall Stature": ["balanced", "high-fiber"],
  "Very Tall Stature": ["balanced", "high-fiber"],
};

export const getrecipes = async ({
  mealType,
  ageInMonths,
  allergies,
  category,
}) => {
  const dietLabels = categoryToDietLabels[category] || [];
  
  const dishTypes = [
    "biscuits-and-cookies",
    "bread",
    "cereals",
    "egg",
    "pancake",
    "pasta",
    "pastry",
    "salad",
    "sandwiches",
    "seafood",
    "soup",
  ];

  const Fields = [
    "image",
    "url",
    "ingredientLines",
    "ingredients",
    "calories",
    "totalWeight",
    "totalNutrients"
  ];

  let queryParams = {
    type: "public",
    app_id: APP_ID,
    app_key: APP_KEY,
    health: "alcohol-free",
    mealType: mealType,
    imageSize:"REGULAR",
    random: "true",
    
    
  };

  dietLabels.forEach((label, index) => {
    queryParams[`diet%5B${index}%5D`] = label.toLowerCase();
  });

  dishTypes.forEach((dishType, index) => {
    queryParams[`dishType%5B${index}%5D`] = dishType.toLowerCase().replace(/\s+/g, '-');
  });

  Fields.forEach((field, index) => {
    queryParams[`field%5B${index}%5D`] = field;
  });

  if (allergies && allergies.length > 0) {
    queryParams.excluded = allergies.join(",");
  }

  try {
    const response = await axios.get("https://api.edamam.com/api/recipes/v2", {
      params: queryParams,
    });

    if (response.status === 200) {
      console.log(response.data);
      return response.data.hits;
    } else {
      console.log("Error:", response.status);
    }
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};





export const FoodAnalysisCall = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  useEffect(() => {
    console.log("Recipes:", recipes); 
  }, [recipes]);


  useEffect(() => {
    const fetchStorageData = async () => {
      const heightCategoryDataStr = await AsyncStorage.getItem('heightCategoryData');
      const weightCategoryDataStr = await AsyncStorage.getItem('weightCategoryData');

      const heightCategoryData = JSON.parse(heightCategoryDataStr);
      const weightCategoryData = JSON.parse(weightCategoryDataStr);
      const fetchRecipes = async () => {
        if (heightCategoryData) {
          const heightRecipes = await getrecipes({
            mealType: heightCategoryData.mealType,
            ageInMonths: heightCategoryData.ageInMonths,
            allergies: heightCategoryData.allergies,
            category: heightCategoryData.category,
          });
          setRecipes(prevRecipes => [...prevRecipes, ...heightRecipes]);
        }

        if (weightCategoryData) {
          const weightRecipes = await getrecipes({
            mealType: weightCategoryData.mealType,
            ageInMonths: weightCategoryData.ageInMonths,
            allergies: weightCategoryData.allergies,
            category: weightCategoryData.category,
          });
          setRecipes(prevRecipes => [...prevRecipes, ...weightRecipes]);
        }

        setLoading(false);
      };

      fetchRecipes();
    };

    fetchStorageData();
  }, []);

  useEffect(() => {
    console.log("Recipes length:", recipes.length);
  }, [recipes]);

  if (loading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={styles.loadingText}>Collecting recipes...</Text>
      </View>
    );
  }

  if (recipes.length === 0) {
    return (
      <View style={styles.centeredView}>
        <Text>No recipes found.</Text>
      </View>
    );
  }

  const displayedRecipes = recipes.slice(0, 30);


  return (
    <ScrollView style={{ flex: 1 }}>
      {displayedRecipes.map((hit, index) => (
        <View key={index} style={styles.recipeWrapper}>
          <TouchableOpacity 
            style={styles.recipeContainer}
            onPress={() => {
              if (expandedRecipe === index) {
                setExpandedRecipe(null);
              } else {
                setExpandedRecipe(index);
              }
            }}
          >
            <Image
              source={{ uri: hit.recipe.image }}
              style={styles.recipeImage}
            />
            <Text style={styles.recipeText}>{hit.recipe.label}</Text>
            
            {/* Display ingredients */}
            <Text style={styles.additionalInfo}>Calories: {Math.round(hit.recipe.calories)}</Text>
            <Text style={styles.additionalInfo}>Total Weight: {Math.round(hit.recipe.totalWeight)}</Text>
            
            {expandedRecipe === index && (
              <Text style={styles.additionalInfo}>Ingredient: 
                {hit.recipe.ingredientLines ? hit.recipe.ingredientLines.join('\n') : 'N/A'}
              </Text>
            )}
          </TouchableOpacity>
          
          {/* Read more/Read less toggle */}
          {hit.recipe.ingredientLines && hit.recipe.ingredientLines.length > 1 && (
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => {
                if (expandedRecipe === index) {
                  setExpandedRecipe(null);
                } else {
                  setExpandedRecipe(index);
                }
              }}
            >
              <Text style={styles.toggleButtonText}>
                {expandedRecipe === index ? 'Read less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
  },
  recipeWrapper: {
    borderWidth: 3,
    borderColor: "#003300",
    borderStyle: "dotted",
    borderRadius: 10,
    marginBottom: 10,
  },
  recipeContainer: {
    alignItems: "center",
  },
  recipeImage: {
    width: 200,
    height: 200,
    marginBottom: 5,
  },
  recipeText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  additionalInfo: {
    marginBottom: 3,
  },
  toggleButton: {
    backgroundColor: "green",
    padding: 10,
    margin:5,
    alignItems: "center",
    borderRadius: 10,
  },
  toggleButtonText: {
    color: "#003300",
    fontWeight: "bold",
  },
});



