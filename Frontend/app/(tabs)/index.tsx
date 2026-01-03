import { Header } from "@/components/header";
import { ThemedView } from "@/components/themed-view";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Pressable,
  Text,
  Modal,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EventCard } from "@/components/event-card";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getEvents } from "@/service/eventService";
import { Filter, ChevronDown } from "lucide-react-native";
import { type Event } from "@/types";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      const data = await response.json();
      setEvents(data);
      
      
      const locations = Array.from(
        new Set(data.map((e: Event) => e.location).filter(Boolean))
      ) as string[];
      setAvailableLocations(locations);
      
      applyFiltersAndSort(data, null, "newest");
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  const applyFiltersAndSort = (
    eventsToFilter: Event[],
    location: string | null,
    sort: "newest" | "oldest"
  ) => {
    let filtered = [...eventsToFilter];

   
    if (location) {
      filtered = filtered.filter((e) => e.location === location);
    }

    
    filtered.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return sort === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredEvents(filtered);
  };

  const handleSortChange = (newSort: "newest" | "oldest") => {
    setSortBy(newSort);
    applyFiltersAndSort(events, selectedLocation, newSort);
  };

  const handleLocationFilter = (location: string | null) => {
    setSelectedLocation(location);
    applyFiltersAndSort(events, location, sortBy);
    setShowFilterModal(false);
  };

  const handleEventPress = (eventName: string) => {
    router.push({
      pathname: "/event-details",
      params: { eventName },
    });
  };

  const renderEventGrid = ({ item }: { item: Event }) => (
    <View style={{ width: "50%", paddingHorizontal: 8 }}>
      <EventCard
        event={item}
        onPress={() => handleEventPress(item.title)}
      />
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={{ paddingTop: insets.top }}>
        <Header />
      </View>

      {/* Filter and Sort Bar */}
      <View style={[styles.controlBar, { borderBottomColor: colors.icon + "20" }]}>
        <Pressable
          onPress={() => setShowFilterModal(true)}
          style={[
            styles.filterButton,
            { backgroundColor: colors.icon + "10" },
          ]}
        >
          <Filter size={20} color={colors.text} />
          <Text style={[styles.filterText, { color: colors.text }]}>
            {selectedLocation ? `📍 ${selectedLocation}` : "Filter"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            handleSortChange(sortBy === "newest" ? "oldest" : "newest")
          }
          style={[
            styles.sortButton,
            { backgroundColor: colors.icon + "10" },
          ]}
        >
          <Text style={[styles.sortText, { color: colors.text }]}>
            {sortBy === "newest" ? "🆕 Newest" : "🕐 Oldest"}
          </Text>
          <ChevronDown size={16} color={colors.text} />
        </Pressable>
      </View>

      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      ) : filteredEvents.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: colors.icon }]}>
            No events found
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventGrid}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          scrollIndicatorInsets={{ right: 1 }}
        />
      )}

      
      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowFilterModal(false)}
        >
          <View
            style={[
              styles.filterModal,
              { backgroundColor: colors.background },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: colors.text },
              ]}
            >
              Filter by Location
            </Text>

            <Pressable
              onPress={() => handleLocationFilter(null)}
              style={[
                styles.filterOption,
                selectedLocation === null && styles.filterOptionActive,
                {
                  borderBottomColor: colors.icon + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  {
                    color:
                      selectedLocation === null ? "#7C3AED" : colors.text,
                  },
                ]}
              >
                All Locations
              </Text>
              {selectedLocation === null && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </Pressable>

            {availableLocations.map((location) => (
              <Pressable
                key={location}
                onPress={() => handleLocationFilter(location)}
                style={[
                  styles.filterOption,
                  selectedLocation === location && styles.filterOptionActive,
                  {
                    borderBottomColor: colors.icon + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    {
                      color:
                        selectedLocation === location ? "#7C3AED" : colors.text,
                    },
                  ]}
                >
                  📍 {location}
                </Text>
                {selectedLocation === location && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
  },
  filterButton: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sortButton: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },
  listContent: {
    paddingVertical: 8,
  },
  gridRow: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  filterModal: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 16,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterOptionActive: {},
  filterOptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  checkmark: {
    color: "#7C3AED",
    fontSize: 18,
    fontWeight: "bold",
  },
});
