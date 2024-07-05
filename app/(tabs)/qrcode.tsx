import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import QRCodeScanner from "@/components/QRCodeScanner";
import { ThemedText } from "@/components/ThemedText";
import { Button, Modal, Card, Text } from "@ui-kitten/components";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import useEquipments from "@/hooks/useEquipments";

export default function QrCode() {
  const [render, setRender] = useState(false);
  const { equipments } = useEquipments();
  const [data, setData] = useState<null | string>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigator = useNavigation();

  useFocusEffect(() => {
    setRender(true);
    return () => {
      setRender(false);
    };
  });

  const handleAddEquipment = () => {
    setModalVisible(false);
    navigator.navigate("add-equipment" as never);
  };

  const router = useRouter();

  if (!render) return <View></View>;

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onScan={(data) => {
          setData(data);

          // Check if equipment ID exists
          const found = Object.keys(equipments).includes(data);
          if (!found) {
            // Equipment not found, show modal to add equipment
            setModalVisible(true);
          } else {
            // Equipment found, implement your logic here
            // For now, just log a message
            const params = new URLSearchParams({
              id: data
            }).toString();
            router.push(`/reading?${params}`);
          }
        }}
        fallBack={(requestPermission) => (
          <View style={styles.container}>
            <ThemedText style={{ textAlign: "center", fontSize: 22 }}>
              We need your permission to show the camera
            </ThemedText>
            <Button onPress={requestPermission}>Grant Permission</Button>
          </View>
        )}
      >
        {data && (
          <View>
            <ThemedText style={{ textAlign: "center", marginVertical: 4 }}>
              ID: {data}
            </ThemedText>
          </View>
        )}
      </QRCodeScanner>

      {/* Modal for adding new equipment */}
      <Modal
        visible={modalVisible}
        backdropStyle={styles.modalBackdrop}
        onBackdropPress={() => setModalVisible(false)}
      >
        <Card disabled={true} style={styles.modalCard}>
          <Text category="h6" style={styles.modalText}>
            Equipment Not Found
          </Text>
          <Text style={styles.modalText}>Add Equipment with ID:</Text>
          <Text category="h5" style={styles.equipmentId}>
            {data || ""}
          </Text>
          <Button onPress={handleAddEquipment} style={styles.addButton}>
            Add Equipment
          </Button>
        </Card>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  modalBackdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalCard: {
    padding: 20,
    alignItems: "center"
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center"
  },
  equipmentId: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10
  },
  addButton: {
    marginTop: 20
  }
});
