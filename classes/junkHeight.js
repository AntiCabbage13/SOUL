// ParentComponent.js

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import EditQuestionnaire from './EditQuestionnaire';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseApp } from '../firebaseConfig';

const db = getFirestore(firebaseApp);

const ParentComponent = () => {
  const [loading, setLoading] = useState(true);
  const [questionnaire, setQuestionnaire] = useState(null);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const docRef = doc(db, 'questionnaires', 'yourQuestionnaireId');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuestionnaire({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaire();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      {questionnaire && <EditQuestionnaire questionnaire={questionnaire} />}
    </View>
  );
};

export default ParentComponent;
