import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import {
  CameraView,
  PermissionResponse,
  useCameraPermissions
} from "expo-camera";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "./ThemedText";
import { useFocusEffect } from "@react-navigation/native";

interface QRCodeScannerProps {
  fallBack: (requestPermission: () => Promise<PermissionResponse>) => ReactNode;
  children: ReactNode;
  onScan: (data: string) => void;
}

export default function QRCodeScanner({
  children,
  fallBack,
  onScan
}: QRCodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return fallBack(requestPermission);
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={(res) => {
          onScan(res.data);
        }}
      >
        <View style={styles.buttonContainer}>
          <View style={styles.content}>
            <View style={styles.scanQRCodeContainer}>{children}</View>
            <View style={styles.scanQRCodeContainer}>
              <Ionicons name="qr-code" style={styles.qrIcon} />
              <ThemedText style={styles.scanQRText}>Scan QR Code</ThemedText>
            </View>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: "auto",
    gap: 34
  },
  scanQRCodeContainer: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    alignContent: "center",
    gap: 8
  },
  scanQRText: {
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: 20
  },
  qrIcon: {
    fontSize: 32,
    color: "white"
  },
  container: {
    flex: 1,
    justifyContent: "center"
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    gap: 4,
    flexDirection: "column",
    backgroundColor: "transparent",
    margin: 54
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center"
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white"
  }
});
