import React from 'react';
import { Button, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const db = getFirestore(firebaseApp);

const PhotoPicker = ({ senderId, receiverId }) => {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    // Use "cancelled" instead of "canceled" to check for cancellation
    if (!result.cancelled) {
      try {
        // Access the URI from assets[0]
        const imageUrl = await uploadImage(result.assets[0].uri);
        await saveRecord(imageUrl, senderId, receiverId);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    // Access storageRef directly from the storage module
    const storageRef = ref(getStorage(), "messageUploads/" + new Date().getTime()); // Updated path
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track upload progress if needed
        },
        (error) => {
          reject(error);
        },
        () => {
          // Upload completed successfully, get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  };

  const saveRecord = async (imageUrl, senderId, receiverId) => {
    try {
      // Add sender ID, receiver ID, and participants array to the document
      await addDoc(collection(db, "files"), {
        fileType: 'image',
        url: imageUrl,
        createdAt: new Date().toISOString(),
        senderId: senderId,
        receiverId: receiverId,
        participants: [senderId, receiverId]
      });
      console.log("Image record saved successfully");
    } catch (error) {
      console.error('Error saving image record:', error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick a photo from gallery" onPress={pickImage} />
    </View>
  );
};

export default PhotoPicker;
