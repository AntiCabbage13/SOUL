import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated ,ActivityIndicator,useNavigation } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { createCommunity, fetchCommunities } from './CommunityHandler'; // Import the createCommunity and fetchCommunities functions

const CommunityScreen = () => {
  const [communityName, setCommunityName] = useState('');
  const [topic, setTopic] = useState('');
  const [senderObjectId, setSenderObjectId] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [animationValue, setAnimationValue] = useState(new Animated.Value(0));
  const [communities, setCommunities] = useState([]); // State variable to store fetched communities
  const navigation = useNavigation(); // Initialize navigation hook
 // Navigate to PostScreen with communityId and objectId
 const navigateToPostScreen = (communityId, objectId) => {
  navigation.navigate('PostScreen', {
    communityId: communityId,
    objectId: objectId,
  });
};

  // Fetch senderObjectId from AsyncStorage
  const fetchSenderObjectId = async () => {
    const userInfoString = await AsyncStorage.getItem("userInfo");
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      const { objectId } = userInfo;
      setSenderObjectId(objectId);
    }
  };
  const [isLoading, setIsLoading] = useState(true); // State variable to track loading state
  // Handle toggle form visibility
  const toggleFormVisibility = () => {
    if (isFormVisible) {
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIsFormVisible(false);
      });
    } else {
      setIsFormVisible(true);
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

 






  // Handle community creation
  const handleCreateCommunity = async () => {
    if (!communityName || !topic || !senderObjectId) {
      alert('Please fill in all the fields.');
      return;
    }

    const { success, communityId, error } = await createCommunity(senderObjectId, communityName, topic);

    if (success) {
      console.log('Community created successfully with ID: ', communityId);
      // Reset fields
      setCommunityName('');
      setTopic('');
      toggleFormVisibility();
    } else {
      console.error('Error creating community: ', error);
      alert('Error creating community. Please try again.');
    }
  };

  // Fetch communities when component mounts
  useEffect(() => {
    const fetchData = async () => {
      const { success, communities } = await fetchCommunities();
      if (success) {
        setCommunities(communities);
        setIsLoading(false); // Set loading state to false when data is fetched
      }
    };

    fetchData();
    fetchSenderObjectId();
  }, []);


  return (
    <View style={styles.container}>
      {/* Display loading spinner if data is not available */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text>Loading communities...</Text>
        </View>
      ) : (
        <View style={styles.communitiesContainer}>
          {/* Plus button at the very right bottom */}
          <TouchableOpacity style={styles.addButton} onPress={toggleFormVisibility}>
            <Icon name={isFormVisible ? "minus" : "plus"} size={30} color="#fff" />
          </TouchableOpacity>

          {isFormVisible && (
            <Animated.View style={[styles.formContainer, { opacity: animationValue }]}>
              {/* ... (form fields and button) */}
            </Animated.View>
          )}

          {/* Render fetched communities */}
          {communities.map((community, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.communityRow} 
              onPress={() => navigateToPostScreen(community.id, senderObjectId)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {community.name ? community.name.charAt(0).toUpperCase() : ''}
                </Text>
              </View>
              <View style={styles.communityDetails}>
                <Text style={styles.communityName}>
                  {community.name || 'Unnamed Community'}
                </Text>
                <Text style={styles.communityTopic}>
                  {community.topic || 'No Topic'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
 
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'transparent',
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'green',
    borderStyle: "dotted",
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  formContainer: {
    marginTop: 80,
  },
  input: {
    height: 50,
    marginTop: 20,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: 'green',
    borderStyle: "dotted",
  },
  createButton: {
    marginTop: 20,
    backgroundColor: 'transparent',
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'green',
    borderStyle: "dotted",
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  communitiesContainer: {
    marginTop: 7,
  },
  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
    marginBottom: 7,
    marginStart:-10,
  },
  avatar: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    backgroundColor: 'transparent',
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'green',
    borderStyle: "dotted",
  },
  avatarText: {
    fontSize: 24,
    color: '#fff',
  },
  communityDetails: {
    flex: 1,
  },
  communityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  communityTopic: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommunityScreen;
