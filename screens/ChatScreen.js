import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Parse from 'parse/react-native';

const ChatScreen = ({ navigation }) => {
  const [phUsers, setPhUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch users with role 'ph'
  const fetchPhUsers = async () => {
    const query = new Parse.Query(Parse.User);
    query.equalTo('role', 'ph');
    try {
      const results = await query.find();
      console.log('PH Users:', results); // Log the retrieved users
      if (results) {
        setPhUsers(results);
      }
    } catch (error) {
      console.error('Error fetching PH users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhUsers();
  }, []);

  const handleUserPress = (objectId, username) => {
    navigation.navigate('MessagesScreen', { objectId, username });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        phUsers.map(user => (
          <TouchableOpacity
            key={user.id}
            onPress={() => handleUserPress(user.id, user.get('surname') ? user.get('surname') : '')}
            style={styles.userContainer}
          >
            {/* Profile Avatar */}
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{user.get('surname') ? user.get('surname')[0].toUpperCase() : ''}</Text>
            </View>
            {/* Username and Last Message */}
            <View style={styles.userInfoContainer}>
              <Text style={styles.username}>
                {user.get('surname') ? user.get('surname') : ''}
              </Text>
              {/* You can modify the following line to display the last message */}
              <Text style={styles.lastMessage}>Last message goes here</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    color: 'white',
  },
  userInfoContainer: {
    marginLeft: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMessage: {
    color: 'gray',
  },
});

export default ChatScreen;
