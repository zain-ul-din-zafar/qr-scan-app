import React, { useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Text as RNText
} from "react-native";
import {
  Text,
  Button,
  Modal,
  Card,
  Input,
  Radio,
  RadioGroup
} from "@ui-kitten/components";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import useReadings from "@/hooks/useReadings";
import useEquipments from "@/hooks/useEquipments";
import { useComposeEquipments } from "@/hooks/useComposeEquipments";

type OilPressureStatus = "Low" | "Good";
type NewOptionStatus = "on" | "off" | "isolated";

export default function ReadingScreen() {
  const { id } = useLocalSearchParams() as any as { id: string };
  const { addReading } = useReadings();
  const router = useRouter();
  const allEquipments = useComposeEquipments();
  const currEquipment = Object.values(allEquipments)
    .flat(1)
    .filter((v) => v.id == id)[0];

  const [inletPressure, setInletPressure] = useState<string>("1");
  const [outletPressure, setOutletPressure] = useState<string>("1");
  const [diffPressureIndication, setDiffPressureIndication] =
    useState<string>("");
  const [oilLevelImage, setOilLevelImage] = useState<string | null>(null);
  const [oilPressureStatus, setOilPressureStatus] =
    useState<OilPressureStatus>("Good");
  const [newOptionStatus, setNewOptionStatus] = useState<NewOptionStatus>("on");
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
      oilLevel: oilLevelImage!,
      oilPressureStatus,
      newOptionStatus // Include the new option status in the reading
    };

    await addReading(reading);
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Data has been recorded successfully."
    });
    router.push(`/`);
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
    <ScrollView style={styles.container}>
      <Text category="h3">Take Reading</Text>
      <Text style={{ marginTop: 8 }}>ID: {id}</Text>
      <Text style={{ marginTop: 4, marginBottom: 16 }}>
        Name: {currEquipment.name}
      </Text>

      <Text
        category="label"
        style={{
          marginBottom: 12
        }}
      >
        Status
      </Text>
      <RadioGroup
        selectedIndex={
          newOptionStatus === "on" ? 0 : newOptionStatus === "off" ? 1 : 2
        }
        onChange={(index) => {
          switch (index) {
            case 0:
              setNewOptionStatus("on");
              break;
            case 1:
              setNewOptionStatus("off");
              break;
            case 2:
              setNewOptionStatus("isolated");
              break;
          }
        }}
        style={styles.radioGroup}
      >
        <Radio>On</Radio>
        <Radio>Off</Radio>
        <Radio>Isolated</Radio>
      </RadioGroup>

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
        label="Diff Pressure Indication - %"
        placeholder="Enter diff pressure indication in %"
        keyboardType="numeric"
        value={diffPressureIndication}
        onChangeText={setDiffPressureIndication}
        status={errors.diffPressureIndication ? "danger" : "basic"}
        caption={errors.diffPressureIndication}
        style={styles.input}
      />

      <Text
        category="label"
        style={{
          marginBottom: 12
        }}
      >
        Oil Pressure Status
      </Text>
      <RadioGroup
        selectedIndex={oilPressureStatus === "Good" ? 1 : 0}
        onChange={(index) => setOilPressureStatus(index === 1 ? "Good" : "Low")}
        style={styles.radioGroup}
      >
        <Radio>Low</Radio>
        <Radio>Good</Radio>
      </RadioGroup>

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

      <View
        style={{
          height: 100
        }}
      ></View>

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    padding: 16,
    backgroundColor: "white"
  },
  input: {
    marginBottom: 16
  },
  radioGroup: {
    flexDirection: "row",
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
