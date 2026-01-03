import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Header } from "@/components/header";
import { Colors } from "@/constants/theme";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useThemeMode } from "@/theme/ThemeProvider";
import { Camera } from "lucide-react-native";
type Picture = {
  url: string;
  tags: string;
};

type EventDetails = {
  id?: number;
  name: string;
  date: string;
  hostName?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  pictures: Picture[];
  usernames?: string[];
};

export default function EventDetailsScreen() {
  const {
    id,
    title,
    eventId: paramEventId,
    eventName: paramEventName,
  } = useLocalSearchParams<{
    id: string;
    title: string;
    eventId?: string;
    eventName?: string;
  }>();
  const router = useRouter();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { themeMode } = useThemeMode();
  const colors = Colors[themeMode];
  const accent = "#d946ef";
  const surface = themeMode === "dark" ? "#1f1f24" : "#ffffff";
  const border = themeMode === "dark" ? "#2d2d33" : "#e5e7eb";
  const muted = themeMode === "dark" ? "#9BA1A6" : "#555";

  const { width: screenWidth } = Dimensions.get("window");
  const { columns, tileSize, gap } = useMemo(() => {
    const cols = screenWidth >= 900 ? 3 : 2;
    const gapSize = 12;
    const sectionPadding = 16 * 2; // imagesSection horizontal padding
    const sectionMargin = 8 * 2; // imagesSection horizontal margin
    const available = screenWidth - sectionPadding - sectionMargin;
    const size = (available - gapSize * (cols - 1)) / cols;
    return { columns: cols, tileSize: size, gap: gapSize };
  }, [screenWidth]);

  // Refresh event details when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchEventDetails();
    }, [id, title])
  );

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch event by name (title is the event name)
      const eventName = title || id;
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/events`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch event details: ${response.status}`);
      }

      const text = await response.text();
      let allEvents;

      try {
        allEvents = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        // Try to extract event data from malformed JSON
        const eventMatch = text.match(
          /"name":"([^"]+)","date":"([^"]+)","hostName":"([^"]+)","startTime":"([^"]+)","endTime":"([^"]+)"/
        );
        if (eventMatch) {
          const [_, name, date, hostName, startTime, endTime] = eventMatch;
          setEvent({
            name: name,
            date: date,
            hostName: hostName,
            startTime: startTime,
            endTime: endTime,
            pictures: [],
          });
          return;
        }
        throw new Error("Unable to parse event data");
      }

      // Find the specific event by name
      const eventData = Array.isArray(allEvents)
        ? allEvents.find(
            (e) =>
              e.name === eventName || e.name === decodeURIComponent(eventName)
          )
        : allEvents;

      if (!eventData) {
        throw new Error("Event not found");
      }

      console.log("Event data from API:", eventData);
      console.log("Event data keys:", Object.keys(eventData));
      console.log("Event ID field:", eventData.id, eventData.eventId);

      setEvent({
        id: eventData.id,
        name: eventData.name,
        date: eventData.date,
        hostName: eventData.hostName,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        location: eventData.location,
        pictures: eventData.pictures || [],
        usernames: eventData.usernames || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching event details:", err);

      // Fallback with empty data
      setEvent({
        name: title || "Event",
        date: "",
        pictures: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const openImageFullscreen = (imageUri: string) => {
    setSelectedImage(imageUri);
  };

  const closeImageFullscreen = () => {
    setSelectedImage(null);
  };

  const handleCameraPress = () => {
    // Use event name as identifier since backend doesn't return numeric IDs
    const identifier = paramEventName || event?.name || title;

    console.log("Camera button pressed:", {
      paramEventName,
      eventName: event?.name,
      identifier,
      fullEvent: event,
    });

    if (!identifier) {
      console.error("No event identifier available", {
        paramEventName,
        eventName: event?.name,
        title,
        event,
      });
      alert(
        "Cannot open camera: Event name is missing. Please try reopening this event from the events list."
      );
      return;
    }

    router.push({
      pathname: "/camera-test",
      params: {
        eventName: identifier,
      },
    });
  };

  if (loading) {
    return (
      <ThemedView
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={accent} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <ThemedText style={{ color: colors.text }}>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={[styles.backButtonText, { color: accent }]}>
              ← Back
            </ThemedText>
          </Pressable>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            {event?.name || title}
          </ThemedText>
          {event?.date && (
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              📅 {event.date}
            </ThemedText>
          )}
          {event?.hostName && (
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              📍 {event.hostName}
            </ThemedText>
          )}
          {event?.startTime && event?.endTime && (
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              🕐 {event.startTime} - {event.endTime}
            </ThemedText>
          )}
        </View>

        {/* Images Grid */}
        {event?.pictures && event.pictures.length > 0 ? (
          <View
            style={[
              styles.imagesSection,
              { backgroundColor: surface, borderColor: border },
            ]}
          >
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
              Photos ({event.pictures.length})
            </ThemedText>
            <View style={[styles.imageGrid, { gap }]}>
              {event.pictures.map((picture, index) => (
                <Pressable
                  key={index}
                  onPress={() => openImageFullscreen(picture.url)}
                  style={[
                    styles.imageContainer,
                    {
                      width: tileSize,
                      height: tileSize,
                      borderColor: border,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: picture.url }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText style={[styles.emptyText, { color: colors.text }]}>
              📷
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: muted }]}>
              No photos yet
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <Pressable
          style={styles.fullscreenContainer}
          onPress={closeImageFullscreen}
        >
          <View style={styles.fullscreenContent}>
            <Pressable
              onPress={closeImageFullscreen}
              style={styles.closeButton}
            >
              <ThemedText style={styles.closeButtonText}>✕</ThemedText>
            </Pressable>
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </View>
        </Pressable>
      )}

      {/* Floating Camera Button */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: accent, shadowColor: accent },
          pressed && styles.fabPressed,
        ]}
        onPress={handleCameraPress}
      >
        {/* <ThemedText style={styles.fabIcon}>📷</ThemedText> */}
        <Camera color="#fff" size={40} strokeWidth={2.6} />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  imagesSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
    marginHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: "center",
  },
  fullscreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  fabIcon: {
    fontSize: 30,
    color: "#fff",
  },
});
