import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { MachinesProvider } from "@/hooks/useMachines";

import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import { EquipmentsProvider } from "@/hooks/useEquipments";
import { ReadingsProvider } from "@/hooks/useReadings";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <EquipmentsProvider>
        <ReadingsProvider>
          <MachinesProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </MachinesProvider>
        </ReadingsProvider>
      </EquipmentsProvider>
    </ApplicationProvider>
  );
}
