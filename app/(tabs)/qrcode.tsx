import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import QRCodeScanner from "@/components/QRCodeScanner";
import { ThemedText } from "@/components/ThemedText";
import Machine from "@/types/Machine";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { useMachines } from "@/hooks/useMachines";
import { Button } from "@ui-kitten/components";
import { useFocusEffect } from "expo-router";

export default function QrCode() {
  const [data, setData] = useState<null | string>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [machine, setMachine] = useState<Partial<Machine>>({
    created_at: new Date()
  });
  const { machines, addMachine } = useMachines();

  useEffect(() => {
    if (data) {
      const existingMachine = machines.find((m) => m.uid === data);
      if (existingMachine) {
        setMachine(existingMachine);
      } else {
        setMachine({ uid: data, created_at: new Date() });
      }
    }
  }, [data]);

  const openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled) {
      setMachine({ ...machine, photo: pickerResult.assets[0].uri });
    }
  };

  const handleInputChange = (key: keyof Machine, value: string | number) => {
    setMachine({ ...machine, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      await addMachine(machine as Machine);
      setIsModalVisible(false);
      setMachine({ created_at: new Date() });
      setData(null);
      Alert.alert("Success", "Machine data saved successfully");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save machine data");
    }
  };

  const [render, setRender] = useState(false);

  useFocusEffect(() => {
    setRender(true);
    return () => {
      setRender(false);
    };
  });

  if (!render) return <View></View>;

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onScan={(data) => {
          setData(data);
          setIsModalVisible(true);
        }}
        fallBack={(requestPermission) => (
          <View style={styles.container}>
            <ThemedText style={{ textAlign: "center", fontSize: 22 }}>
              We need your permission to show the camera
            </ThemedText>
            <Button onPress={requestPermission}>grant permission</Button>
          </View>
        )}
      >
        {data && (
          <View>
            <ThemedText style={{ textAlign: "center", marginVertical: 4 }}>
              ID: {data}
            </ThemedText>
            {/* <Button
              title="Add/Edit Entry for following Machine"
              onPress={() => setIsModalVisible(true)}
            /> */}
          </View>
        )}
      </QRCodeScanner>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={styles.modalContent}>
            <ThemedText
              style={{ textAlign: "center", fontSize: 24, lineHeight: 30 }}
            >
              {machines.some((m) => m.uid === data)
                ? "Edit Machine Entry"
                : "Add Machine Entry"}
            </ThemedText>
            <ThemedTextInput
              label="Inlet Pressure"
              placeholder="Inlet Pressure"
              keyboardType="numeric"
              style={styles.input}
              value={machine.inletPressure?.toString()}
              onChangeText={(value) =>
                handleInputChange("inletPressure", parseFloat(value))
              }
            />
            <ThemedTextInput
              label="Outlet Pressure"
              placeholder="Outlet Pressure"
              keyboardType="numeric"
              style={styles.input}
              value={machine.outletPressure?.toString()}
              onChangeText={(value) =>
                handleInputChange("outletPressure", parseFloat(value))
              }
            />
            <ThemedTextInput
              label="Diff Pressure Indication"
              placeholder="Diff Pressure Indication"
              keyboardType="numeric"
              style={styles.input}
              value={machine.diffPressureIndication?.toString()}
              onChangeText={(value) =>
                handleInputChange("diffPressureIndication", parseFloat(value))
              }
            />
            <ThemedTextInput
              label="Oil Level"
              placeholder="Oil Level"
              keyboardType="numeric"
              style={styles.input}
              value={machine.oilLevel?.toString()}
              onChangeText={(value) =>
                handleInputChange("oilLevel", parseFloat(value))
              }
            />
            <TouchableOpacity onPress={openImagePickerAsync}>
              <ThemedText type="link">Pick a photo</ThemedText>
            </TouchableOpacity>
            {machine.photo && (
              <Image source={{ uri: machine.photo }} style={styles.image} />
            )}
            <View
              style={{
                width: "100%",
                flexDirection: "column",
                gap: 4
              }}
            >
              <Button onPress={handleSubmit}>Save</Button>
              <Button onPress={() => setIsModalVisible(false)}>Cancel</Button>
            </View>
          </ThemedView>
        </ThemedView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 0,
    gap: 14
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center"
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 5
  },
  button: {
    color: "blue",
    marginVertical: 10
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10
  }
});
