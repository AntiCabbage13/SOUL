import React, { useEffect, useState } from "react";
import {View,StyleSheet,TextInput,TouchableOpacity,Modal,Image,Text} from "react-native";
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
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const MessagesScreen = ({ route }) => {
  const { objectId } = route.params;
  const db = getFirestore(firebaseApp);
  const [textMessages, setTextMessages] = useState([]);
  const [imageMessages, setImageMessages] = useState([]);
  const [text, setText] = useState("");
  const [showIcons, setShowIcons] = useState(false);
  const [senderObjectId, setSenderObjectId] = useState(null);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

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

              // Sort image messages based on createdAt
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

      await AsyncStorage.setItem("messages", JSON.stringify([...textMessages, messageToSend]));

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
        <PhotoPicker senderId={senderObjectId} receiverId={objectId} onClose={closePhotoPicker} />
      </Modal>

      <GiftedChat
        messages={allMessages}
        onSend={onSend}
        user={{ _id: senderObjectId }}
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
        renderBubble={(props) => {
          const isCurrentUser = props.currentMessage.user._id === senderObjectId;
          const bubbleBackgroundColor = isCurrentUser ? "green" : "#f0f0f0";

          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: isCurrentUser ? bubbleBackgroundColor : "#f0f0f0",
                  margin: 5,
                  marginVertical: 14,
                  padding: 9,
                },
                left: {
                  backgroundColor: isCurrentUser ? "#f0f0f0" : bubbleBackgroundColor,
                  margin: 5,
                  marginVertical: 14,
                  padding: 9,
                },
              }}
            >
              {props.currentMessage.image && (
                <Image
                  source={{ uri: props.currentMessage.image }}
                  style={{ width: 200, height: 200 }}
               
                  />
                  )}
    
                  {props.currentMessage.text && !props.currentMessage.image && (
                    <Text>{props.currentMessage.text}</Text>
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

