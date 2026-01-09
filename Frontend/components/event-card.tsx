import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/theme/ThemeProvider";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type Event = {
  id: string;
  title: string;
  date?: string;
  dateRange?: string;
  location?: string;
  photoCount?: number;
  description?: string;
  usernames?: string[];
};

type EventCardProps = {
  event: Event;
  onPress: () => void;
  onLongPress?: () => void;
};

export function EventCard({ event, onPress, onLongPress }: EventCardProps) {
  const { themeMode } = useThemeMode();
  const colors = Colors[themeMode];
  const accent = "#d946ef";
  const surface = themeMode === "dark" ? "#1f1f24" : "#ffffff";
  const border = themeMode === "dark" ? "#2d2d33" : "#e5e7eb";
  const muted = themeMode === "dark" ? "#9BA1A6" : "#555";

  const displayDate = event.dateRange || event.date || "Date not set";
  const photoInfo =
    event.photoCount !== undefined
      ? `${event.photoCount} ${event.photoCount === 1 ? "photo" : "photos"}`
      : null;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: surface,
          borderColor: border,
          shadowColor: themeMode === "dark" ? "#000" : accent,
        },
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.iconPill}>
        <Text style={[styles.iconText, { color: accent }]}>📅</Text>
      </View>

      <View style={styles.details}>
        <ThemedText
          style={[styles.title, { color: colors.text }]}
          numberOfLines={1}
        >
          {event.title}
        </ThemedText>
        <ThemedText style={[styles.meta, { color: muted }]}>
          {photoInfo ? `${photoInfo} · ${displayDate}` : displayDate}
        </ThemedText>
        {event.location && (
          <ThemedText
            style={[styles.location, { color: muted }]}
            numberOfLines={1}
          >
            📍 {event.location}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 2,
    alignItems: "center",
    gap: 12,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconPill: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#d946ef1a",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 28,
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    marginBottom: 2,
  },
  location: {
    fontSize: 13,
    marginTop: 4,
  },
});
