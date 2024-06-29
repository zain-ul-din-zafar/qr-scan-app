import { ThemedText } from "@/components/ThemedText";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Button,
  TouchableOpacity,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function QrCode() {
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [data, setData] = useState<string>("");

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={(res) => {
          setData(res.data);
        }}
        focusable
      >
        <View style={styles.buttonContainer}>
          <View style={styles.content}>
            <View style={styles.scanQRCodeContainer}>
              {data && (
                <ThemedText style={styles.scanQRText}>Data: {data}</ThemedText>
              )}
            </View>
            <View style={styles.scanQRCodeContainer}>
              <Ionicons name="qr-code" style={styles.qrIcon} />
              <ThemedText style={styles.scanQRText}>Scan QR Code</ThemedText>
            </View>
            {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: "auto",
    gap: 34,
  },
  scanQRCodeContainer: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    alignContent: "center",
    gap: 8,
  },
  scanQRText: {
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: 20,
  },
  qrIcon: {
    fontSize: 32,
    color: "white",
  },
  safeArea: {
    marginTop: StatusBar.currentHeight,
    padding: 8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    gap: 4,
    flexDirection: "column",
    backgroundColor: "transparent",
    margin: 54,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },

  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
