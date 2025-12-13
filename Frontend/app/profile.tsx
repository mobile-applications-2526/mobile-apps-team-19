import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  // User data - later van backend halen
  const [displayName, setDisplayName] = useState('Jack');
  const [email, setEmail] = useState('jack@example.com');
  const [isEditing, setIsEditing] = useState(false);

  const [stats] = useState({
    eventsJoined: 12,
    photosTaken: 234,
    albumsSaved: 8,
    friendsConnected: 45,
  });

  const handleSave = () => {
    // TODO: sla wijzigingen op naar backend
    setIsEditing(false);
      Alert.alert('Success', 'Profile updated!');
  };

  const StatCard = ({
    icon,
    value,
    label,
  }: {
    icon: string;
    value: number;
    label: string;
  }) => (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <Text style={[styles.statLabel, { color: colors.icon }]}>{label}</Text>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <ThemedText style={styles.headerTitle}>Profile</ThemedText>
        <Pressable onPress={() => router.push('/settings')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Pressable style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </Pressable>
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.label, { color: colors.icon }]}>
              Display Name
            </Text>
            {isEditing ? (
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter name"
                placeholderTextColor={colors.icon}
              />
            ) : (
              <ThemedText style={styles.value}>{displayName}</ThemedText>
            )}

            <Text style={[styles.label, { color: colors.icon }]}>Email</Text>
            {isEditing ? (
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                placeholderTextColor={colors.icon}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <ThemedText style={styles.value}>{email}</ThemedText>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.editButton,
                { backgroundColor: isEditing ? '#0066FF' : 'transparent', borderColor: colors.border },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}>
              <Text
                style={[
                  styles.editButtonText,
                  { color: isEditing ? '#FFF' : colors.text },
                ]}>
                {isEditing ? 'Save' : 'Edit Profile'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <ThemedText style={styles.sectionTitle}>Statistics</ThemedText>
          <View style={styles.statsGrid}>
            <StatCard
              icon="🎉"
              value={stats.eventsJoined}
              label="Events"
            />
            <StatCard
              icon="📷"
              value={stats.photosTaken}
              label="Foto's"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              icon="📁"
              value={stats.albumsSaved}
              label="Albums"
            />
            <StatCard
              icon="👥"
              value={stats.friendsConnected}
              label="Friends"
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <ThemedText style={styles.sectionTitle}>
            Recent Activity
          </ThemedText>
          {[
            { icon: '🎉', text: 'Joined Birthday Party', time: '2 hours ago' },
            { icon: '📷', text: 'Took 15 photos', time: '5 hours ago' },
            { icon: '💾', text: 'Saved album: Weekend Trip', time: '1 day ago' },
          ].map((activity, index) => (
            <View
              key={index}
              style={[
                styles.activityItem,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}>
              <Text style={styles.activityIcon}>{activity.icon}</Text>
              <View style={styles.activityText}>
                <ThemedText style={styles.activityTitle}>
                  {activity.text}
                </ThemedText>
                <Text style={[styles.activityTime, { color: colors.icon }]}>
                  {activity.time}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
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
  settingsIcon: {
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: '600',
  },
  changePhotoButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    color: '#0066FF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
    marginLeft: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 4,
  },
  input: {
    fontSize: 18,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  editButton: {
    marginTop: 24,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  activitySection: {
    padding: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  activityIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 13,
  },
});
