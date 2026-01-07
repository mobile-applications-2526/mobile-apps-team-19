import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

import { AppThemeProvider } from "@/theme/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
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
      </AuthProvider>
    </SafeAreaProvider>
  );
}
