import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function EventScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText style={{ fontSize: 24, fontWeight: 'bold' }}>Event Details</ThemedText>
      {/* Event details content goes here */}
      
    </ThemedView>
  );
}