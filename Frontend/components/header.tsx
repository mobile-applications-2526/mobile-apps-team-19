import React, { useCallback, useState } from "react";
import { View, StyleSheet, Text, Pressable, Image } from "react-native";
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
    <View style={[styles.header]}>
      <View style={styles.titleContainer}>
        <Image
          source={require("../assets/logo/Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText type="title" style={styles.titleText}>
          {title}
        </ThemedText>
      </View>

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
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#7C3AED", // Nice purple background
    borderBottomWidth: 1,
    borderBottomColor: "#6D28D9",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  titleText: {
    color: "#FFFFFF",
    fontSize: 50,
    fontWeight: "700",
  },
  loginButton: {
    backgroundColor: "#A78BFA", // Less purple button
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#A78BFA",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
