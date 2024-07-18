import React from "react";
import { View, StyleSheet, StatusBar, ScrollView } from "react-native";
import { Card, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { useComposeEquipments } from "@/hooks/useComposeEquipments";

export default function HomeScreen() {
  const allEquipments = useComposeEquipments();
  const router = useRouter();

  const groups = Object.keys(allEquipments);

  const renderGroupCards = () => {
    return groups.map((group, index) => (
      <Card
        key={index}
        onPress={() => router.push(`/readings?id=${group}`)}
        style={styles.card}
      >
        <Text
          category="h6"
          style={{
            textAlign: "center"
          }}
        >
          {group}
        </Text>
      </Card>
    ));
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <Text category="h4" style={styles.title}>
        Equipment Groups
      </Text>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {groups.length === 0 && (
          <Text
            category="h6"
            style={{ textAlign: "center", marginVertical: "auto" }}
          >
            No Groups found.
          </Text>
        )}
        <View style={styles.cardContainer}>{renderGroupCards()}</View>
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
