import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HelpScreen = () => {
  const faqs = [
    {
      question: 'What is a Z score in child growth?',
      answer:
        'A Z score in child growth is a statistical measure that indicates how many standard deviations a child\'s measurement (such as height, weight, or BMI) is from the mean value for children of the same age and sex.',
    },
    {
      question: 'What is the importance of calculating child growth Z score?',
      answer:
        'Calculating child growth Z scores helps healthcare professionals assess a child\'s growth and development relative to their peers. It can identify growth abnormalities or deviations from the norm, allowing for early intervention if necessary.',
    },
    {
      question: 'What is the normal Z score range for child growth?',
      answer:
        'The normal Z score range for child growth is typically considered to be between -2 and +2. Z scores outside of this range may indicate growth abnormalities or deviations from the norm.',
    },
    {
      question: 'Z score ranges and their meanings',
      answer:
        'Z scores are interpreted as follows:\n- Z score less than -2: Indicates a measurement significantly below the mean, suggesting stunted growth or undernutrition.\n- Z score between -2 and +2: Falls within the normal range, indicating average growth.\n- Z score greater than +2: Indicates a measurement significantly above the mean, suggesting accelerated growth or risk of overweight/obesity.',
    },
  ];

  const [toggleState, setToggleState] = useState(Array(faqs.length).fill(false));
  const [showPolicy, setShowPolicy] = useState(false);

  const toggleFAQ = (index) => {
    setToggleState(
      toggleState.map((item, i) => (i === index ? !item : item))
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>FAQs</Text>

      {faqs.map((faq, index) => (
        <View key={index} style={[styles.faqItem, { borderColor: 'green' }]}>
          <TouchableOpacity onPress={() => toggleFAQ(index)}>
            <View style={styles.questionContainer}>
              <Text style={styles.question}>{faq.question}</Text>
              <Ionicons
                name={toggleState[index] ? 'chevron-up-outline' : 'chevron-down-outline'}
                size={24}
                color="black"
              />
            </View>
          </TouchableOpacity>
          {toggleState[index] && <Text style={styles.answer}>{faq.answer}</Text>}
        </View>
      ))}

      <Text style={[styles.title, { marginTop: 20 }]}>Contact Information</Text>

      <Text style={styles.subtitle}>For Child Health Concerns:</Text>
      <Text style={styles.infoText}>
        If you have any concerns about your child's health or development, please send a direct message to any available healthcare professional for assistance.
      </Text>

      <Text style={styles.subtitle}>For Technical Issues:</Text>
      <Text style={styles.infoText}>
        For technical issues or inquiries related to this application, please send an email to{' '}
        <Text style={styles.email}>ndixchilddev@gmail.com</Text>.
      </Text>

      <TouchableOpacity onPress={() => setShowPolicy(!showPolicy)}>
        <Text style={[styles.title, { marginTop: 20 }]}>
          {showPolicy ? 'Read Less' : 'Read More'} User Policy
        </Text>
      </TouchableOpacity>

      {showPolicy && (
        <View style={styles.policyContainer}>
          <Text style={styles.policyTitle}>User Policy</Text>
          <Text style={styles.policyText}>
            <Text style={styles.policySubtitle}>Interactions with Other Users:</Text> All users must ensure respectful interactions with others. Obscene, nudity, tribalism, and disrespectful behavior are strictly prohibited. Every user must respect other people's views.
          </Text>
          <Text style={styles.policyText}>
            <Text style={styles.policySubtitle}>Content Sharing:</Text> The platform is designed to facilitate easy management of child growth and development. Therefore, all content shared on the platform must be related to child growth and development. Issues unrelated to this topic cannot be addressed through the system.
          </Text>
          <Text style={styles.policyText}>
            <Text style={styles.policySubtitle}>Personal Data Sharing:</Text> All personal data shared in chats remains private between parents and healthcare professionals. Community data is made available to users.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 16,
  },
  email: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  faqItem: {
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  answer: {
    fontSize: 16,
  },
  policyContainer: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: 'green',
    marginTop: 20,
    padding: 10,
  },
  policyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  policySubtitle: {
    fontWeight: 'bold',
  },
  policyText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default HelpScreen;
