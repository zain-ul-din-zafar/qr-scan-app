import React from "react";
import { View, StyleSheet, StatusBar, ScrollView } from "react-native";
import { Card, Text } from "@ui-kitten/components";
import useEquipments from "@/hooks/useEquipments";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { equipments } = useEquipments();
  const router = useRouter();

  const renderEquipmentCards = () => {
    return Object.keys(equipments).map((key, index) => {
      const name = equipments[key];
      return (
        <Card
          key={index}
          onPress={() => {
            const params = new URLSearchParams({
              id: key,
              name
            }).toString();
            router.push(`/readings?${params}`);
          }}
          style={styles.card}
        >
          <Text category="h6">{name}</Text>
          <Text appearance="hint">{`ID: ${key}`}</Text>
        </Card>
      );
    });
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <Text category="h4" style={styles.title}>
        Equipments
      </Text>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {Object.keys(equipments).length === 0 && (
          <Text
            category="h6"
            style={{ textAlign: "center", marginVertical: "auto" }}
          >
            No Equipment found.
          </Text>
        )}
        <View style={styles.cardContainer}>{renderEquipmentCards()}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 6
  },
  scrollViewContainer: {
    flexGrow: 1
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  card: {
    width: "49%", // Adjust width as per your layout needs
    marginBottom: 16
  },
  title: {
    marginBottom: 12
  }
});
