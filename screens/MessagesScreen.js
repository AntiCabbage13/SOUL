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
          console.log("text messages right", fetchedTextMessages);
          console.log('invoked');
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
          console.log("fetched images right", fetchedImageMessages);
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
          const [leftBubbleMessages, fetchedImageUrlsData] = await Promise.all([
            fetchLeftBubbleMessages(objectId, senderObjectId),
            fetchImageUrls(objectId, senderObjectId),
          ]);
          console.log('invoked');
          let combinedMessages = []; // Initialize combinedMessages as an empty array

          const mappedLeftMessages = leftBubbleMessages.map((message) => {
            return {
              ...message,
              position: "left",
              user: {
                _id: message.user._id,
              },
              // messageId can remain the same as _id from fetchedMessages
              messageId: message._id,
            };
          });
          console.log('invoked');
          const mappedLeftImages = fetchedImageUrlsData
            .map((imageUrl) => {
              const message = fetchedImageUrlsData.find(
                (message) => message.user._id === imageUrl.user._id
              );

              if (message) {
                const existingMessageIndex = combinedMessages.findIndex(
                  (msg) => msg._id === message._id && msg.position === "left"
                );

                if (existingMessageIndex === -1) {
                  return {
                    image: imageUrl.url,
                    position: "left",
                    user: {
                      _id: message.user._id,
                    },
                    _id: message.messageId,
                    createdAt: imageUrl.createdAt,
                  };
                }
              }

              return null; // Return null if the message already exists or if no corresponding message is found
            })
            .filter((message) => message !== null); 
          console.log("comnbined left images", combinedMessages);
          console.log('invoked');
          combinedMessages = [
            ...mappedLeftImages,
            ...mappedLeftMessages,
            ...textMessages.map((message) => ({
              ...message,
              position: "right",
              user: {
                _id: message.user._id,
                _id: message.messageId,
              
              },
            })),
            ...imageMessages.map((message) => ({
              ...message,
              position: "right",
              user: {
                _id: message.user._id,
                _id: message.messageId,
              },
            })),
          ];

          combinedMessages.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setMessages(combinedMessages);
          console.log("combined messages", combinedMessages);
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

     /*  setTextMessages((previousTextMessages) =>
        GiftedChat.append(previousTextMessages, [messageToSend])
      ); */
      setTextMessages(previousTextMessages => {
        if (messageToSend.user._id === senderObjectId) {
          return GiftedChat.append(previousTextMessages, [messageToSend]);
        }
        return previousTextMessages;
      });
      


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
        messages={messages.map((message) => ({
          ...message,
          _id: message.messageId,
        }))}
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
                  backgroundColor: "transparent",
                  margin: 5,
                  marginVertical: 14,
                  padding: 9,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: "#2fa84f",
                  borderStyle: "dotted",
                },
                left: {
                  backgroundColor: "transparent",
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
              {/* Render text message if present */}
              {props.currentMessage.text && !props.currentMessage.image && (
                <Text>{props.currentMessage.text}</Text>
              )}
              {/* Render image message if present */}
              {props.currentMessage.image && (
                <View style={{ width: 200, height: 200 }}>
                  {/* Your image rendering logic */}
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
