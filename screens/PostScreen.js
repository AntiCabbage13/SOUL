import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { postSubmit, fetchPosts } from "./CommunityHandler";
import CommentSection from './CommentSection';
const PostScreen = ({ route }) => {
  const { communityId, objectId } = route.params;
  const navigation = useNavigation();

  const [postText, setPostText] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [posts, setPosts] = useState([]);

  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  const [commentedPostId, setCommentedPostId] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    })();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      const { success, posts } = await fetchPosts(communityId);
      if (success) {
        setPosts(posts);
      }
    };

    loadPosts();
  }, [communityId]);

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

  const handlePost = async () => {
    const { success, postId } = await postSubmit(
      postText,
      communityId,
      imageUri
    );

    if (success) {
      const newPost = {
        id: postId,
        text: postText,
        imageUri: imageUri,
      };

      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setPostText("");
      setImageUri(null);
      setIsFormVisible(false);
    } else {
      Alert.alert("Error", "Failed to submit post. Please try again.");
    }
  };

  

  const handleComment = (postId) => {
    console.log('Comment button clicked for post:', postId);
    setIsCommentSectionVisible(true);
    setCommentedPostId(postId);
  };

  const handleCloseCommentSection = () => {
    setIsCommentSectionVisible(false);
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Post Screen</Text>
  
      {/* Create Post Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsFormVisible(!isFormVisible)}
      >
        <Text style={styles.buttonText}>
          {isFormVisible ? "Hide Form" : "Create Post"}
        </Text>
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
            onChangeText={(text) => setPostText(text)}
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
            {post.imageUrl && (
              <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            )}
            <TouchableOpacity
              style={styles.commentButton}
              onPress={() => handleComment(post.id)}
            >
              <Text style={styles.commentButtonText}>Comment</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
  
      {/* CommentSection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCommentSectionVisible}
        onRequestClose={handleCloseCommentSection}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <CommentSection 
              communityId={communityId} 
              postId={commentedPostId} 
              onClose={handleCloseCommentSection} 
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  
  button: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  postsContainer: {
    marginTop: 24,
  },
  post: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  postText: {
    fontSize: 16,
    marginBottom: 8,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  commentButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    marginTop: 12,
  },
  commentButtonText: {
    color: "#ffffff",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '95%', // adjust as needed
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

});

export default PostScreen;
