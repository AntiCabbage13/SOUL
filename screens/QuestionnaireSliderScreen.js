import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import fetchQuestionnaires from "../screens/fetchQuestionnaires";

const QuestionnaireSliderScreen = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchQuestionnairesData = async () => {
      try {
        const data = await fetchQuestionnaires();
        setQuestionnaires(data);
      } catch (error) {
        console.error("Error fetching questionnaires:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionnairesData();
  }, []);

  const handleResponse = (response) => {
    setUserResponses((prevResponses) => ({
      ...prevResponses,
      [currentIndex]: response,
    }));
    if (currentIndex < questionnaires.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>
          Press "Yes" if you observe any sign in your child in the picture
          below. Press "No" if not.
        </Text>
      </View>
      {!showResult ? (
        <View style={styles.questionnaire}>
          <Text style={styles.headTitle}>
            {questionnaires[currentIndex]?.title}
          </Text>

          <Image
            source={{ uri: questionnaires[currentIndex]?.images[0] }}
            style={styles.image}
          />
          <View style={styles.options}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleResponse("Yes")}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleResponse("No")}
            >
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
          {currentIndex > 0 && (
            <TouchableOpacity style={styles.button} onPress={handlePrevious}>
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {Object.values(userResponses).some((response) => response === "Yes")
              ? "Please consult healthcare professionals."
              : "Everything looks good!"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headTitle: {
    marginTop: 30,
    fontSize: 23,
    fontWeight: "bolder",
    fontFamily: "sans-serif",
    color:'green',
  },
  resultContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headingContainer: {
    marginBottom: 50,
  },
  headingText: {
    fontSize: 18,
    textAlign: "center",
    margin: 30,
    fontWeight: "bold",
    fontFamily: "sans-serif",
  },
  button: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "green",
    borderStyle: "dotted",
    margin: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  questionnaire: {
    flex: 0.5, // Reduce the size of the questionnaire container
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  options: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "green",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    fontSize: 20,
    textAlign: "center",
  },
});

export default QuestionnaireSliderScreen;
