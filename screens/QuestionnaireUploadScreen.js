import React, { useState } from "react";
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
  RefreshControl,
} from "react-native";
import EditQuestionnaire from"../screens/ EditQuestionnaire";
import { firebaseApp } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, deleteDoc } from "firebase/firestore";

const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);

const QuestionnaireUploadScreen = () => {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
const [refreshing, setRefreshing] = useState(false);

  // Function to refresh questionnaires in EditQuestionnaire component
  const handleRefresh = () => {
    setRefreshing(true);
    // Your refresh logic here
      setTimeout(() => {
        setRefreshing(false);
      }, 50);
      console.log('yiiiip');
  };
  
  const refreshScreen = () => {
    setRefreshKey(prevKey => prevKey + 1);

    console.log("refreshed");
  };


  const uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `images/${imageName}`);
    await uploadBytes(storageRef, blob);
    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  };

  const addQuestionnaire = async () => {
    const imageUrls = await Promise.all(
      images.map(async (image, index) => {
        const url = await uploadImage(image.uri, `image_${index}`);
        return url;
      })
    );

    await addDoc(collection(db, "questionnaires"), {
      title,
      images: imageUrls,
    });
    

    setTitle("");
    setImages([]);
    setImagePreviews([]);
    Alert.alert("Success", "Questionnaire uploaded successfully!");
    handleRefresh();
  };


  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Denied",
        "Permission to access camera roll is required!"
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      const { uri } = pickerResult;
      setImages([...images, { uri }]);
      setImagePreviews([...imagePreviews, uri]);
    }
  };



  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Upload Questionnaire</Text>

      <TextInput
        style={styles.input}
        placeholder="Questionnaire Title"
        value={title}
        onChangeText={setTitle}
      />

      <Button title="Add Image" onPress={handleImagePicker} />

      <View style={styles.imageContainer}>
        {imagePreviews.map((imageUri, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setModalVisible(true);
              setSelectedImageIndex(index);
            }}
          >
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Upload Questionnaire" onPress={addQuestionnaire} />

      <View>
      <EditQuestionnaire />
    </View>
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    margin: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});

export default QuestionnaireUploadScreen;
