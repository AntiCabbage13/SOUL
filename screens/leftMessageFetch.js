import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  setDoc,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
const db = getFirestore();
const storage = getStorage();
export const fetchLeftBubbleMessages = async (objectId, senderObjectId) => {
  try {
    if (senderObjectId && objectId) {
      const chatId = `${objectId}_${senderObjectId}`;
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
      const fetchedMessages = [];

      for await (const doc of querySnapshot.docs) {
        fetchedMessages.push({
          _id: doc.id,
          text: doc.data().content,
          createdAt: doc.data().timestamp.toDate(),
          user: {
            _id: doc.data().senderId,
          },
        });
      }

      fetchedMessages.sort((a, b) => b.createdAt - a.createdAt);
      console.log("object id", objectId);
      console.log("sender object id ", senderObjectId);
      console.log("Fetched Messages:", fetchedMessages);
      return fetchedMessages;
    }
  } catch (error) {
    console.error("Error fetching left bubble messages:", error);
    throw error;
  }
};
export const fetchImageUrls = async (objectId, senderObjectId) => {
  try {
    // Query Firestore to find the file with the correct receiverId and senderId
    const filesQuery = query(
      collection(db, "files"),
      where("receiverId", "==", senderObjectId),
      where("senderId", "==", objectId)
    );

    const querySnapshot = await getDocs(filesQuery);
    const downloadURLs = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const url = data.url;
      const createdAt = new Date(data.createdAt);

      downloadURLs.push({
        _id: doc.id,
        createdAt: createdAt,
       // user: {
       //   _id: data.senderId,
        //},
        user: { _id: objectId },
        url: url,
      });
    });

    console.log("Left side URLs:", downloadURLs);
    console.log("executed");
    return downloadURLs;
  } catch (error) {
    console.error("Error fetching image URLs:", error);
    throw error;
  }
};

