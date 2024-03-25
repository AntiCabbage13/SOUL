import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { fetchComments, submitComment } from "./CommunityHandler";

const CommentSection = ({ communityId, postId, onClose }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      const { success, comments: loadedComments } = await fetchComments(communityId, postId);
      if (success) {
        setComments(loadedComments);
      }
    };

    loadComments();
  }, [communityId, postId]);

  const handleSubmit = async () => {
    const { success } = await submitComment(communityId, postId, commentText);
    if (success) {
      // Reload comments
      const { success: fetchSuccess, comments: loadedComments } = await fetchComments(communityId, postId);
      if (fetchSuccess) {
        setComments(loadedComments);
      }
      setCommentText('');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>x</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Write Comment</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your comment..."
        multiline
        value={commentText}
        onChangeText={setCommentText}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <ScrollView style={styles.commentsContainer}>
        {comments.map((comment, index) => (
          <View key={index} style={styles.commentItem}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>U</Text>
            </View>
            <View style={styles.commentContent}>
              <Text>{comment.text}</Text>
              <Text style={styles.timestamp}>{new Date(comment.timestamp).toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
    marginTop: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'blue',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  commentsContainer: {
    marginTop: 16,
    maxHeight: 300,
    
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
  },
  commentContent: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 8,
  },
  timestamp: {
    marginTop: 4,
    fontSize: 12,
    color: '#888888',
  },
});

export default CommentSection;
