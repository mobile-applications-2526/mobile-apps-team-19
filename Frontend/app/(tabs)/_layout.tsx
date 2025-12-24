import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {
  House,
  LogIn,
  PlusCircle,
  UserPlus,
  Calendar,
} from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const loggedInUser = await AsyncStorage.getItem("loggedInUser");
      console.log(
        "Checking login status:",
        loggedInUser ? "User found" : "No user"
      );
      if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        setIsLoggedIn(!!userData.token);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkLoginStatus();
    }, [])
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House color="white" size={28} />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color }) => <LogIn size={28} color="white" />,
          href: isLoggedIn ? null : "/login",
        }}
      />
      <Tabs.Screen
        name="createEvent"
        options={{
          title: "Create Event",
          tabBarIcon: ({ color }) => <PlusCircle size={28} color="white" />,
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: "Signup",
          tabBarIcon: ({ color }) => <UserPlus size={28} color="white" />,
          href: isLoggedIn ? null : "/signup",
        }}
      />
      <Tabs.Screen
        name="event"
        options={{
          title: "Event",
          tabBarIcon: ({ color = "white" }) => (
            <Calendar size={28} color="white" />
          ),
        }}
      />
    </Tabs>
  );
}
