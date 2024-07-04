import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Dashboard from "./src/Dashboard";
import LoginPopup from "./src/LoginPopup";
import FileSettingsPopup from "./src/FileSettingsPopup";
import BluetoothScreen from "./src/BluetoothScreen"; // Adjust the path as needed
import NodeConfigScreen from "./src/NodeConfigScreen";
import { BleProvider } from "./src/ContextApi/BleContext";
import LoginCredentials from "./src/LoginCredentials";
import WiFiCredentials from "./src/WiFiCredentials";
import BleCredentials from "./src/BleCredentials";
import SplashScreen from "./src/styles/SplashScreen";

const Stack = createStackNavigator();

const FileSettingsPopupWrapper = ({ route, navigation }) => {
  const { onClose } = route.params;
  return <FileSettingsPopup navigation={navigation} onClose={onClose} />;
};

export default function App() {
  return (
    <BleProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack.Navigator initialRouteName="SplashScreen">
              <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LoginPopup"
                component={LoginPopup}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="FileSettingsPopup"
                component={FileSettingsPopupWrapper}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="BluetoothScreen"
                component={BluetoothScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="NodeConfigScreen"
                component={NodeConfigScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LoginCredentials"
                component={LoginCredentials}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="WiFiCredentials"
                component={WiFiCredentials}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="BleCredentials"
                component={BleCredentials}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </GestureHandlerRootView>
        </NavigationContainer>
      </SafeAreaProvider>
    </BleProvider>
  );
}
