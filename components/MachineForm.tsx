import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  Modal
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Machine from "@/types/Machine";
import { useMachines } from "@/hooks/useMachines";

interface MachineFormProps {
  machine?: Partial<Machine>;
  onClose: () => void;
}

const MachineForm: React.FC<MachineFormProps> = ({
  machine: initialMachine,
  onClose
}) => {
  const [machine, setMachine] = useState<Partial<Machine>>(
    initialMachine || { created_at: new Date() }
  );
  const { loadMachines } = useMachines();

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
      const existingMachines = await AsyncStorage.getItem("machines");
      const machines = existingMachines ? JSON.parse(existingMachines) : [];

      if (machine.uid) {
        const machineIndex = machines.findIndex(
          (m: Machine) => m.uid === machine.uid
        );
        if (machineIndex > -1) {
          machines[machineIndex] = machine;
        } else {
          machines.push(machine);
        }
      } else {
        machines.push(machine);
      }

      await AsyncStorage.setItem("machines", JSON.stringify(machines));
      await loadMachines();
      onClose();
      setMachine({ created_at: new Date() });
      Alert.alert("Success", "Machine data saved successfully");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save machine data");
    }
  };

  return (
    <ThemedView style={styles.modalContainer}>
      <ThemedView style={styles.modalContent}>
        <ThemedText
          style={{ textAlign: "center", fontSize: 24, lineHeight: 30 }}
        >
          {machine.uid ? "Edit Machine Entry" : "Add Machine Entry"}
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
        <View style={{ width: "100%", flexDirection: "column", gap: 4 }}>
          <Button title="Save" onPress={handleSubmit} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
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
  image: {
    width: 100,
    height: 100,
    marginVertical: 10
  }
});

export default MachineForm;
