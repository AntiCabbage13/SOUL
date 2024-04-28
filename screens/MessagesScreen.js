import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Text,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  where,
} from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/FontAwesome";
import PhotoPicker from "./PhotoPicker"; // Import the PhotoPicker component
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { fetchLeftBubbleMessages, fetchImageUrls } from "./leftMessageFetch";
const MessagesScreen = ({ route }) => {
  const { objectId } = route.params;
  const db = getFirestore(firebaseApp);
  const [textMessages, setTextMessages] = useState([]);
  const [imageMessages, setImageMessages] = useState([]);
  const [text, setText] = useState("");
  const [showIcons, setShowIcons] = useState(false);
  const [senderObjectId, setSenderObjectId] = useState(null);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  useEffect(() => {
    const fetchSenderObjectId = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem("userInfo");
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          const { objectId } = userInfo;
          setSenderObjectId(objectId);
        }
      } catch (error) {
        console.error("Error retrieving sender object ID:", error);
      }
    };

    fetchSenderObjectId();
  }, []);

  useEffect(() => {
    const fetchTextMessagesFromFirestore = async () => {
      try {
        if (senderObjectId && objectId) {
          const chatId = `${senderObjectId}_${objectId}`;
          const chatRef = doc(db, "chats", chatId);
          const chatSnap = await getDoc(chatRef);

          if (!chatSnap.exists()) {
            await setDoc(chatRef, {
              participants: [senderObjectId, objectId],
            });
          }

          const messagesRef = collection(db, "chats", chatId, "messages");
          const q = query(messagesRef, orderBy("timestamp", "desc"));
          const querySnapshot = await getDocs(q);
          const fetchedTextMessages = [];

          for await (const doc of querySnapshot.docs) {
            fetchedTextMessages.push({
              _id: doc.id,
              text: doc.data().content,
              createdAt: doc.data().timestamp.toDate(),
              user: {
                _id: doc.data().senderId,
              },
            });
          }

          // Sort text messages based on timestamp
          fetchedTextMessages.sort((a, b) => b.createdAt - a.createdAt);

          setTextMessages(fetchedTextMessages);
        }
      } catch (error) {
        console.error("Error fetching text messages from Firestore:", error);
      }
    };

    fetchTextMessagesFromFirestore();
  }, [senderObjectId, objectId, db]);

  useEffect(() => {
    const fetchImageUrlsFromFirestore = async () => {
      try {
        if (senderObjectId && objectId) {
          const imageQuery = query(
            collection(db, "files"),
            where("receiverId", "==", objectId),
            where("senderId", "==", senderObjectId),
            orderBy("createdAt", "desc")
          );
          const querySnapshot = await getDocs(imageQuery);
          const fetchedImageMessages = [];

          querySnapshot.forEach((doc) => {
            const url = doc.data().url;
            fetchedImageMessages.push({
              _id: doc.id,
              image: url,
              createdAt: new Date(doc.data().createdAt), // Convert createdAt to Date object
              user: { _id: senderObjectId },
            });
          });
          fetchedImageMessages.sort((a, b) => a.createdAt - b.createdAt);
          setImageMessages(fetchedImageMessages);
        }
      } catch (error) {
        console.error("Error fetching image URLs:", error);
      }
    };

    fetchImageUrlsFromFirestore();
  }, [senderObjectId, objectId, db]);
  const allMessages = [...textMessages, ...imageMessages];
  allMessages.sort((a, b) => b.createdAt - a.createdAt);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (senderObjectId && objectId) {
          // Fetch left bubble messages and image URLs
          const [leftBubbleMessages, fetchedImageUrlsData] = await Promise.all([
            fetchLeftBubbleMessages(objectId, senderObjectId),
            fetchImageUrls(objectId, senderObjectId),
          ]);

          // Map fetched image URLs to the left bubble messages
          const mappedLeftMessages = leftBubbleMessages.map((message) => {
            const imageUrl = fetchedImageUrlsData.find(
              (imageUrl) => imageUrl.user._id === message.user._id
            );

            return {
              ...message,
              position: "left",
              user: {
                _id: message.user._id,
              },
            };
          });

          // Map fetched image URLs with createdAt to the left bubble messages
          const mappedLeftImages = leftBubbleMessages.map((message) => {
            const imageUrl = fetchedImageUrlsData.find(
              (imageUrl) => imageUrl.user._id === message.user._id
            );

            return {
              image: imageUrl ? imageUrl.url : null,
              position: "left",
              user: {
                _id: message.user._id,
              },
              createdAt: imageUrl ? imageUrl.createdAt : null, // Add createdAt property
            };
          });

          // Combine mapped left bubble messages with sorted text and image messages
          const combinedMessages = [
            ...mappedLeftMessages,
            ...mappedLeftImages,
            ...textMessages.map((message) => ({
              ...message,
              position: "right",
              user: {
                _id: message.user._id,
                name: "User Name",
              },
            })),
            ...imageMessages.map((message) => ({
              ...message,
              position: "right",
              user: {
                _id: message.user._id,
                name: "User Name",
              },
            })),
          ];

          // Sort combined messages by createdAt
          combinedMessages.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          // Set the combined messages to the messages state variable
          setMessages(combinedMessages);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [objectId, senderObjectId, textMessages, imageMessages]);

  const openPhotoPicker = async () => {
    try {
      await AsyncStorage.setItem(
        "refData",
        JSON.stringify({ senderObjectId, objectId })
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
      const senderId = senderObjectId.replace(/\//g, "");
      const receiverId = objectId.replace(/\//g, "");

      const messageToSend = {
        text: text.trim(),
        createdAt: new Date(),
        user: {
          _id: senderObjectId,
        },
      };

      setTextMessages((previousTextMessages) =>
        GiftedChat.append(previousTextMessages, [messageToSend])
      );

      await AsyncStorage.setItem(
        "messages",
        JSON.stringify([...textMessages, messageToSend])
      );

      const chatRef = doc(db, "chats", `${senderObjectId}_${objectId}`);
      await addDoc(collection(chatRef, "messages"), {
        content: text.trim(),
        senderId: senderObjectId,
        receiverId: objectId,
        timestamp: serverTimestamp(),
      });

      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPhotoPicker}
        onRequestClose={closePhotoPicker}
      >
        <PhotoPicker
          senderId={senderObjectId}
          receiverId={objectId}
          onClose={closePhotoPicker}
        />
      </Modal>

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: senderObjectId }}
        renderInputToolbar={(props) => (
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
        renderBubble={(props) => {
          const isCurrentUser =
            props.currentMessage.user &&
            props.currentMessage.user._id === senderObjectId;
          const bubbleBackgroundColor = isCurrentUser ? "green" : "green";
          const position =
            props.currentMessage.position || (isCurrentUser ? "right" : "left");

          return (
            <Bubble
              {...props}
              position={position}
              wrapperStyle={{
                right: {
                  backgroundColor: 'transparent',
                  margin: 5,
                  marginVertical: 14,
                  padding: 9,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: "#2fa84f",
                  borderStyle: "dotted",
                },
                left: {
                  backgroundColor:'transparent',
                  margin: 5,
                  marginVertical: 14,
                  padding: 5,
                  marginLeft: position === "left" ? -40 : 0,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: "#2fa84f",
                  borderStyle: "dotted",
                },
              }}
            >
              {props.currentMessage.text && !props.currentMessage.image && (
                <Text>{props.currentMessage.text}</Text>
              )}
              {props.currentMessage.image && (
                <View style={{ width: 200, height: 200 }}>
                  <ImageBackground
                    source={{ uri: props.currentMessage.image }}
                    style={{
                      width: "100%",
                      height: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "rgba(0, 128, 0, 0.5)",
                        padding: 5,
                      }}
                    >
                      <Text style={{ color: "black" }}>
                        {props.currentMessage.text}
                      </Text>
                    </View>
                  </ImageBackground>
                </View>
              )}
            </Bubble>
          );
        }}
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

export default MessagesScreen;
