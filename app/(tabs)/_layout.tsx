import { Tabs, useNavigation } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { StatusBar, Image, StyleSheet, View } from "react-native";
import { Button, Text } from "@ui-kitten/components";

export default function TabLayout() {
  const navigation = useNavigation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "rgb(51, 102, 255)",
        headerShown: true,
        tabBarStyle: {
          height: 60,
          paddingBottom: 6
        },
        tabBarLabelStyle: {
          marginBottom: 2
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
          header: () => (
            <View style={[style.safeArea, style.header]}>
              <Image
                source={require("@/assets/images/colored logo.png")}
                style={{
                  width: 120,
                  height: 120,
                  paddingVertical: 0,
                  objectFit: "scale-down"
                }}
              />
              <Button
                style={{ marginLeft: "auto" }}
                onPress={() => {
                  navigation.navigate("add-equipment" as never);
                }}
              >
                Add Equipment
              </Button>
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="add-equipment"
        options={{
          title: "Add Equipments",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "add-sharp" : "add-outline"}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="qrcode"
        options={{
          title: "Scan QR Code",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "qr-code" : "qr-code-outline"}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="reading"
        options={{
          href: null,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="readings"
        options={{
          href: null,
          headerShown: false
        }}
      />
    </Tabs>
  );
}

const style = StyleSheet.create({
  safeArea: {
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white"
  },
  header: {
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center"
  }
});
