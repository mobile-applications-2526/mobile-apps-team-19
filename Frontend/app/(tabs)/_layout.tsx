import { Tabs } from "expo-router";
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/theme/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import {
  House,
  LogIn,
  PlusCircle,
  UserPlus,
  Calendar,
  CalendarDays,
} from "lucide-react-native";

export default function TabLayout() {
  const { themeMode } = useThemeMode();
  const colors = Colors[themeMode];
  const { isLoggedIn } = useAuth();

  function CreateTabButton(props: any) {
    return (
      <View style={styles.createButtonWrapper}>
        <Pressable
          {...props}
          style={({ pressed }) => [
            styles.createButton,
            pressed && { opacity: 0.9 },
          ]}
        >
          <PlusCircle size={28} color="white" />
        </Pressable>
        <Text style={styles.createLabel}>Create Event</Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: "below-icon",
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: themeMode === "dark" ? "#9CA3AF" : "#6B7280",
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.background,
            borderColor: themeMode === "dark" ? "#1F2937" : "#E5E7EB",
          },
        ],
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color }) => <LogIn size={24} color={color} />,
          href: isLoggedIn ? null : "/login",
        }}
      />

      {/* CENTER CREATE BUTTON */}
      <Tabs.Screen
        name="createEvent"
        options={{
          title: "Create",
          tabBarButton: (props) => <CreateTabButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="signup"
        options={{
          title: "Signup",
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
          href: isLoggedIn ? null : "/signup",
        }}
      />

      <Tabs.Screen
        name="event"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => <CalendarDays size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: "5%",
    right: "5%",
    height: 80,
    borderRadius: 0,
    borderWidth: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 12,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  createButtonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 8,
  },
  createButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  createLabel: {
    fontSize: 12,
    color: "#7C3AED",
    marginTop: 4,
    fontWeight: "500",
    textAlign: "center",
  },
});
