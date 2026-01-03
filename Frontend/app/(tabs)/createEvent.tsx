import { CreateEventForm } from "@/components/create-event-form";
import { Header } from "@/components/header";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateEvent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleEventCreated = () => {
    router.push("/(tabs)/event");
  };

  return (
    <ThemedView style={styles.container}>
      <View style={{ paddingTop: insets.top }}>
        <Header />
      </View>
      <CreateEventForm onSuccess={handleEventCreated} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
