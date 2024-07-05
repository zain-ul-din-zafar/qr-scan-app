import React, { useState } from "react";
import { View, StyleSheet, StatusBar, Image } from "react-native";
import { Text, Button, Input, Modal, Card } from "@ui-kitten/components";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import useReadings from "@/hooks/useReadings";
import useEquipments from "@/hooks/useEquipments";

export default function ReadingScreen() {
  const { id } = useLocalSearchParams() as any as { id: string };
  const { addReading } = useReadings();
  const { equipments } = useEquipments();
  const router = useRouter();

  const [inletPressure, setInletPressure] = useState<string>("");
  const [outletPressure, setOutletPressure] = useState<string>("");
  const [diffPressureIndication, setDiffPressureIndication] =
    useState<string>("");
  const [oilLevelImage, setOilLevelImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!inletPressure) newErrors.inletPressure = "Inlet Pressure is required.";
    if (!outletPressure)
      newErrors.outletPressure = "Outlet Pressure is required.";
    if (!diffPressureIndication)
      newErrors.diffPressureIndication =
        "Diff Pressure Indication is required.";
    if (!oilLevelImage)
      newErrors.oilLevelImage = "Oil Level image is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    const reading = {
      uid: id,
      inletPressure: parseFloat(inletPressure),
      outletPressure: parseFloat(outletPressure),
      created_at: new Date(), // Automatically add current date and time
      diffPressureIndication: parseFloat(diffPressureIndication),
      oilLevel: oilLevelImage!
    };

    await addReading(reading);
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Data has been recorded successfully."
    });

    router.push(`/readings?id=${id}&name=${equipments[id]}`);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setOilLevelImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text category="h3">Take Reading</Text>
      <Text>ID: {id}</Text>

      <Input
        label="Inlet Pressure"
        placeholder="Enter inlet pressure"
        keyboardType="numeric"
        value={inletPressure}
        onChangeText={setInletPressure}
        status={errors.inletPressure ? "danger" : "basic"}
        caption={errors.inletPressure}
        style={styles.input}
      />

      <Input
        label="Outlet Pressure"
        placeholder="Enter outlet pressure"
        keyboardType="numeric"
        value={outletPressure}
        onChangeText={setOutletPressure}
        status={errors.outletPressure ? "danger" : "basic"}
        caption={errors.outletPressure}
        style={styles.input}
      />

      <Input
        label="Diff Pressure Indication"
        placeholder="Enter diff pressure indication"
        keyboardType="numeric"
        value={diffPressureIndication}
        onChangeText={setDiffPressureIndication}
        status={errors.diffPressureIndication ? "danger" : "basic"}
        caption={errors.diffPressureIndication}
        style={styles.input}
      />

      <Button onPress={pickImage} style={styles.button}>
        Take Picture of Oil Level
      </Button>
      {oilLevelImage && (
        <Image source={{ uri: oilLevelImage }} style={styles.image} />
      )}
      {errors.oilLevelImage && (
        <Text status="danger">{errors.oilLevelImage}</Text>
      )}

      <Button onPress={handleSubmit} style={styles.button}>
        Submit Reading
      </Button>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    padding: 16,
    flex: 1,
    backgroundColor: "white"
  },
  input: {
    marginBottom: 16
  },
  button: {
    marginVertical: 8
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 16
  }
});
