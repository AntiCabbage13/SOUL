import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig";

const db = getFirestore(firebaseApp);

export const createCommunity = async (creatorId, communityName, topic) => {
  try {
    // Add a new community to Firestore
    const communityRef = await addDoc(collection(db, 'communities'), {
      createdBy: creatorId,
      communityName,
      topic,
      createdAt: new Date().toISOString(),
    });

    console.log('Community added with ID: ', communityRef.id);
    return { success: true, communityId: communityRef.id };
  } catch (error) {
    console.error('Error adding community: ', error);
    return { success: false, error };
  }
};

export const fetchCommunities = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'communities'));
    const communities = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().communityName,
      topic: doc.data().topic,
    }));

    console.log('Fetched communities: ', communities);
    return { success: true, communities };
  } catch (error) {
    console.error('Error fetching communities: ', error);
    return { success: false, error };
  }
};
