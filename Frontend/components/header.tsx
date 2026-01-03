import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./themed-text";
import { useRouter } from "expo-router";
import { Moon, Sun } from "lucide-react-native";
import { useThemeMode } from "@/theme/ThemeProvider";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Recall" }: HeaderProps) {
  const { themeMode, toggleTheme } = useThemeMode();
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;
  const logoSize = isSmallScreen ? 45 : 60;
  const titleFontSize = isSmallScreen ? 28 : 50;

  const handleLogin = () => {
    router.push("/(tabs)/login");
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(tabs)/login");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Pressable
            onPress={() => router.push("/(tabs)")}
            style={styles.pressableContent}
          >
            <Image
              source={require("../assets/logo/Logo.png")}
              style={[styles.logo, { width: logoSize, height: logoSize }]}
              resizeMode="contain"
            />
            <ThemedText
              type="title"
              style={[styles.titleText, { fontSize: titleFontSize }]}
            >
              {title}
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={toggleTheme}
            style={({ pressed }) => [
              styles.themeButton,
              pressed && { opacity: 0.85 },
              { backgroundColor: themeMode === "dark" ? "#1F2937" : "#F3F4F6" },
            ]}
          >
            {themeMode === "dark" ? (
              <Moon size={18} color="#FCD34D" />
            ) : (
              <Sun size={18} color="#F59E0B" />
            )}
          </Pressable>

          {isLoggedIn ? (
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          ) : (
            <Pressable onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.loginText}>Login</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#7C3AED",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#7C3AED",
    borderBottomWidth: 1,
    borderBottomColor: "#6D28D9",
  },
  titleContainer: {
    // Pressable handles the layout now
  },
  pressableContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    marginRight: 8,
  },
  titleText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  themeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  loginButton: {
    backgroundColor: "#A78BFA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#A78BFA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
