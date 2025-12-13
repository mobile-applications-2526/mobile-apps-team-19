import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Alert,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function AlbumsScreen() {
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
      eventCode: 'BDAY24',
    },
    {
      id: 2,
      eventName: 'Weekend Trip',
      photoCount: 47,
      date: '2025-11-28',
      coverPhoto: 'https://picsum.photos/400/300?random=2',
      eventCode: 'TRIP99',
    },
    {
      id: 3,
      eventName: 'New Years Eve 🥳',
      photoCount: 15,
      date: '2025-01-01',
      coverPhoto: 'https://picsum.photos/400/300?random=3',
      eventCode: 'NYE25',
    },
  ]);

  const handleAlbumPress = (albumId: number) => {
    router.push({
      pathname: '/album-detail',
      params: { albumId },
    });
  };

  const handleExportAlbum = async (album: typeof albums[0]) => {
    // Later implementeren - foto's exportern naar gallery
    Alert.alert(
      'Album Exporteren',
      `${album.photoCount} foto's van "${album.eventName}" worden geëxporteerd naar je galerij.`,
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Exporteer',
          onPress: () => {
            // TODO: implementeer export functionaliteit
            console.log('Exporteer album:', album.id);
          },
        },
      ]
    );
  };

  const handleShareAlbum = async (album: typeof albums[0]) => {
    try {
      await Share.share({
        message: `Check out my album "${album.eventName}"! ${album.photoCount} photos from our event.`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleDeleteAlbum = (album: typeof albums[0]) => {
    Alert.alert(
      'Album Verwijderen',
      `Weet je zeker dat je "${album.eventName}" wilt verwijderen? Dit kan niet ongedaan gemaakt worden.`,
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Verwijder',
          style: 'destructive',
          onPress: () => {
            // TODO: implementeer verwijder functionaliteit
            console.log('Verwijder album:', album.id);
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <ThemedText style={styles.headerTitle}>Mijn Albums</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {albums.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📷</Text>
            <ThemedText style={styles.emptyTitle}>Geen albums</ThemedText>
            <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
              Opgeslagen foto's verschijnen hier
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
                onPress={() => handleAlbumPress(album.id)}>
                <Image source={{ uri: album.coverPhoto }} style={styles.coverPhoto} />
                
                <View style={styles.albumInfo}>
                  <ThemedText style={styles.albumName} numberOfLines={1}>
                    {album.eventName}
                  </ThemedText>
                  <Text style={[styles.albumMeta, { color: colors.icon }]}>
                    {album.photoCount} foto's • {new Date(album.date).toLocaleDateString('nl-NL')}
                  </Text>
                </View>

                {/* Actie knoppen */}
                <View style={styles.albumActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionIcon,
                      pressed && { opacity: 0.5 },
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleShareAlbum(album);
                    }}>
                    <Text style={styles.actionIconText}>🔗</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.actionIcon,
                      pressed && { opacity: 0.5 },
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleExportAlbum(album);
                    }}>
                    <Text style={styles.actionIconText}>📥</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.actionIcon,
                      pressed && { opacity: 0.5 },
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteAlbum(album);
                    }}>
                    <Text style={styles.actionIconText}>🗑️</Text>
                  </Pressable>
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
  backIcon: {
    fontSize: 32,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
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
  albumActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    padding: 12,
    paddingTop: 0,
  },
  actionIcon: {
    padding: 8,
  },
  actionIconText: {
    fontSize: 20,
  },
});
