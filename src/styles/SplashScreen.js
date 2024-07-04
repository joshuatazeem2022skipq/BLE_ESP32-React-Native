import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import LOGO from "../assets/1.png"; // Adjust the path as needed

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate to Dashboard after 1 second
    const timer = setTimeout(() => {
      navigation.replace("Dashboard");
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={LOGO} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000", // Set background to black
  },
  logo: {
    width: 350, // Adjust width as needed
    height: 350, // Adjust height as needed
    resizeMode: "contain", // Maintain aspect ratio of the image
  },
});

export default SplashScreen;
