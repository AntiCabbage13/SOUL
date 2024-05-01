import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Parse from 'parse/react-native';

Parse.initialize(
  'VXLSRSLFzlwWVZnGLbF57Cm9JgBU1nilXN76HYFA',
  'RAzzzAhMZpT8AwpJIHhLubChsR8m7yMvJ1SPvzjW'
);
Parse.serverURL = 'https://parseapi.back4app.com/';

const ArticleItem = ({ item }) => {
  const maxCharactersToShow = 150;
  const [expanded, setExpanded] = useState(false);

  const displayContent =
    item.get('body').length > maxCharactersToShow
      ? `${item.get('body').slice(0, maxCharactersToShow)}...`
      : item.get('body');

  const toggleReadMore = () => {
    setExpanded(!expanded);
  };

  return (
    <View
      style={
        item.get('ArticleNumber') === 2
          ? [styles.container, styles.announcementContainer]
          : [styles.container, styles.articleContainer]
      }
    >
      <Text style={[styles.title, styles.tagText, item.get('ArticleNumber') === 2 ? styles.announcementTag : styles.articleTag]}>
        {item.get('ArticleNumber') === 2 ? 'Announcement' : 'Article'}
      </Text>
      <Text style={styles.title}>{item.get('title')}</Text>
      <Text style={styles.body}>{expanded ? item.get('body') : displayContent}</Text>
      {item.get('ArticleNumber') === 2 && (
        <Text style={styles.scheduledDate}>
          Scheduled Date: {item.get('scheduledDate') ? item.get('scheduledDate').toLocaleString() : 'No scheduled date'}
        </Text>
      )}
      {item.get('body').length > maxCharactersToShow && (
        <Text style={styles.readMoreLink} onPress={toggleReadMore}>
          {expanded ? 'Read Less' : 'Read More'}
        </Text>
      )}
    </View>
  );
};

const ArticleDisplayScreen = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const query = new Parse.Query('Article');
      query.descending('createdAt'); // Sort by creation time in descending order
      const result = await query.find();
      setArticles(result);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArticleItem item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, 
    paddingHorizontal: 16, 
    paddingBottom: 16,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  articleContainer: {
    borderWidth: 2,
    borderColor: 'lightblue',
    borderRadius: 10,
  },
  announcementContainer: {
    borderWidth: 2,
    borderColor: 'green',
    borderStyle: 'dotted',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
  },
  scheduledDate: {
    fontSize: 14,
    marginTop: 8,
    color: 'gray',
  },
  readMoreLink: {
    color: 'blue',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  tagText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  articleTag: {
    color: 'green',
  },
  announcementTag: {
    color: 'red', 
  },
});

export default ArticleDisplayScreen;
