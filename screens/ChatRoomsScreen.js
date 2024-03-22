import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native"; // Import ActivityIndicator
import { useNavigation } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatRoomScreen = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [userObjectId, setUserObjectId] = useState(null);
  const [navigationPending, setNavigationPending] = useState(false);
  const [navigationData, setNavigationData] = useState({});
  const [loading, setLoading] = useState(true); // State for loading indicator
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserObjectId = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem("userInfo");
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          const { objectId } = userInfo;
          setUserObjectId(objectId);
          console.log("User Object ID:", objectId);
          fetchChatRooms(objectId);
        }
      } catch (error) {
        console.error("Error retrieving user object ID:", error);
      }
    };

    fetchUserObjectId();
  }, []);

  useEffect(() => {
    if (navigationPending) {
      navigateToMessagesScreen(navigationData);
      setNavigationPending(false);
    }
  }, [navigationPending, navigationData]);

  const fetchChatRooms = async (objectId) => {
    try {
      const db = getFirestore(firebaseApp);
      const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", objectId)
      );
      const querySnapshot = await getDocs(q);

      const chatRoomsData = [];

      for (const doc of querySnapshot.docs) {
        const chatId = doc.id;
        const participants = doc.data().participants;
        const receiverObjectID = participants.find((id) => id !== objectId);

        console.log("Chat ID:", chatId);
        console.log("Participants:", participants);
        console.log("Receiver ID from Firestore:", receiverObjectID);

        // Retrieve last message and sender ID here...

        console.log("Chat ID:", chatId);
        console.log("Receiver ID:", receiverObjectID);

        chatRoomsData.push({
          chatId: chatId,
          senderId: objectId,
          receiverId: receiverObjectID,
          // Add other chat room data here...
        });
      }
      setChatRooms(chatRoomsData);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

  const navigateToMessagesScreen = ({ chatId, senderId, receiverId }) => {
    console.log("Navigating to messages screen with Receiver ID:", receiverId);
    navigation.navigate("ProfMessagesScreen", {
      receiverId: receiverId,
      senderId: senderId,
      chatId: chatId,
    });
  };

  const renderChatRooms = () => {
    return chatRooms.map((chatRoom) => (
      <TouchableOpacity
        key={chatRoom.chatId}
        onPress={() => handleChatRoomPress(chatRoom)}
        style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
      >
        <Text style={{ fontSize: 18 }}>Chat ID: {chatRoom.chatId}</Text>
        {/* Render last message or other chat room info here */}
      </TouchableOpacity>
    ));
  };

  const handleChatRoomPress = (chatRoomData) => {
    setNavigationData(chatRoomData);
    setNavigationPending(true);
  };

  return (
    <View>
      {loading ? ( // Conditionally render loading spinner
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        // Render chat rooms here
        renderChatRooms()
      )}
    </View>
  );
};

export default ChatRoomScreen;
