import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PhotoPicker from "./PhotoPicker"; // Import the PhotoPicker component
import {
  getFirestore,
  doc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  setDoc,
  orderBy,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/FontAwesome";

const ProfMessagesScreen = ({ route }) => {
  // Ensure route.params is properly initialized
  const { receiverId, senderId, chatId } = route.params || {};

  useEffect(() => {
    console.log("Receiver ID:", receiverId);
    console.log("Sender ID:", senderId);
    console.log("Chat ID:", chatId);

    // Fetch messages only if receiverId, senderId, and chatId are available
    if (receiverId && senderId && chatId) {
      fetchMessagesFromFirestore();
    } else {
      console.warn("Receiver ID, Sender ID, or Chat ID is missing.");
    }
  }, [route.params]); // Ensure useEffect re-runs when route.params changes

  const db = getFirestore(firebaseApp);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showIcons, setShowIcons] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  const fetchMessagesFromFirestore = async () => {
    try {
      const chatRef = doc(db, "chats", chatId);
      const messagesRef = collection(chatRef, "messages");
      const q = query(messagesRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedMessages = [];
      querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        const isSender = messageData.senderId === senderId;
        fetchedMessages.push({
          _id: doc.id,
          text: messageData.content,
          createdAt: messageData.timestamp.toDate(),
          user: {
            _id: isSender ? senderId : senderId,
          },
          sent: isSender,
        });
      });
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages from Firestore:", error);
    }
  };

  const openPhotoPicker = async () => {
    try {
      await AsyncStorage.setItem(
        "refData",
        JSON.stringify({ senderId, receiverId })
      );
      setShowPhotoPicker(true);
    } catch (error) {
      console.error(
        "Error setting sender and receiver ID in local storage:",
        error
      );
    }
  };

  const closePhotoPicker = () => {
    setShowPhotoPicker(false);
  };

  const onSend = async () => {
    try {
      const sanitizedSenderId = senderId.replace(/\//g, "");
      const sanitizedReceiverId = receiverId.replace(/\//g, "");
      const messageToSend = {
        text: text.trim(),
        createdAt: new Date(),
        user: {
          _id: sanitizedSenderId,
        },
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [messageToSend])
      );

      await AsyncStorage.setItem("messages", JSON.stringify(messages));

      const chatRef = doc(db, "chats", chatId);
      await addDoc(collection(chatRef, "messages"), {
        content: text.trim(),
        senderId: sanitizedSenderId,
        receiverId: sanitizedReceiverId,
        timestamp: serverTimestamp(),
      });

      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Modal for PhotoPicker */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPhotoPicker}
        onRequestClose={closePhotoPicker}
      >
        <PhotoPicker
          senderId={senderId}
          receiverId={receiverId}
          onClose={closePhotoPicker}
        />
      </Modal>

      {/* GiftedChat component */}
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: senderId }}
        renderInputToolbar={() => (
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.toggleIconRow}
              onPress={() => setShowIcons(!showIcons)}
            >
              <Icon
                name={showIcons ? "paperclip" : "paperclip"}
                size={24}
                color="#2fa84f"
              />
            </TouchableOpacity>
            {showIcons && (
              <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconButton}>
                  <Icon name="camera" size={24} color="#2fa84f" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Icon name="microphone" size={24} color="#2fa84f" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={openPhotoPicker}
                >
                  <Icon name="picture-o" size={24} color="#2fa84f" />
                </TouchableOpacity>
              </View>
            )}
            <TextInput
              style={styles.textInput}
              placeholder="Type your message here..."
              value={text}
              onChangeText={setText}
            />
            <TouchableOpacity style={styles.sendButton} onPress={onSend}>
              <Icon name="paper-plane" size={24} color="green" marginEnd={6} />
            </TouchableOpacity>
          </View>
        )}
        renderBubble={props => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor:
                  props.currentMessage.user._id === senderId ? "green" : "#f0f0f0",
                margin: 5,
                marginVertical: 14,
                padding: 9,
              },
              left: {
                backgroundColor:
                  props.currentMessage.user._id === receiverId ? "#f0f0f0" : "green",
                margin: 5,
                marginVertical: 14,
                padding: 9,
              },
            }}
          />
        )}
        dateFormat="MMM D, YYYY"
        inverted={true}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#2fa84f",
    borderStyle: "dotted",
    marginEnd: 8,
    marginStart: 8,
    marginTop: -19,
  },
  toggleIconRow: {
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
});

export default ProfMessagesScreen;
