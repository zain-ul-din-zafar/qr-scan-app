import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import QRCodeScanner from "@/components/QRCodeScanner";
import { Button, Text, Modal, Card, Input } from "@ui-kitten/components";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect } from "expo-router";
import useEquipments from "@/hooks/useEquipments";
import useKeyboardSize from "@/hooks/useKeyboardSize";

export default function AddEquipment() {
  const [data, setData] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [equipmentName, setEquipmentName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { equipments, addEquipment, deleteEquipment, loadEquipments } =
    useEquipments();

  const keyboardSize = useKeyboardSize();

  useEffect(() => setEquipmentName(equipments[data] || ""), [equipments, data]);

  const saveData = async () => {
    if (equipmentName.trim() === "") {
      setError("Equipment name is required");
      return;
    }
    // check if duplicate item name
    if (Object.values(equipments).includes(equipmentName.trim())) {
      setError("Equipment Name Already Taken.");
      return;
    }

    try {
      await addEquipment(data, equipmentName.trim());
      setData("");
      setEquipmentName("");
      setVisible(false);
      showToast();
    } catch (error) {
      console.error(error);
    }
  };

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Equipment data saved successfully."
    });
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
    <View style={{ flex: 1 }}>
      <QRCodeScanner
        fallBack={(requestPermissions) => {
          return (
            <View style={styles.qrFallBack}>
              <Button onPress={requestPermissions}>
                Grant Camera Permissions
              </Button>
            </View>
          );
        }}
        onScan={(data) => {
          setData(data);
          setVisible(true);
        }}
      >
        <View>
          {data && (
            <Text style={styles.whiteText} category="h6">
              ID: {data}
            </Text>
          )}
        </View>
      </QRCodeScanner>

      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={styles.modalCardContainer}
        >
          <Card
            disabled={true}
            style={[
              styles.modalCard,
              {
                marginBottom: keyboardSize
              }
            ]}
          >
            <Text category="h6" style={styles.modalText}>
              Add Equipment
            </Text>
            <Input
              label="QR Data"
              value={data}
              disabled={true}
              style={styles.modalInput}
            />
            <Input
              label="Equipment Name"
              placeholder="Enter equipment name"
              value={equipmentName}
              onChangeText={setEquipmentName}
              style={styles.modalInput}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Button onPress={saveData} style={styles.modalButton}>
              Save
            </Button>
          </Card>
        </KeyboardAwareScrollView>
      </Modal>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    justifyContent: "center",
    padding: 20
  },
  qrFallBack: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  whiteText: {
    color: "white"
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalCardContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalCard: {
    width: "120%",
    padding: 20
  },
  modalText: {
    marginBottom: 20
  },
  modalInput: {
    marginBottom: 20
  },
  modalButton: {
    marginTop: 20
  },
  errorText: {
    color: "red",
    marginTop: 5
  }
});
