
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseApp } from "../firebaseConfig";
const storage = getStorage(firebaseApp);
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
export const postSubmit = async (postText, communityId, imageUri) => {
  try {
    let imageUrl = null;

    // Upload image to Firebase Storage if imageUri is provided
    if (imageUri) {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `communityPost/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Add post to Firestore
    const postRef = await addDoc(collection(db, `communities/${communityId}/posts`), {
      text: postText,
      imageUrl,
      timestamp: new Date().toISOString(),
    });

    console.log('Post added with ID: ', postRef.id);
    return { success: true, postId: postRef.id };
  } catch (error) {
    console.error('Error adding post: ', error);
    return { success: false, error };
  }
};

export const fetchPosts = async (communityId) => {
  try {
    const posts = [];
    
    // Query posts collection under the specified communityId
    const q = query(collection(db, `communities/${communityId}/posts`));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        text: doc.data().text,
        imageUrl: doc.data().imageUrl,
        timestamp: doc.data().timestamp,
      });
    });

    console.log('Fetched posts: ', posts);
    return { success: true, posts };
  } catch (error) {
    console.error('Error fetching posts: ', error);
    return { success: false, error };
  }
};


export const submitComment = async (communityId, postId, commentText) => {
  try {
    // Add comment to Firestore under the specified communityId and postId
    const commentRef = await addDoc(collection(db, `communities/${communityId}/posts/${postId}/comments`), {
      text: commentText,
      timestamp: new Date().toISOString(),
    });

    console.log('Comment added with ID: ', commentRef.id);
    return { success: true, commentId: commentRef.id };
  } catch (error) {
    console.error('Error adding comment: ', error);
    return { success: false, error };
  }
};

export const fetchComments = async (communityId, postId) => {
  try {
    const comments = [];
    
    // Query comments collection under the specified communityId and postId
    const q = query(collection(db, `communities/${communityId}/posts/${postId}/comments`));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        text: doc.data().text,
        timestamp: doc.data().timestamp,
      });
    });

    console.log('Fetched comments: ', comments);
    return { success: true, comments };
  } catch (error) {
    console.error('Error fetching comments: ', error);
    return { success: false, error };
  }
};
