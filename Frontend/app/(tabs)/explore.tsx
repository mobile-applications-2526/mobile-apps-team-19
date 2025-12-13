import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function AlbumsTabScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  // Mock data - later van backend/lokale storage halen
  const [albums] = useState([
    {
      id: 1,
      eventName: 'Birthday Party 🎉',
      photoCount: 23,
      date: '2025-12-10',
      coverPhoto: 'https://picsum.photos/400/300?random=1',
    },
    {
      id: 2,
      eventName: 'Weekend Trip',
      photoCount: 47,
      date: '2025-11-28',
      coverPhoto: 'https://picsum.photos/400/300?random=2',
    },
    {
      id: 3,
      eventName: 'New Years Eve 🥳',
      photoCount: 15,
      date: '2025-01-01',
      coverPhoto: 'https://picsum.photos/400/300?random=3',
    },
  ]);

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.headerTitle}>My Albums</ThemedText>
        <Pressable onPress={() => router.push('/profile')}>
          <Text style={styles.profileIcon}>👤</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
        {albums.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📷</Text>
            <ThemedText style={styles.emptyTitle}>No albums</ThemedText>
            <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
              Saved photos will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.albumsGrid}>
            {albums.map((album) => (
              <Pressable
                key={album.id}
                style={({ pressed }) => [
                  styles.albumCard,
                  { backgroundColor: colors.background, borderColor: colors.border },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() =>
                  router.push({
                    pathname: '/album-detail',
                    params: { albumId: album.id },
                  })
                }>
                <Image
                  source={{ uri: album.coverPhoto }}
                  style={styles.coverPhoto}
                />
                <View style={styles.albumInfo}>
                  <ThemedText style={styles.albumName} numberOfLines={1}>
                    {album.eventName}
                  </ThemedText>
                  <Text style={[styles.albumMeta, { color: colors.icon }]}>
                    {album.photoCount} photos • {new Date(album.date).toLocaleDateString('en-US')}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  profileIcon: {
    fontSize: 28,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
  },
  albumsGrid: {
    padding: 16,
    gap: 16,
  },
  albumCard: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
  },
  coverPhoto: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
  },
  albumInfo: {
    padding: 16,
  },
  albumName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  albumMeta: {
    fontSize: 14,
  },
});

