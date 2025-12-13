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
      'Cache Wissen',
      'Weet je zeker dat je de cache wilt wissen? Dit verwijdert tijdelijke bestanden.',
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Wis Cache',
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
      'Uitloggen',
      'Weet je zeker dat je wilt uitloggen?',
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Uitloggen',
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
        <ThemedText style={styles.headerTitle}>Instellingen</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Notificaties Sectie */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>
            MELDINGEN
          </Text>
          <SettingItem
            icon="🔔"
            title="Notificaties"
            subtitle="Ontvang updates over events"
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingItem
            icon="📳"
            title="Vibratie"
            subtitle="Trillen bij notificaties"
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
            title="Hoge Kwaliteit"
            subtitle="Betere foto's, meer opslag"
            value={highQuality}
            onValueChange={setHighQuality}
          />
          <SettingItem
            icon="💾"
            title="Auto Opslaan"
            subtitle="Sla alle foto's automatisch op"
            value={autoSave}
            onValueChange={setAutoSave}
          />
        </View>

        {/* Opslag Sectie */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>
            OPSLAG
          </Text>
          <SettingItem
            icon="🗑️"
            title="Cache Wissen"
            subtitle="Verwijder tijdelijke bestanden"
            showArrow
            onPress={handleClearCache}
          />
          <SettingItem
            icon="📊"
            title="Opslag Gebruik"
            subtitle="Bekijk hoeveel ruimte je gebruikt"
            showArrow
            onPress={() => console.log('Opslag bekijken')}
          />
        </View>

        {/* Info Sectie */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>
            INFORMATIE
          </Text>
          <SettingItem
            icon="ℹ️"
            title="Over Recall"
            subtitle="Versie 1.0.0"
            showArrow
            onPress={() => console.log('Over pagina')}
          />
          <SettingItem
            icon="📄"
            title="Privacy Beleid"
            showArrow
            onPress={() => console.log('Privacy beleid')}
          />
          <SettingItem
            icon="📧"
            title="Contact"
            subtitle="Help en feedback"
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
            <Text style={styles.logoutText}>Uitloggen</Text>
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
