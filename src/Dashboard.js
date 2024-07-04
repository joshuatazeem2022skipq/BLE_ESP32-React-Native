import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Appbar, RadioButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import BatteryIcon from "./BatteryIcon";
import BGImage from "./assets/background.png";
import Logo from "./assets/1.png";
import BT from "./assets/blues.png";
import { useNavigation } from "@react-navigation/native";
import { BleContext } from "./ContextApi/BleContext";

const { width, height } = Dimensions.get("window");

const Dashboard = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigation = useNavigation();
  const {
    bleData,
    handleChangeUnit,
    unit,
    handleZeroClick,
    selectedDevice,
    isConnected,
  } = useContext(BleContext);

  const handleLogin = () => {
    setShowLoginPopup(true);
    navigation.navigate("LoginPopup");
  };

  const handleBluetooth = () => {
    navigation.navigate("BluetoothScreen");
  };

  const formatWeight = (weight) => {
    return weight ? weight.toFixed(1) : "N/A";
  };

  const getBlockColor = (status) => {
    return status ? styles.greenBlock : styles.redBlock;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={BGImage} style={styles.backgroundImage}>
        <Appbar.Header style={styles.appBar}>
          <TouchableOpacity onPress={handleLogin} style={{ height: 40 }}>
            <Appbar.Action
              icon={() => <Icon name="menu" size={32} color="#fff" />}
            />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={Logo} style={styles.logo} />
          </View>
        </Appbar.Header>
        <ScrollView style={styles.scroll}>
          <View style={styles.content}>
            <View style={styles.centerCard}>
              <Text style={styles.cardTitle}>Front Weight</Text>
              <View style={styles.card}>
                <Text style={styles.cardValue}>
                  {formatWeight(bleData.frontWeight)}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <BatteryIcon
                  size={30}
                  batteryPercentage={bleData.lfBattery ?? "0"}
                />
                <Text style={styles.columnTitle}> LF</Text>
                <View
                  style={[styles.smallCard, getBlockColor(bleData.lfColor)]}
                >
                  <Text style={styles.columnValue}>
                    {formatWeight(bleData.lfWeight)}
                  </Text>
                  <Text style={styles.columnPercentage}>
                    {bleData.lfWeightP ?? "N/A"}%
                  </Text>
                </View>
              </View>
              <View style={styles.column}>
                <BatteryIcon
                  size={30}
                  batteryPercentage={bleData.rfBattery ?? "N/A"}
                />
                <Text style={styles.columnTitle}>RF</Text>
                <View
                  style={[styles.smallCard, getBlockColor(bleData.rfColor)]}
                >
                  <Text style={styles.columnValue}>
                    {formatWeight(bleData.rfWeight)}
                  </Text>
                  <Text style={styles.columnPercentage}>
                    {bleData.rfWeightP ?? "N/A"}%
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.centerCard, { marginTop: 20 }]}>
              <Text style={styles.cardTitle}>Cross Weight</Text>
              <View style={styles.card}>
                <Text style={styles.cardValue}>
                  {formatWeight(bleData.crossWeight)}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <BatteryIcon
                  size={30}
                  batteryPercentage={bleData.lrBattery ?? "N/A"}
                />
                <Text style={styles.columnTitle}>LR</Text>
                <View
                  style={[styles.smallCard, getBlockColor(bleData.lrColor)]}
                >
                  <Text style={styles.columnValue}>
                    {formatWeight(bleData.lrWeight)}
                  </Text>
                  <Text style={styles.columnPercentage}>
                    {bleData.lrWeightP ?? "N/A"}%
                  </Text>
                </View>
              </View>
              <View style={styles.column}>
                <BatteryIcon
                  size={30}
                  batteryPercentage={bleData.rrBattery ?? "N/A"}
                />
                <Text style={styles.columnTitle}>RR</Text>
                <View
                  style={[styles.smallCard, getBlockColor(bleData.rrColor)]}
                >
                  <Text style={styles.columnValue}>
                    {formatWeight(bleData.rrWeight)}
                  </Text>
                  <Text style={styles.columnPercentage}>
                    {bleData.rrWeightP ?? "N/A"}%
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.centerCard, { marginTop: 20 }]}>
              <Text style={styles.cardTitle}>Rear Weight</Text>
              <View style={styles.card}>
                <Text style={styles.cardValue}>
                  {formatWeight(bleData.rearWeight)}
                </Text>
              </View>
            </View>
            <View style={styles.totalWeightContainer}>
              <View style={styles.centerCard}>
                <Text style={styles.cardTitle}>Total Weight</Text>
                <View style={styles.card}>
                  <Text style={styles.cardValue}>
                    {formatWeight(bleData.totalWeight)}
                  </Text>
                </View>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton.Group
                  onValueChange={(value) => handleChangeUnit(value)}
                  value={unit}
                >
                  <View style={styles.radioOption}>
                    <RadioButton
                      value="kg"
                      color="#aaff00"
                      uncheckedColor="#F7FC03"
                    />
                    <Text style={styles.radioText}>Kg</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton
                      value="lbs"
                      color="#aaff00"
                      uncheckedColor="#F7FC03"
                    />
                    <Text style={styles.radioText}>Lbs</Text>
                  </View>
                </RadioButton.Group>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleZeroClick}>
              <View style={styles.centerCard}>
                <View style={styles.card1}>
                  <Text style={styles.cardValue1}>Zero</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.connectedContainer}>
              <TouchableOpacity
                onPress={handleBluetooth}
                style={styles.btImageContainer}
              >
                <Image source={BT} style={styles.btImage} />
              </TouchableOpacity>
              <View style={styles.connectionInfoContainer}>
                <Text
                  style={
                    selectedDevice ? styles.connected : styles.disconnected
                  }
                >
                  {selectedDevice ? selectedDevice.name : "-"}
                </Text>
                <Text
                  style={
                    selectedDevice ? styles.connected : styles.disconnected
                  }
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  appBar: {
    backgroundColor: "transparent",
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 3,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.02,
    marginRight: width * 0.1,
  },
  logo: {
    width: "60%",
    height: undefined,
    aspectRatio: 3,
    resizeMode: "contain",
  },

  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },
  centerCard: {
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    marginBottom: 1,
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#F7FC03",
  },
  card: {
    backgroundColor: "#aaff00",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    width: width * 0.3,
    justifyContent: "center",
  },
  card1: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    width: width * 0.3,
    justifyContent: "center",
  },
  cardValue: {
    fontSize: width * 0.04,
    color: "#000",
  },
  cardValue1: {
    fontSize: width * 0.05,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  column: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  columnTitle: {
    marginBottom: 1,
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#F7FC03",
  },
  smallCard: {
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    width: width * 0.32,
    height: height * 0.07,

    justifyContent: "center",
  },
  greenBlock: {
    backgroundColor: "#00ff00",
  },
  redBlock: {
    backgroundColor: "#ff0000",
  },
  columnValue: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#000",
  },
  columnPercentage: {
    fontSize: width * 0.04,
    color: "#000",
  },
  centerCard1: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  centerCard3: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 1,
    marginLeft: width * 0.23,
  },
  card5: {
    backgroundColor: "#aaff00",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    width: width * 0.3,
    height: height * 0.05,
    justifyContent: "center",
  },
  totalWeightContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 5,
    marginLeft: 105,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 40,
  },
  radioOption1: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 40,
  },
  radioText: {
    fontSize: 16,
    color: "#fff",
    marginRight: 2,
  },
  radioButtonWrapper: {
    marginLeft: 0,
  },
  centerCard4: {
    alignItems: "center",
    marginBottom: 1,
    marginTop: 2,
  },
  card1: {
    backgroundColor: "red",
    padding: 3,
    borderRadius: 8,
    width: width * 0.3,
    alignItems: "center",
    height: height * 0.05,
  },
  cardValue1: {
    fontSize: width * 0.06,
    color: "#000",
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  connectedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: "5%",
    paddingVertical: 10,
    width: "100%",
    marginTop: 5,
  },
  btImageContainer: {
    width: "20%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  connectionInfoContainer: {
    flex: 1,
    marginLeft: -8,
  },
  connected: {
    color: "#F7FC03",
    fontSize: 16,
    fontWeight: "bold",
  },
  disconnected: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default Dashboard;
