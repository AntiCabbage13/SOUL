import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView } from 'react-native';
import { firebaseApp } from "../firebaseConfig";

const fetchQuestionnaire = async () => {
  const snapshot = await firebaseApp.firestore().collection('questionnaires').get();
  const questionnaires = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    questionnaires.push({
      id: doc.id,
      title: data.title,
      images: data.images,
    });
  });

  return questionnaires;
};

const QuestionnaireListScreen = () => {
  const [questionnaires, setQuestionnaires] = useState([]);

  useEffect(() => {
    const loadQuestionnaires = async () => {
      const data = await fetchQuestionnaire();
      setQuestionnaires(data);
    };

    loadQuestionnaires();
  }, []);

  const handleAnswer = (questionnaireId, answer) => {
    // Handle the answer (e.g., update Firestore)
  };

  return (
    <ScrollView style={styles.container}>
      {questionnaires.map((questionnaire) => (
        <View key={questionnaire.id} style={styles.questionnaireContainer}>
          <Text style={styles.title}>{questionnaire.title}</Text>
          <View style={styles.imageContainer}>
            {questionnaire.images.map((imageUrl, index) => (
              <View key={index} style={styles.imageItem}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
                <View style={styles.buttonContainer}>
                  <Button title="Yes" onPress={() => handleAnswer(questionnaire.id, 'Yes')} />
                  <Button title="No" onPress={() => handleAnswer(questionnaire.id, 'No')} />
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  questionnaireContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageItem: {
    marginRight: 10,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
});

export default QuestionnaireListScreen;
