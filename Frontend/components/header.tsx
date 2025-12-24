import React, { useCallback, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { ThemedText } from "./themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Recall" }: HeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        const loggedInUser = await AsyncStorage.getItem("loggedInUser");
        setIsLoggedIn(!!loggedInUser);
      };
      checkLoginStatus();
    }, [])
  );

  const handleLogin = () => {
    router.push("/(tabs)/login");
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    router.replace("/(tabs)/login");
  };

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <ThemedText type="title" style={{ color: colors.text }}>
        {title}
      </ThemedText>

      {isLoggedIn ? (
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={handleLogin}
          style={[styles.loginButton, { borderColor: colors.tint }]}
        >
          <Text style={[styles.loginText, { color: colors.tint }]}>Login</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  loginButton: {
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginText: {
    fontSize: 14,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
