import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function EventLobbyScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [event, setEvent] = useState({
    id: params.eventId as string,
    name: 'Birthday Party 🎉',
    code: params.code as string || 'BDAY24',
    startTime: '2025-12-13T18:00:00',
    endTime: '2025-12-13T23:00:00',
    photoCount: 0,
    participants: [
      { id: 1, name: 'You', isHost: true },
    ],
  });

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(event.endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff < 0) return 'Event beëindigd';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const handleShareCode = async () => {
    try {
      await Share.share({
        message: `Join my event "${event.name}"!\nCode: ${event.code}\n\nOpen Recall app and enter this code.`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenCamera = () => {
    router.push('/camera-test');
  };

  const handleViewPhotos = () => {
    router.push({
      pathname: '/review-mode',
      params: { eventId: event.id },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Event Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <ThemedText style={styles.eventName}>{event.name}</ThemedText>
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Event Code</Text>
            <Text style={styles.code}>{event.code}</Text>
          </View>
        </View>

        {/* Countdown */}
        <View style={[styles.countdownCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={styles.countdownIcon}>⏱️</Text>
          <View>
            <Text style={[styles.countdownLabel, { color: colors.icon }]}>
              Tijd over
            </Text>
            <ThemedText style={styles.countdownValue}>
              {getTimeRemaining()}
            </ThemedText>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={styles.statIcon}>📷</Text>
            <ThemedText style={styles.statValue}>{event.photoCount}</ThemedText>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Foto's</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={styles.statIcon}>👥</Text>
            <ThemedText style={styles.statValue}>{event.participants.length}</ThemedText>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Deelnemers</Text>
          </View>
        </View>

        {/* Participants List */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Deelnemers</ThemedText>
          {event.participants.map((participant) => (
            <View
              key={participant.id}
              style={[styles.participantItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {participant.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <ThemedText style={styles.participantName}>
                {participant.name}
              </ThemedText>
              {participant.isHost && (
                <View style={styles.hostBadge}>
                  <Text style={styles.hostText}>Host</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.secondaryButton,
            { borderColor: colors.border },
            pressed && { opacity: 0.7 },
          ]}
          onPress={handleShareCode}>
          <Text style={styles.actionButtonIcon}>🔗</Text>
          <Text style={[styles.actionButtonText, { color: colors.text }]}>
            Deel Code
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.primaryButton,
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleOpenCamera}>
          <Text style={styles.actionButtonIcon}>📷</Text>
          <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
            Neem Foto
          </Text>
        </Pressable>

        {event.photoCount > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.viewPhotosButton,
              { borderColor: colors.border },
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleViewPhotos}>
            <Text style={[styles.viewPhotosText, { color: colors.text }]}>
              Bekijk Foto's ({event.photoCount})
            </Text>
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  eventName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  codeContainer: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  codeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  code: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: '#0066FF',
    letterSpacing: 4,
  },
  countdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
  },
  countdownIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  countdownLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  countdownValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  participantName: {
    flex: 1,
    fontSize: 16,
  },
  hostBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hostText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#0066FF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  actionButtonIcon: {
    fontSize: 20,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewPhotosButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  viewPhotosText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
