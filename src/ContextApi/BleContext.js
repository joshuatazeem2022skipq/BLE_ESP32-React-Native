import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Buffer } from "buffer";
import BleManager from "react-native-ble-manager";
import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
} from "react-native";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const serviceid = "12345678-1234-1234-1234-123456789012";
const Zero = "9bad813d-370a-45e5-ac4d-bb4c2b65379f";
const characteristicUuid = "a5cd5a47-22eb-406f-8aa5-bf6a2cea1a8a"; // Replace with your actual characteristic UUID
const CHUNK_SIZE = 20;

export const BleContext = createContext();

export const BleProvider = ({ children }) => {
  const [bleData, setBleData] = useState({
    frontWeight: "",
    lfWeight: "",
    rfWeight: "",
    rfWeightP: "",
    rfBattery: "",
    lfWeightP: "",
    lfBattery: "",
    crossWeight: "",
    lrWeight: "",
    lrWeightP: "",
    lrBattery: "",
    rrWeight: "",
    rrWeightP: "",
    rrBattery: "",
    rearWeight: "",
    totalWeight: "",
    lfColor: "",
    rfColor: "",
    lrColor: "",
    rrColor: "",
  });
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unit, setUnit] = useState("kg");
  const [isLoginMode, setIsLoginMode] = useState(false);

  const checkConnectionStatus = async () => {
    if (selectedDevice) {
      const connected = await BleManager.isPeripheralConnected(
        selectedDevice.id
      );
      setIsConnected(connected);
    } else {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkConnectionStatus();
  }, [selectedDevice]);

  const sendChunkedData = async (data) => {
    const buffer = Buffer.from(data, "utf-8");

    for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
      const chunk = buffer.slice(i, i + CHUNK_SIZE);
      await BleManager.write(
        selectedDevice.id,
        serviceid,
        Zero,
        chunk.toJSON().data
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  const sendResponse = async (value) => {
    if (!selectedDevice || !isConnected) {
      console.error("No device selected or device not connected");
      return;
    }

    try {
      const response = JSON.stringify({ [value.toUpperCase()]: true });
      console.log(`Sending ${value} response: `, response);
      await sendChunkedData(response);
      console.log(`${value} response from Device: `, response);

      if (value.toUpperCase() === "LOGIN") {
        setIsLoginMode(false);
      }
    } catch (error) {
      console.error(`Error sending ${value} response: `, error);
    }
  };

  const sendWiFiSwitchResponse = async (value) => {
    if (!selectedDevice || !isConnected) {
      console.error("No device selected or device not connected");
      return;
    }

    try {
      const response = JSON.stringify({ WiFiSwitch: value });
      console.log("Sending WiFiSwitch response: ", response);
      await sendChunkedData(response);
      console.log("WiFiSwitch response sent: ", response);

      if (value) {
        setTimeout(async () => {
          try {
            const falseResponse = JSON.stringify({ WiFiSwitch: false });
            console.log("Sending false WiFiSwitch response: ", falseResponse);
            await sendChunkedData(falseResponse);
            console.log("False WiFiSwitch response sent: ", falseResponse);
          } catch (error) {
            console.error("Error sending false WiFiSwitch response: ", error);
          }
        }, 200);
      }
    } catch (error) {
      console.error("Error sending WiFiSwitch response: ", error);
    }
  };

  const handleChangeUnit = (value) => {
    setUnit(value);
    sendResponse(value);
  };

  const handleZeroClick = async () => {
    await sendResponse("zero");
  };

  const setBleDataOptimized = useCallback((newData) => {
    setBleData((prevData) => {
      const updatedData = {};
      let hasChanged = false;
      for (const key in newData) {
        if (newData[key] !== prevData[key]) {
          updatedData[key] = newData[key];
          hasChanged = true;
        }
      }
      return hasChanged ? { ...prevData, ...updatedData } : prevData;
    });
  }, []);

  const handleUpdateValueForCharacteristic = ({
    value,
    characteristic,
    peripheral,
  }) => {
    if (isLoginMode) return; // Skip processing updates during login mode

    const data = Buffer.from(value).toString("utf-8");
    const jsonData = JSON.parse(data);

    if (characteristic === characteristicUuid) {
      setBleData(jsonData);
    }
  };

  const handleDisconnectedPeripheral = (data) => {
    if (data.peripheral === selectedDevice?.id) {
      setIsConnected(false);
      setSelectedDevice(null);
      setBleData({
        frontWeight: "",
        lfWeight: "",
        rfWeight: "",
        rfWeightP: "",
        rfBattery: "",
        lfWeightP: "",
        lfBattery: "",
        crossWeight: "",
        lrWeight: "",
        lrWeightP: "",
        lrBattery: "",
        rrWeight: "",
        rrWeightP: "",
        rrBattery: "",
        rearWeight: "",
        totalWeight: "",
        lfColor: "",
        rfColor: "",
        lrColor: "",
        rrColor: "",
      });
    }
  };

  useEffect(() => {
    BleManager.start({ showAlert: false }).then(() => {
      console.log("BleManager initialized");
    });

    const updateListener = bleManagerEmitter.addListener(
      "BleManagerDidUpdateValueForCharacteristic",
      handleUpdateValueForCharacteristic
    );

    const disconnectListener = bleManagerEmitter.addListener(
      "BleManagerDisconnectPeripheral",
      handleDisconnectedPeripheral
    );

    return () => {
      updateListener.remove();
      disconnectListener.remove();
    };
  }, [isLoginMode]);

  const contextValue = useMemo(
    () => ({
      bleData,
      setBleData: setBleDataOptimized,
      selectedDevice,
      setSelectedDevice,
      isConnected,
      setIsConnected,
      unit,
      handleChangeUnit,
      handleZeroClick,
      sendWiFiSwitchResponse,
      isLoginMode,
      setIsLoginMode,
    }),
    [
      bleData,
      setBleDataOptimized,
      selectedDevice,
      isConnected,
      unit,
      handleChangeUnit,
      handleZeroClick,
      sendWiFiSwitchResponse,
      isLoginMode,
      setIsLoginMode,
    ]
  );

  return (
    <BleContext.Provider value={contextValue}>{children}</BleContext.Provider>
  );
};
