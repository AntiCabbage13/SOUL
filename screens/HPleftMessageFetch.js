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
  
  export const fetchLeftBubbleMessages = async (receiverId, senderObjectId) => {
  
    try {
      if (senderObjectId && receiverId) {
        
        const chatId = `${receiverId}_${senderObjectId}`;
        const chatRef = doc(db, "chats", chatId);
        const chatSnap = await getDoc(chatRef);
  
        if (!chatSnap.exists()) {
          await setDoc(chatRef, {
            participants: [senderObjectId, receiverId],
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
  
        // Sort messages based on timestamp
        fetchedMessages.sort((a, b) => b.createdAt - a.createdAt);
  
        console.log('Fetched Messages:', fetchedMessages);
        console.log('object id',receiverId);
        console.log('sender object id ', senderObjectId);
        return fetchedMessages;
      }
    } catch (error) {
      console.error("Error fetching left bubble messages:", error);
      throw error;
    }
  };
  
  
  
  export const fetchImageUrls = async (receiverId, senderObjectId) => {
    try {
      // Query Firestore to find the file with the correct receiverId and senderId
      const filesQuery = query(
        collection(db, "files"),
        where("receiverId", "==", senderObjectId),
        where("senderId", "==", receiverId)
      );
  
      const querySnapshot = await getDocs(filesQuery);
      const downloadURLs = [];
  
      querySnapshot.forEach((doc) => {
        const { url } = doc.data();
        downloadURLs.push({
          _id: doc.id,
          createdAt: new Date(doc.data().createdAt), // Convert createdAt to Date object
          user: {
            _id: doc.data().senderId,
          },
          url: url,
        });
      });
  
      console.log('Left side URLs:', downloadURLs);
  
      return downloadURLs;
    } catch (error) {
      console.error("Error fetching image URLs:", error);
      throw error;
    }
  };
  
  
  