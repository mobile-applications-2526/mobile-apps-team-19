import React from "react";
import { Stack } from "expo-router";
import "react-native-reanimated";

import { AppThemeProvider } from "@/theme/ThemeProvider";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <Stack
        screenOptions={({ theme }) => ({
          contentStyle: { backgroundColor: theme.colors.background },
        })}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
        <Stack.Screen
          name="event-details"
          options={{ headerShown: false, presentation: "card" }}
        />
      </Stack>
    </AppThemeProvider>
  );
}
