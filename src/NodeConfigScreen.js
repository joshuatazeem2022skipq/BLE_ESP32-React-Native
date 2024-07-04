import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import BleManager from "react-native-ble-manager";
import { Buffer } from "buffer";
import { BleContext } from "./ContextApi/BleContext";

const CHARACTERISTIC_UUID_nodeConfiguration =
  "29d16b06-534f-41a1-85f7-260cf91a217f";
const serviceid = "12345678-1234-1234-1234-123456789012";
const CHUNK_SIZE = 20;

const NodeConfigScreen = ({ navigation }) => {
  const [nodeConfigData, setNodeConfigData] = useState({
    id: "",
    idToSet: "",
    hx711Calibration: "",
  });

  const { selectedDevice, isConnected } = useContext(BleContext);

  const sendChunkedData = async (data) => {
    const buffer = Buffer.from(data, "utf-8");

    for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
      const chunk = buffer.slice(i, i + CHUNK_SIZE);
      await BleManager.write(
        selectedDevice.id,
        serviceid,
        CHARACTERISTIC_UUID_nodeConfiguration,
        chunk.toJSON().data
      );
      console.log("Chunk sent: ", chunk.toString()); // Log each chunk sent
      await new Promise((resolve) => setTimeout(resolve, 100)); // Increase delay between chunks
    }
  };

  const handleNodeConfigSave = async () => {
    if (!selectedDevice || !isConnected) {
      Alert.alert("Device not connected", "Please connect to a device first.");
      return;
    }

    try {
      const configData = JSON.stringify(nodeConfigData);
      console.log("Sending node configuration data: ", configData);

      await sendChunkedData(configData);

      console.log("Node configuration data sent: ", configData);
      navigation.navigate("Dashboard");
    } catch (error) {
      console.error("Error sending node configuration data: ", error);
      Alert.alert("Error", "Failed to send node configuration data.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formHeading}>Node Configuration</Text>
      <TextInput
        style={styles.input}
        placeholder="ID"
        value={nodeConfigData.id}
        onChangeText={(text) =>
          setNodeConfigData({ ...nodeConfigData, id: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="ID to Set"
        value={nodeConfigData.idToSet}
        onChangeText={(text) =>
          setNodeConfigData({ ...nodeConfigData, idToSet: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="HX711 Calibration"
        value={nodeConfigData.hx711Calibration}
        onChangeText={(text) =>
          setNodeConfigData({ ...nodeConfigData, hx711Calibration: text })
        }
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleNodeConfigSave}
      >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  formHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 100,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default NodeConfigScreen;
