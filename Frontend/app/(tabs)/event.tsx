import { EventCard } from "@/components/event-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { joinEvent } from '@/service/eventService';
import { type Event } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function EventScreen() {
  const insets = useSafeAreaInsets();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadUserAndFetchEvents();
    }, [])
  );

  const loadUserAndFetchEvents = async () => {
    try {
      const loggedInUser = await AsyncStorage.getItem('loggedInUser');
      let username = null;
      if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        username = userData.username;
        setCurrentUsername(username);
        console.log('Filtering events for user:', username);
      } else {
        console.log('No logged in user found');
      }
      await fetchEvents(username);
    } catch (error) {
      console.error('Error loading user:', error);
      await fetchEvents(null);
    }
  };

  const fetchEvents = async (username: string | null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const text = await response.text();

      // Try to parse the JSON, handling circular reference issues
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error - likely circular reference:', parseError);

        // Try to extract just the top-level event data before circular refs break it
        try {
          // Use regex to extract basic event info from the malformed JSON
          const eventMatches = text.matchAll(/"name":"([^"]+)","date":"([^"]+)","hostName":"([^"]+)","startTime":"([^"]+)","endTime":"([^"]+)"/g);
          const extractedEvents: Event[] = [];
          const seenEvents = new Set<string>();

          for (const match of eventMatches) {
            const [_, name, date, hostName, startTime, endTime] = match;
            const eventKey = `${name}-${date}`;

            if (!seenEvents.has(eventKey)) {
              seenEvents.add(eventKey);
              extractedEvents.push({
                id: eventKey,
                title: name,
                date: date,
                location: hostName,
              });
            }
          }

          if (extractedEvents.length > 0) {
            console.log('Extracted events from malformed JSON:', extractedEvents);
            setAllEvents(extractedEvents);
            setFilteredEvents(extractedEvents);
            return;
          }
        } catch (extractError) {
          console.error('Failed to extract event data:', extractError);
        }

        throw new Error('Backend error: Circular reference in API response. Please contact backend team.');
      }


      if (Array.isArray(data)) {
        const mappedEvents = data.map(event => ({
          id: event.id?.toString() || `${event.name}-${event.date}`,
          eventId: event.id, // Keep numeric ID for backend operations
          title: event.name || event.title,
          date: event.date,
          location: event.location || event.hostName,
          photoCount: event.pictures?.length || 0,
          usernames: event.usernames || [],
        }));

        setAllEvents(mappedEvents);

        // Filter events to show only those where the current user is a member
        const userEvents = username
          ? mappedEvents.filter(event =>
            event.usernames && event.usernames.includes(username)
          )
          : mappedEvents;

        console.log(`User has ${userEvents.length} of ${mappedEvents.length} events`);
        setFilteredEvents(userEvents);
      } else if (data.events && Array.isArray(data.events)) {
        setAllEvents(data.events);
        setFilteredEvents(data.events);
      } else if (data.data && Array.isArray(data.data)) {
        setAllEvents(data.data);
        setFilteredEvents(data.data);
      } else {
        console.error('Unexpected data structure:', data);
        setAllEvents([]);
        setFilteredEvents([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventPress = (event: Event) => {
    console.log('Event pressed:', event.title);
    router.push({
      pathname: '/event-details',
      params: {
        id: event.id,
        title: event.title,
      },
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      // If search is empty, show user's events
      const userEvents = currentUsername
        ? allEvents.filter(event => event.usernames && event.usernames.includes(currentUsername))
        : allEvents;
      setFilteredEvents(userEvents);
      setShowAllEvents(false);
      return;
    }

    // Search in all events
    const searchResults = allEvents.filter(event =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      (event.location && event.location.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredEvents(searchResults);
    setShowAllEvents(true);
  };

  const handleJoinEvent = async (event: Event) => {
    console.log('handleJoinEvent called with event:', event);

    if (!currentUsername) {
      console.log('No current username found');
      Alert.alert('Error', 'You must be logged in to join an event');
      return;
    }

    if (event.usernames && event.usernames.includes(currentUsername)) {
      console.log('User already member of event');
      Alert.alert('Info', 'You are already a member of this event');
      return;
    }

    try {
      console.log('Joining event:', event.title, 'with username:', currentUsername);
      const response = await joinEvent(event.title, currentUsername);

      console.log('Join event response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Join event error response:', errorText);
        throw new Error(`Failed to join event: ${response.status} - ${errorText}`);
      }

      Alert.alert('Success', 'You have joined the event!');

      // Refresh events
      await loadUserAndFetchEvents();
      setSearchQuery('');
    } catch (error) {
      console.error('Error joining event:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to join event. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>EventSnap</ThemedText>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.background, borderColor: colors.icon + '40' }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search events to join..."
            placeholderTextColor={colors.icon}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => handleSearch('')} style={styles.clearButton}>
              <Text style={styles.clearIcon}>✕</Text>
            </Pressable>
          )}
        </View>

        {showAllEvents && searchQuery && (
          <ThemedText style={[styles.searchInfo, { color: colors.icon }]}>
            Showing all events matching "{searchQuery}"
          </ThemedText>
        )}
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isMember = item.usernames && currentUsername && item.usernames.includes(currentUsername);
          return (
            <View>
              <EventCard event={item} onPress={() => handleEventPress(item)} />
              {showAllEvents && !isMember && (
                <Pressable
                  style={[styles.joinButton, { backgroundColor: '#007AFF' }]}
                  onPress={() => handleJoinEvent(item)}
                >
                  <Text style={styles.joinButtonText}>Join Event</Text>
                </Pressable>
              )}
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              {searchQuery ? 'No events found' : 'No events yet'}
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: colors.icon }]}>
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first event to get started'}
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 16,
    color: '#999',
  },
  searchInfo: {
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  joinButton: {
    marginHorizontal: 16,
    marginTop: -8,
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});