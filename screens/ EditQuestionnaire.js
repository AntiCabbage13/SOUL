import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { firebaseApp } from "../firebaseConfig";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";

const db = getFirestore(firebaseApp);

const EditQuestionnaire = () => {
  const [loading, setLoading] = useState(true);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "questionnaires"));
        const fetchedQuestionnaires = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedQuestionnaires.push({
            id: doc.id,
            title: data.title,
            images: data.images,
          });
        });
        setQuestionnaires(fetchedQuestionnaires);
      } catch (error) {
        console.error('Error fetching questionnaires: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaires();
  }, []);

  const handleDelete = async () => {
    if (selectedQuestionnaire) {
      try {
        await deleteDoc(doc(db, 'questionnaires', selectedQuestionnaire.id));
        setQuestionnaires(prevQuestionnaires => prevQuestionnaires.filter(questionnaire => questionnaire.id !== selectedQuestionnaire.id));
        Alert.alert("Success", "Questionnaire deleted successfully!");
      } catch (error) {
        console.error('Error deleting document: ', error);
        Alert.alert("Error", "Failed to delete questionnaire.");
      }
    }
    setDeleteConfirmationModalVisible(false);
  };

  const handleCancelDelete = () => {
    setSelectedQuestionnaire(null);
    setDeleteConfirmationModalVisible(false);
  };

  const handleShowDeleteConfirmation = (questionnaire) => {
    setSelectedQuestionnaire(questionnaire);
    setDeleteConfirmationModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (questionnaires.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No questionnaires found.</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {questionnaires.map((questionnaire) => (
        <View key={questionnaire.id} style={styles.questionnaireContainer}>
          <Text style={styles.title}>{questionnaire.title}</Text>
          <View style={styles.imageContainer}>
            {Array.isArray(questionnaire.images) && questionnaire.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </View>
          <TouchableOpacity onPress={() => handleShowDeleteConfirmation(questionnaire)}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ))}
      <Modal
        visible={deleteConfirmationModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to delete this questionnaire?</Text>
            <View style={styles.modalButtonsContainer}>
              <Button title="Cancel" onPress={handleCancelDelete} />
              <Button title="Delete" color="red" onPress={handleDelete} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  questionnaireContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginHorizontal: 5,
    resizeMode: "cover",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

export default EditQuestionnaire;
