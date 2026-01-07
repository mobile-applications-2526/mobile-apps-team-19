import { CreateEventForm } from "@/components/create-event-form";
import { Header } from "@/components/header";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const router = useRouter();


  return (
    <ThemedView style={styles.container}>
      <Header />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
