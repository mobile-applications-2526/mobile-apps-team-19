import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function JoinEventScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [eventCode, setEventCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinEvent = async () => {
    if (!eventCode.trim()) {
      Alert.alert('Fout', 'Voer een event code in');
      return;
    }

    if (!displayName.trim()) {
      Alert.alert('Fout', 'Voer je naam in');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: call backend API om event te joinen
      // const response = await fetch(`${BACKEND_URL}/events/join`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code: eventCode, displayName }),
      // });

      // Mock success - ga naar event lobby
      setTimeout(() => {
        setIsLoading(false);
        router.push({
          pathname: '/event-lobby',
          params: {
            eventId: '123',
            code: eventCode.toUpperCase(),
          },
        });
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Fout', 'Kon niet joinen. Probeer opnieuw.');
      console.error(error);
    }
  };

  const handleScanQR = () => {
    // TODO: implementeer QR scanner
    Alert.alert('QR Scanner', 'QR scanner komt binnenkort...');
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <ThemedText style={styles.headerTitle}>Join Event</ThemedText>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.icon}>🎫</Text>
          <ThemedText style={styles.title}>Join een Event</ThemedText>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Voer de event code in die je hebt ontvangen
          </Text>

          {/* Event Code Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.icon }]}>
              Event Code
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.codeInput,
                {
                  color: colors.text,
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
              value={eventCode}
              onChangeText={(text) => setEventCode(text.toUpperCase())}
              placeholder="BDAY24"
              placeholderTextColor={colors.icon}
              autoCapitalize="characters"
              maxLength={10}
            />
          </View>

          {/* Display Name Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.icon }]}>
              Jouw Naam
            </Text>
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
              placeholder="Jack"
              placeholderTextColor={colors.icon}
              autoCapitalize="words"
            />
          </View>

          {/* Join Button */}
          <Pressable
            style={({ pressed }) => [
              styles.joinButton,
              pressed && { opacity: 0.8 },
              isLoading && { opacity: 0.6 },
            ]}
            onPress={handleJoinEvent}
            disabled={isLoading}>
            <Text style={styles.joinButtonText}>
              {isLoading ? 'Joinen...' : 'Join Event'}
            </Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.icon }]}>of</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* QR Code Button */}
          <Pressable
            style={({ pressed }) => [
              styles.qrButton,
              { borderColor: colors.border },
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleScanQR}>
            <Text style={styles.qrIcon}>📷</Text>
            <Text style={[styles.qrButtonText, { color: colors.text }]}>
              Scan QR Code
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 18,
  },
  codeInput: {
    fontFamily: 'monospace',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 4,
    textAlign: 'center',
  },
  joinButton: {
    width: '100%',
    backgroundColor: '#0066FF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  joinButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    marginHorizontal: 12,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  qrIcon: {
    fontSize: 24,
  },
  qrButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
