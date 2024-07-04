import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BleContext } from "./ContextApi/BleContext";
import BleManager from "react-native-ble-manager";
import { Buffer } from "buffer";

const CHARACTERISTIC_UUID_setupMode = "87651234-4321-4321-4321-876543210987";
const serviceid = "12345678-1234-1234-1234-123456789012";
const CHUNK_SIZE = 20;

const FileSettingsPopup = ({ navigation }) => {
  const [setupMode, setSetupMode] = useState(false);
  const [nodeConfig, setNodeConfig] = useState(false);
  const [login, setLogin] = useState(false);
  const [wiFi, setWiFi] = useState(false);
  const [ble, setBle] = useState(false);
  const [wiFiSwitch, setWiFiSwitch] = useState(false); // New state for WiFiSwitch
  const [errorMessage, setErrorMessage] = useState("");
  const { selectedDevice, isConnected, sendWiFiSwitchResponse } =
    useContext(BleContext); // Add sendWiFiSwitchResponse

  useEffect(() => {
    if (!selectedDevice || !isConnected) {
      Alert.alert("Device not connected", "Please connect to a device first.");
      navigation.navigate("Dashboard");
    }
  }, [selectedDevice, isConnected, navigation]);

  const sendChunkedData = async (data) => {
    const buffer = Buffer.from(data, "utf-8");

    for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
      const chunk = buffer.slice(i, i + CHUNK_SIZE);
      await BleManager.write(
        selectedDevice.id,
        serviceid,
        CHARACTERISTIC_UUID_setupMode,
        chunk.toJSON().data
      );
      await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust delay between chunks if necessary
    }
  };

  const sendSetupModeResponse = async (value) => {
    if (!selectedDevice || !isConnected) {
      console.error("No device selected or device not connected");
      return;
    }

    try {
      const response = JSON.stringify({ setupMode: value });
      console.log("Sending setup mode response: ", response);
      await sendChunkedData(response);
      console.log("Setup Mode response sent: ", response);

      // If setup mode is enabled, send false response after 3 seconds
      if (value) {
        setTimeout(async () => {
          try {
            const falseResponse = JSON.stringify({ setupMode: false });
            console.log("Sending false setup mode response: ", falseResponse);
            await sendChunkedData(falseResponse);
            console.log("False Setup Mode response sent: ", falseResponse);
          } catch (error) {
            console.error("Error sending false Setup Mode response: ", error);
          }
        }, 5000);
      }
    } catch (error) {
      console.error("Error sending Setup Mode response: ", error);
    }
  };

  const handleSave = () => {
    if (!setupMode && !nodeConfig && !login && !wiFi && !ble && !wiFiSwitch) {
      // Include wiFiSwitch
      setErrorMessage(
        "Please enable Setup Mode, Node Configuration, Login Credentials, WiFi, BLE, or WiFiSwitch"
      );
      return;
    }

    if (!nodeConfig && !login && !wiFi && !ble && !wiFiSwitch) {
      // Include wiFiSwitch
      navigation.navigate("Dashboard");
    } else if (nodeConfig) {
      setNodeConfig(false);
      navigation.navigate("NodeConfigScreen");
    } else if (login) {
      setLogin(false);
      navigation.navigate("LoginCredentials");
    } else if (wiFi) {
      setWiFi(false);
      navigation.navigate("WiFiCredentials");
    } else if (wiFiSwitch) {
      // Add handling for wiFiSwitch
      setWiFiSwitch(false);
      sendWiFiSwitchResponse(true); // Send the WiFiSwitch response
      navigation.navigate("Dashboard"); // Navigate to Dashboard after sending the response
    } else {
      setBle(false);
      navigation.navigate("BleCredentials");
    }
  };

  const onClose = () => {
    navigation.navigate("Dashboard");
  };

  const handleSwitchChange = (switchType, value) => {
    setSetupMode(switchType === "setupMode" ? value : false);
    setNodeConfig(switchType === "nodeConfig" ? value : false);
    setLogin(switchType === "login" ? value : false);
    setWiFi(switchType === "wiFi" ? value : false);
    setBle(switchType === "ble" ? value : false);
    setWiFiSwitch(switchType === "wiFiSwitch" ? value : false); // Add wiFiSwitch handling
    setErrorMessage("");

    if (switchType === "setupMode") {
      sendSetupModeResponse(value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="cancel" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>File Settings</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Setup Mode:</Text>
          <Switch
            value={setupMode}
            onValueChange={(value) => handleSwitchChange("setupMode", value)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Node Configuration:</Text>
          <Switch
            value={nodeConfig}
            onValueChange={(value) => handleSwitchChange("nodeConfig", value)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Login Credentials:</Text>
          <Switch
            value={login}
            onValueChange={(value) => handleSwitchChange("login", value)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>WiFi Credentials:</Text>
          <Switch
            value={wiFi}
            onValueChange={(value) => handleSwitchChange("wiFi", value)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>BLE Credentials:</Text>
          <Switch
            value={ble}
            onValueChange={(value) => handleSwitchChange("ble", value)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Switch to WebPage:</Text>
          <Switch
            value={wiFiSwitch}
            onValueChange={(value) => handleSwitchChange("wiFiSwitch", value)}
          />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
        <View>
          {errorMessage !== "" && (
            <Text style={styles.error}>{errorMessage}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  content: {
    width: "80%",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "600",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 20,
    width: 250,
    height: 50,
  },
  button: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FileSettingsPopup;
