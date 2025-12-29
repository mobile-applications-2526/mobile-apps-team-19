import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { savePictureToBackend, uploadImageToSupabase } from '@/service/supabaseService';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function CameraTestScreen() {
  const router = useRouter();
  const { eventName } = useLocalSearchParams<{ eventName: string }>();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.icon}>📷</Text>
          <ThemedText style={styles.permissionTitle}>Camera Permission</ThemedText>
          <ThemedText style={styles.permissionText}>
            We need your permission to use the camera
          </ThemedText>
          <Pressable style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current) {
      return;
    }

    if (!eventName) {
      Alert.alert('Error', 'No event name provided');
      return;
    }

    try {
      setUploading(true);

      // Take the picture
      const photo = await cameraRef.current.takePictureAsync();

      if (!photo?.uri) {
        throw new Error('No photo URI received');
      }

      console.log('Photo taken:', photo.uri);

      // Upload to Supabase
      console.log('Uploading to Supabase...');
      const imageUrl = await uploadImageToSupabase(photo.uri, eventName);
      console.log('Image uploaded to Supabase:', imageUrl);

      // Save URL to backend
      console.log('Saving to backend...');
      await savePictureToBackend(eventName, imageUrl);
      console.log('Picture saved to backend successfully');

      Alert.alert(
        'Success!',
        'Photo uploaded successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error taking/uploading picture:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to upload picture'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        {/* Event Info Header */}
        {eventName && (
          <View style={styles.eventInfoContainer}>
            <Text style={styles.eventInfoText}>📸 {eventName}</Text>
          </View>
        )}

        {/* Loading Overlay */}
        {uploading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Uploading photo...</Text>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.flipButton}
            onPress={toggleCameraFacing}
            disabled={uploading}>
            <Text style={styles.buttonText}>🔄</Text>
          </Pressable>

          <Pressable
            style={[styles.captureButton, uploading && styles.captureButtonDisabled]}
            onPress={takePicture}
            disabled={uploading}>
            <View style={styles.captureButtonInner} />
          </Pressable>

          <Pressable
            style={styles.closeButton}
            onPress={() => router.back()}
            disabled={uploading}>
            <Text style={styles.buttonText}>✕</Text>
          </Pressable>
        </View>
      </CameraView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 20,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  eventInfoContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 8,
  },
  eventInfoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '600',
  },
  flipButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
});
