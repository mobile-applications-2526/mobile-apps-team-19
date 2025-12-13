import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  // Settings state - later opslaan in async storage
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [highQuality, setHighQuality] = useState(true);
  const [vibration, setVibration] = useState(true);

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the cache? This will remove temporary files.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: () => {
            // TODO: implementeer cache wissen
            console.log('Cache gewist');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            // TODO: implementeer logout
            console.log('Uitgelogd');
            router.replace('/');
          },
        },
      ]
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    value,
    onValueChange,
    showArrow = false,
    onPress,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    showArrow?: boolean;
    onPress?: () => void;
  }) => (
    <Pressable
      style={({ pressed }) => [
        styles.settingItem,
        { backgroundColor: colors.background, borderColor: colors.border },
        pressed && { opacity: 0.7 },
      ]}
      onPress={onPress}
      disabled={!onPress && !onValueChange}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <ThemedText style={styles.settingTitle}>{title}</ThemedText>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.icon }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {onValueChange && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: '#0066FF' }}
          thumbColor={value ? '#FFF' : '#f4f3f4'}
        />
      )}
      {showArrow && <Text style={styles.arrowIcon}>›</Text>}
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <ThemedText style={styles.headerTitle}>Settings</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Notificaties Sectie */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>
            NOTIFICATIONS
          </Text>
          <SettingItem
            icon="🔔"
            title="Notifications"
            subtitle="Receive updates about events"
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingItem
            icon="📳"
            title="Vibration"
            subtitle="Vibrate on notifications"
            value={vibration}
            onValueChange={setVibration}
          />
        </View>

        {/* Camera Sectie */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>
            CAMERA
          </Text>
          <SettingItem
            icon="📸"
            title="High Quality"
            subtitle="Better photos, more storage"
            value={highQuality}
            onValueChange={setHighQuality}
          />
          <SettingItem
            icon="💾"
            title="Auto Save"
            subtitle="Save all photos automatically"
            value={autoSave}
            onValueChange={setAutoSave}
          />
        </View>

        {/* Opslag Sectie */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>
            STORAGE
          </Text>
          <SettingItem
            icon="🗑️"
            title="Clear Cache"
            subtitle="Remove temporary files"
            showArrow
            onPress={handleClearCache}
          />
          <SettingItem
            icon="📊"
            title="Storage Usage"
            subtitle="View how much space you're using"
            showArrow
            onPress={() => console.log('Opslag bekijken')}
          />
        </View>

        {/* Info Sectie */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>
            INFORMATION
          </Text>
          <SettingItem
            icon="ℹ️"
            title="About Recall"
            subtitle="Version 1.0.0"
            showArrow
            onPress={() => console.log('Over pagina')}
          />
          <SettingItem
            icon="📄"
            title="Privacy Policy"
            showArrow
            onPress={() => console.log('Privacy beleid')}
          />
          <SettingItem
            icon="📧"
            title="Contact"
            subtitle="Help and feedback"
            showArrow
            onPress={() => console.log('Contact')}
          />
        </View>

        {/* Account Sectie */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>
            ACCOUNT
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
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
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
  },
  arrowIcon: {
    fontSize: 28,
    color: '#999',
    fontWeight: '300',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
