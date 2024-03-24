// ... (imports and other code remain unchanged)

const PostScreen = () => {
  // ... (existing state variables and functions remain unchanged)

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
            <TouchableOpacity key={index} style={styles.communityRow}>
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
  // ... (existing styles remain unchanged)

  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PostScreen;
