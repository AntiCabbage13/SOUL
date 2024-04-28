import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Parse from "parse/react-native";

const ChatRoomScreen = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [userObjectIds, setUserObjectIds] = useState([]);
  const [navigationPending, setNavigationPending] = useState(false);
  const [navigationData, setNavigationData] = useState({});
  const [loading, setLoading] = useState(true); // State for loading indicator
  const navigation = useNavigation();
  const [usersWithNoRole, setUsersWithNoRole] = useState([]);

  useEffect(() => {
    const fetchUserObjectIds = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem("userInfo");
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          const { objectId } = userInfo;
          setUserObjectIds([objectId]); // Store the user's own object ID
          console.log("User Object ID:", objectId);
        }
      } catch (error) {
        console.error("Error retrieving user object ID:", error);
      }
    };

    fetchUserObjectIds();
  }, []);

  useEffect(() => {
    if (userObjectIds.length > 0) {
      fetchChatRooms(userObjectIds);
    }
  }, [userObjectIds]);

  useEffect(() => {
    if (navigationPending) {
      navigateToMessagesScreen(navigationData);
      setNavigationPending(false);
    }
  }, [navigationPending, navigationData]);

  const fetchUsersWithNoRole = async () => {
    const query = new Parse.Query(Parse.User);
    query.doesNotExist("role"); // Query users with no role
    query.select("objectId", "firstName", "surname"); // Select specific fields
    try {
      const results = await query.find();
      console.log("Users with no role:", results); // Log the retrieved users
      return results.map((user) => ({
        comparisonId: user.id, // Rename objectId to comparisonId
        firstName: user.get("firstName"),
        surname: user.get("surname"),
      })); // Return an array of objects with specified fields
    } catch (error) {
      console.error("Error fetching users with no role:", error);
      throw error;
    }
  };
  useEffect(() => {
    if (userObjectIds.length > 0) {
      fetchChatRooms(userObjectIds, usersWithNoRole); // Pass usersWithNoRole array
    }
  }, [userObjectIds, usersWithNoRole]); // Add usersWithNoRole to dependency array

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const comparisonIds = await fetchUsersWithNoRole(); // Get comparison IDs
        setUsersWithNoRole(comparisonIds); // Store comparison IDs
        setLoading(false);
        if (userObjectIds.length > 0) {
          fetchChatRooms(userObjectIds, comparisonIds); // Pass comparisonIds
        }
      } catch (error) {
        console.error("Error fetching users with no role:", error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const fetchChatRooms = async (userObjectIds, usersWithNoRole) => {
    try {
      const db = getFirestore(firebaseApp);
      const chatRoomsData = [];

      for (const objectId of userObjectIds) {
        const q = query(
          collection(db, "chats"),
          where("participants", "array-contains", objectId)
        );
        const querySnapshot = await getDocs(q);

        for (const doc of querySnapshot.docs) {
          const chatId = doc.id;
          const participants = doc.data().participants;
          const receiverObjectID = participants[0]; // Get the first element of the participants array

          // Get the last message for this chat room
          const messagesQuery = query(
            collection(db, `chats/${chatId}/messages`),
            orderBy("timestamp", "desc"), // Order messages by timestamp in descending order
            limit(1) // Limit the query to only fetch the last message
          );
          const messagesSnapshot = await getDocs(messagesQuery);
          let lastMessage = "No messages"; // Default value if no message is found
          if (!messagesSnapshot.empty) {
            // If there are messages, get the last one
            const lastMessageDoc = messagesSnapshot.docs[0];
            lastMessage = lastMessageDoc.data().content; // Assuming your message has a field named "content"
          }

          console.log("Chat ID:", chatId);
          console.log("Participants:", participants);
          console.log("Object ID being compared:", objectId);
          console.log("Receiver ID from Firestore:", receiverObjectID);
          console.log("Last Message:", lastMessage);

          // Find receiverUser based on receiverObjectID
          const receiverUser = usersWithNoRole.find(
            (user) => user.comparisonId === receiverObjectID
          );
          console.log("Receiver User:", receiverUser);

          // If receiverUser is found, assign receiverUsername
          if (receiverUser) {
            const receiverUsername = `${receiverUser.firstName} ${receiverUser.surname}`;
            chatRoomsData.push({
              chatId: chatId,
              senderId: objectId,
              receiverId: receiverObjectID,
              receiverUsername: receiverUsername,
              lastMessage: lastMessage, // Include the last message in the chat room data
            });
          } else {
            // If receiverUser is not found, assign "No User Found" as receiverUsername
            chatRoomsData.push({
              chatId: chatId,
              senderId: objectId,
              receiverId: receiverObjectID,
              receiverUsername: "No User Found",
              lastMessage: lastMessage, // Include the last message in the chat room data
            });
          }
        }
      }

      setChatRooms(chatRoomsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

  const navigateToMessagesScreen = ({ chatId, senderId, receiverId }) => {
    console.log("Navigating to messages screen with Receiver ID:", receiverId);
    navigation.navigate("ProfMessagesScreen", {
      RD: receiverId, // Pass receiverId as "RD" parameter
      // senderId: senderId,
      // chatId: chatId,
    });
  };
  

  const renderChatRooms = () => {
    return chatRooms
      .filter((_, index) => index % 2 === 0) // Filter out chat rooms at even positions
      .map((chatRoom) => (
        <TouchableOpacity
          key={chatRoom.chatId}
          onPress={() => handleChatRoomPress(chatRoom)}
          style={{
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <View>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}
              >
                {chatRoom.receiverUsername}
              </Text>
              <Text style={{ fontSize: 16, color: "#888" }}>
                {chatRoom.lastMessage}
              </Text>
            </View>
            {/* Add any additional components or icons here if needed */}
          </View>
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
