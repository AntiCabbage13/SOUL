import { getDocs, collection, getFirestore } from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig";

const db = getFirestore(firebaseApp);

const fetchQuestionnaires = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "questionnaires"));
    const fetchedQuestionnaires = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        images: data.images,
      };
    });
    console.log('data from q',fetchedQuestionnaires);
    return fetchedQuestionnaires;
  } catch (error) {
    console.error('Error fetching questionnaires: ', error);
    return [];
  }
};

export default fetchQuestionnaires;
