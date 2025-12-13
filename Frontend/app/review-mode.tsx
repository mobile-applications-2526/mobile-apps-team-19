import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export default function ReviewModeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const params = useLocalSearchParams();

  // Mock data - normaal gesproken van backend halen
  const [photos] = useState([
    {
      id: 1,
      url: 'https://picsum.photos/800/1200?random=1',
      hashtags: ['#party', '#fun', '#memories'],
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      url: 'https://picsum.photos/800/1200?random=2',
      hashtags: ['#friends', '#good times'],
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      url: 'https://picsum.photos/800/1200?random=3',
      hashtags: ['#celebration'],
      timestamp: new Date().toISOString(),
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedPhotos, setSavedPhotos] = useState<number[]>([]);
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          // Swipe right - save foto
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          // Swipe left - skip foto
          forceSwipe('left');
        } else {
          // geen swipe - terug naar center
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      if (direction === 'right') {
        handleSavePhoto();
      }
      onSwipeComplete();
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const onSwipeComplete = () => {
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSavePhoto = () => {
    const currentPhoto = photos[currentIndex];
    setSavedPhotos((prev) => [...prev, currentPhoto.id]);
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    forceSwipe(direction);
  };

  if (currentIndex >= photos.length) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedIcon}>✅</Text>
          <Text style={[styles.completedTitle, { color: colors.text }]}>
            Alle foto's bekeken!
          </Text>
          <Text style={[styles.completedSubtitle, { color: colors.icon }]}>
            {savedPhotos.length} foto's opgeslagen
          </Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.doneButton,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push('/albums')}>
            <Text style={styles.doneButtonText}>Ga naar Albums</Text>
          </Pressable>
          
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              { borderColor: colors.border },
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.back()}>
            <Text style={[styles.backButtonText, { color: colors.text }]}>
              Terug naar Event
            </Text>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={[styles.headerText, { color: colors.text }]}>
          {currentIndex + 1} / {photos.length}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Photo Card */}
      <View style={styles.cardContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate },
              ],
            },
          ]}>
          <Image
            source={{ uri: currentPhoto.url }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Like overlay */}
          <Animated.View
            style={[
              styles.overlay,
              styles.likeOverlay,
              { opacity: likeOpacity },
            ]}>
            <Text style={styles.overlayText}>BEWAAR</Text>
          </Animated.View>

          {/* Nope overlay */}
          <Animated.View
            style={[
              styles.overlay,
              styles.nopeOverlay,
              { opacity: nopeOpacity },
            ]}>
            <Text style={styles.overlayText}>SKIP</Text>
          </Animated.View>

          {/* Hashtags */}
          <View style={styles.hashtagsContainer}>
            {currentPhoto.hashtags.map((tag, index) => (
              <View key={index} style={styles.hashtag}>
                <Text style={styles.hashtagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.nopeBtn,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => handleButtonSwipe('left')}>
          <Text style={styles.actionBtnIcon}>✕</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.likeBtn,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => handleButtonSwipe('right')}>
          <Text style={styles.actionBtnIcon}>♥</Text>
        </Pressable>
      </View>
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
    paddingBottom: 10,
  },
  backIcon: {
    fontSize: 32,
    fontWeight: '300',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    padding: 16,
    borderRadius: 12,
    borderWidth: 4,
  },
  likeOverlay: {
    right: 30,
    borderColor: '#4CAF50',
    transform: [{ rotate: '15deg' }],
  },
  nopeOverlay: {
    left: 30,
    borderColor: '#F44336',
    transform: [{ rotate: '-15deg' }],
  },
  overlayText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  hashtagsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtag: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  hashtagText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    gap: 40,
  },
  actionBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nopeBtn: {
    backgroundColor: '#F44336',
  },
  likeBtn: {
    backgroundColor: '#4CAF50',
  },
  actionBtnIcon: {
    fontSize: 36,
    color: '#FFF',
    fontWeight: '700',
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  completedIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  completedSubtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    width: '100%',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
