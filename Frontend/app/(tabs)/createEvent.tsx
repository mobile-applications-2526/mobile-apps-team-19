import { CreateEventForm } from "@/components/create-event-form";
import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function CreateEvent() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>
            Please log in to view events.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  const handleEventCreated = () => {
    router.push("/(tabs)/event");
  };

  return (
    <ThemedView style={styles.container}>
      <Header />
      <CreateEventForm onSuccess={handleEventCreated} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
