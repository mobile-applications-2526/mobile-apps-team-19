import { CreateEventForm } from "@/components/create-event-form";
import { Header } from "@/components/header";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

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
});
