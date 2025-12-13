import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48) / 3; // 3 kolommen met padding

export default function AlbumDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Mock data - later van lokale storage halen
  const [album] = useState({
    id: params.albumId,
    eventName: 'Birthday Party 🎉',
    photoCount: 9,
    date: '2025-12-10',
    photos: [
      { id: 1, url: 'https://picsum.photos/600/800?random=1', hashtags: ['#party', '#fun'] },
      { id: 2, url: 'https://picsum.photos/600/800?random=2', hashtags: ['#memories'] },
      { id: 3, url: 'https://picsum.photos/600/800?random=3', hashtags: ['#friends'] },
      { id: 4, url: 'https://picsum.photos/600/800?random=4', hashtags: ['#celebration'] },
      { id: 5, url: 'https://picsum.photos/600/800?random=5', hashtags: ['#goodtimes'] },
      { id: 6, url: 'https://picsum.photos/600/800?random=6', hashtags: ['#love'] },
      { id: 7, url: 'https://picsum.photos/600/800?random=7', hashtags: ['#happy'] },
      { id: 8, url: 'https://picsum.photos/600/800?random=8', hashtags: ['#smile'] },
      { id: 9, url: 'https://picsum.photos/600/800?random=9', hashtags: ['#bestday'] },
    ],
  });

  const handlePhotoPress = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <View style={styles.headerInfo}>
          <ThemedText style={styles.headerTitle} numberOfLines={1}>
            {album.eventName}
          </ThemedText>
          <Text style={[styles.headerSubtitle, { color: colors.icon }]}>
            {album.photoCount} foto's
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Photo Grid */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.photoGrid}>
          {album.photos.map((photo) => (
            <Pressable
              key={photo.id}
              style={({ pressed }) => [
                styles.photoContainer,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => handlePhotoPress(photo.url)}>
              <Image source={{ uri: photo.url }} style={styles.photo} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Fullscreen Modal */}
      <Modal
        visible={selectedPhoto !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}>
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setSelectedPhoto(null)}>
            <Image
              source={{ uri: selectedPhoto || '' }}
              style={styles.fullscreenPhoto}
              resizeMode="contain"
            />
          </Pressable>
          
          <Pressable
            style={styles.closeButton}
            onPress={() => setSelectedPhoto(null)}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>
      </Modal>
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
  headerInfo: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 6,
  },
  photoContainer: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
  },
  photo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenPhoto: {
    width: width,
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '300',
  },
});
