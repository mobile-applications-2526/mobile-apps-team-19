import { Stack } from "expo-router";
import React from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/context/AuthContext";
import { AppThemeProvider } from "@/theme/ThemeProvider";

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
              name="event-details"
              options={{ headerShown: false, presentation: "card" }}
            />
          </Stack>
        </AppThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
