export const FoodAnalysisCall = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  useEffect(() => {
    console.log("Recipes:", recipes); 
  }, [recipes]);

  // ... (rest of your useEffects remain unchanged)

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
            <Text style={styles.additionalInfo}>Total Nutrients: {Math.round(hit.recipe.totalNutrients)}</Text>
            
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
    borderWidth: 2,
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
    backgroundColor: "#e0e0e0",
    padding: 10,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#003300",
    fontWeight: "bold",
  },
});
