import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Parse from 'parse/react-native';

Parse.initialize(
  'VXLSRSLFzlwWVZnGLbF57Cm9JgBU1nilXN76HYFA',
  'RAzzzAhMZpT8AwpJIHhLubChsR8m7yMvJ1SPvzjW'
);
Parse.serverURL = 'https://parseapi.back4app.com/';

const ArticleUploadScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [articleType, setArticleType] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false); // Reset loading state on component mount
  }, []);

  const submitArticle = async () => {
    if (!title || !content || !articleType) {
      Alert.alert('Incomplete Submission', 'Please fill in all fields');
      return;
    }

    if (title.length > 40) {
      Alert.alert('Invalid Title', 'Title should be a maximum of 40 characters');
      return;
    }

    // Map articleType to the corresponding articleNumber
    const articleNumber = articleType === 'Announcement' ? 2 : 1;

    // Create a new object in the "Article" class on Back4App
    const Article = new Parse.Object('Article');
    Article.set('title', title);
    Article.set('body', content);
    Article.set('ArticleNumber', articleNumber);

    // Add scheduledDate for announcements
    if (articleType === 'Announcement') {
      Article.set('scheduledDate', scheduledDate);
    }

    setLoading(true); // Set loading state when submitting

    try {
      await Article.save();

      // Clear form fields after successful submission
      setTitle('');
      setContent('');
      setArticleType('');
      setScheduledDate(new Date());

      Alert.alert('Submission Successful', 'Article submitted successfully!');
    } catch (error) {
      console.error('Error submitting article:', error);
      Alert.alert(
        'Submission Error',
        'An error occurred while submitting the article. Please try again.'
      );
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const hideDatePickerModal = () => {
    setShowDatePicker(false);
  };

  const handleDateChange = (event, selectedDate) => {
    hideDatePickerModal();
    if (selectedDate) {
      setScheduledDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Article Type</Text>
          <View style={styles.buttonRow}>
            <Button
              title="Announcement"
              onPress={() => setArticleType('Announcement')}
              color={articleType === 'Announcement' ? 'darkgreen' : 'lightgreen'}
            />
            <Button
              title="Article"
              onPress={() => setArticleType('Article')}
              color={articleType === 'Article' ? 'darkgreen' : 'lightgreen'}
            />
          </View>
        </View>

        {articleType === 'Announcement' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scheduled Date</Text>
            <Button title="Pick Date" onPress={showDatePickerModal} />
            {showDatePicker && (
              <DateTimePicker
                value={scheduledDate}
                mode="datetime"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Title</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter title"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter content"
            multiline
            numberOfLines={4}
            value={content}
            onChangeText={(text) => setContent(text)}
          />
        </View>

        <View style={styles.section}>
          <Button title="Submit" onPress={submitArticle} disabled={loading} />
          {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#003300',
    borderStyle: 'dotted',
    borderRadius: 10,
    padding: 8,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'lightgreen',
    padding: 8,
    borderRadius: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'transparent',
    borderRadius: 30,
    borderColor: 'lightgreen',
    borderWidth: 5,
    borderStyle: 'dashed',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'green',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ArticleUploadScreen;
