import React from 'react';
import { StyleSheet, View, FlatList, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EventCard, Event } from '@/components/event-card';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

// Mock data for demonstration
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Birthday Party',
    dateRange: 'Jun 12, 2025',
    location: 'Brussels',
    photoCount: 24,
    thumbnails: [
      'https://picsum.photos/200/200?random=1',
      'https://picsum.photos/200/200?random=2',
      'https://picsum.photos/200/200?random=3',
      'https://picsum.photos/200/200?random=4',
    ],
  },
  {
    id: '2',
    title: 'Weekend Trip',
    dateRange: 'May 20-22, 2025',
    location: 'Ghent',
    photoCount: 56,
    thumbnails: [
      'https://picsum.photos/200/200?random=5',
      'https://picsum.photos/200/200?random=6',
      'https://picsum.photos/200/200?random=7',
      'https://picsum.photos/200/200?random=8',
    ],
  },
  {
    id: '3',
    title: 'Coffee Meetup',
    dateRange: 'May 15, 2025',
    photoCount: 8,
    thumbnails: [
      'https://picsum.photos/200/200?random=9',
      'https://picsum.photos/200/200?random=10',
    ],
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleEventPress = (event: Event) => {
    // Navigate to event detail (to be implemented)
    console.log('Event pressed:', event.title);
  };

  const handleCameraPress = () => {
    // Open camera (to be implemented)
    console.log('Camera pressed');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyIcon, { color: colors.icon }]}>📷</Text>
      <ThemedText style={styles.emptyTitle}>No events yet</ThemedText>
      <ThemedText style={[styles.emptySubtitle, { color: colors.icon }]}>
        Take your first photo to get started
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <ThemedText type="title">EventSnap</ThemedText>
      </View>

      {/* Events List */}
      <FlatList
        data={MOCK_EVENTS}
        renderItem={({ item }) => (
          <EventCard event={item} onPress={() => handleEventPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Floating Camera Button */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: '#0066FF' },
          pressed && styles.fabPressed,
        ]}
        onPress={handleCameraPress}>
        <Text style={styles.fabIcon}>📷</Text>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
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
    fontSize: 28,
  },
});
