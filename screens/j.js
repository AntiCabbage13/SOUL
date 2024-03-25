import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PostScreen = ({ route }) => {
  const { communityId, objectId } = route.params;

  const [postText, setPostText] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const handlePost = () => {
    const newPost = {
      id: Date.now().toString(),
      text: postText,
      imageUri: imageUri,
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setPostText('');
    setImageUri(null);
    setIsFormVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Post Screen</Text>

      {/* Create Post Button */}
      <TouchableOpacity style={styles.button} onPress={() => setIsFormVisible(!isFormVisible)}>
        <Text style={styles.buttonText}>{isFormVisible ? 'Hide Form' : 'Create Post'}</Text>
      </TouchableOpacity>

      {/* Post Creation Form */}
      {isFormVisible && (
        <View style={styles.formContainer}>
          {/* Text Input for Post */}
          <TextInput
            style={styles.input}
            placeholder="Write your post..."
            multiline
            value={postText}
            onChangeText={text => setPostText(text)}
          />

          {/* Image Preview */}
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          )}

          {/* Button to Pick Image */}
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Add Image</Text>
          </TouchableOpacity>

          {/* Post Button */}
          <TouchableOpacity style={styles.button} onPress={handlePost}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Posts Container */}
      <View style={styles.postsContainer}>
        {posts.map((post) => (
          <View key={post.id} style={styles.post}>
            <Text style={styles.postText}>{post.text}</Text>
            {post.imageUri && (
              <Image source={{ uri: post.imageUri }} style={styles.postImage} />
            )}
          </View>
        ))}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  postsContainer: {
    marginTop: 24,
  },
  post: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  postText: {
    fontSize: 16,
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});

export default PostScreen;
