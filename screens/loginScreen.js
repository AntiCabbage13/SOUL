import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Parse from "parse/react-native";
import { useAppContext } from "../AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHeightForAgeReferenceDataFromAPI } from "../classes/calcualteHeightForage";
import { getWeightForAgeReferenceDataFromAPI } from "../classes/calcualateweightForage";
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isIncorrectLogin, setIsIncorrectLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAppContext();
  const { userData, setUserData } = useAppContext(); // Assuming you have a userData object in your context

  const checkChildDataForUser = (loggedInUser) => {
    const ChildData = Parse.Object.extend("ChildData");
    const query = new Parse.Query(ChildData);
    console.log("this is loggedinUser", loggedInUser);
  
    // Assuming 'user' is a pointer in the ChildData class that refers to the user
    query.equalTo("user", loggedInUser);
  
    query
      .first()
      .then((childData) => {
        // Whether childData exists or not, navigate to the home screen
        navigation.navigate("Home");
  
        if (childData) {
          // ChildData found, set the childObjectId in the global state
          const childObjectId = childData.id;
          const dateOfBirth = childData.get("DateOfBirth");
          const gender = childData.get("gender");
          console.log(
            "childobjectID and dateofbirth",
            dateOfBirth,
            "and ",
            childObjectId,
            "and",
            gender
          );
          // Set childObjectId in global state
          setUserData((prevUserData) => ({
            ...prevUserData,
            childObjectId,
          }));
          saveDataToLocal("childDatainfo", {
            childObjectId,
            dateOfBirth,
            gender,
          });
  
          console.log("you got", childObjectId);
        }
      })
      .catch((error) => {
        console.error("Error fetching child data:", error);
        Alert.alert("Error", "An error occurred while fetching ChildData.");
      });
  };
  
  const saveDataToLocal = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      console.log("Data saved to local storage successfully!");
      console.log("Value before saving to local storage:", value);
      getHeightForAgeReferenceDataFromAPI();
      getWeightForAgeReferenceDataFromAPI();
    } catch (error) {
      console.error("Error saving data to local storage:", error);
    }
  };

  const handleLogin = () => {
    // Clear error messages and loading state
    setIsIncorrectLogin(false);
    setIsLoading(true);

    // Assuming you have a class called 'User' and a field 'role' in the Parse database
    const User = Parse.Object.extend("User");

    const query = new Parse.Query(User);
    query.equalTo("username", email);

    query
      .first()
      .then((user) => {
        setIsLoading(false);

        if (user) {
          // User found, check if password is correct
          Parse.User.logIn(email, password)
            .then((loggedInUser) => {
              console.log("User signed in:", loggedInUser);

              // Extract user information
              const objectId = loggedInUser.id;
              const role = loggedInUser.get("role");
              const username = loggedInUser.get("username");

              // Save user information to local storage
              const userInfo = { objectId, role, username };
              AsyncStorage.setItem("userInfo", JSON.stringify(userInfo))
                .then(() => {
                  console.log(
                    "User information saved to local storage:",
                    userInfo
                  );

                  // Navigate based on user role
                  if (role === "ph") {
                    navigation.navigate("HealthcareProfessionalHome", {
                      objectId,
                    });
                  } else {
                    checkChildDataForUser(loggedInUser);
                  }
                })
                .catch((error) => {
                  console.error(
                    "Error saving user information to local storage:",
                    error
                  );
                });
            })
            .catch((error) => {
              console.error("Error signing in:", error);
              setIsIncorrectLogin(true);
            });
        } else {
          // User not found, show an error message
          setIsIncorrectLogin(true);
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setIsLoading(false);
        setIsIncorrectLogin(true);
      });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Text style={styles.heading}>Sign In</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email..."
            onChangeText={(text) => setEmail(text)}
            value={email}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            value={password}
            textContentType="password"
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            {isLoading ? (
              <ActivityIndicator color="green" />
            ) : (
              <Text style={styles.buttonText}>Sign in</Text>
            )}
          </TouchableOpacity>

          {isIncorrectLogin && (
            <View>
              <Text style={styles.errorMessage}>
                Wrong email or password. Please try again.
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.bottomContainer, styles.bottomMargin]}>
          <Text style={styles.bottomText}>Don't have an account yet?</Text>
          <TouchableOpacity
            style={styles.bottomLink}
            onPress={() => navigation.navigate("Registration")}
          >
            <Text style={styles.bottomLinkText}>Register here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  content: {
    width: "100%",
    maxWidth: 400,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center", // Align text to the center
  },
  formContainer: {
    alignItems: "center", // Center the form elements
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    padding: 8,
    borderColor: "green",
    borderRadius: 40,
  },
  button: {
    width: 150,
    padding: 8,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 40,
    backgroundColor: "transparent",
    alignItems: "center",
    alignSelf: "center", // Align button to the center
  },
  buttonText: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomText: {
    marginRight: 8,
    fontSize: 12,
  },
  bottomLink: {
    borderWidth: 0, // Remove border from TouchableOpacity
  },
  bottomLinkText: {
    color: "green",
    textDecorationLine: "underline",
    fontSize: 15,
    fontWeight: "bold",
  },
  bottomMargin: {
    marginTop: 100,
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default LoginScreen;
