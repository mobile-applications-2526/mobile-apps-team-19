import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/theme/ThemeProvider";
import { createEvent, type CreateEventData } from "@/service/eventService";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

type CreateEventFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CreateEventForm({ onSuccess, onCancel }: CreateEventFormProps) {
  const { themeMode } = useThemeMode();
  const colors = Colors[themeMode ?? "light"];
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [hostName, setHostName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Error", "Event name is required");
      return;
    }
    if (!date.trim()) {
      Alert.alert("Error", "Date is required (format: YYYY-MM-DD)");
      return;
    }
    if (!hostName.trim()) {
      Alert.alert("Error", "Host name is required");
      return;
    }
    if (!startTime.trim()) {
      Alert.alert("Error", "Start time is required (format: HH:MM)");
      return;
    }
    if (!endTime.trim()) {
      Alert.alert("Error", "End time is required (format: HH:MM)");
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      Alert.alert(
        "Error",
        "Invalid date format. Use YYYY-MM-DD (e.g., 2024-12-25)"
      );
      return;
    }

    // Validate time format (HH:MM or HH:MM:SS)
    const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
    if (!timeRegex.test(startTime)) {
      Alert.alert(
        "Error",
        "Invalid start time format. Use HH:MM (e.g., 18:00)"
      );
      return;
    }
    if (!timeRegex.test(endTime)) {
      Alert.alert("Error", "Invalid end time format. Use HH:MM (e.g., 23:30)");
      return;
    }

    const eventData: CreateEventData = {
      name: name.trim(),
      date: date.trim(),
      hostName: hostName.trim(),
      startTime:
        startTime.includes(":") && startTime.split(":").length === 2
          ? `${startTime}:00`
          : startTime,
      endTime:
        endTime.includes(":") && endTime.split(":").length === 2
          ? `${endTime}:00`
          : endTime,
      location: location.trim() || undefined,
    };

    setIsSubmitting(true);

    try {
      const response = await createEvent(eventData);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Failed to create event: ${response.status}`
        );
      }

      Alert.alert("Success", "Event created successfully!");

      // Reset form
      setName("");
      setDate("");
      setHostName("");
      setStartTime("");
      setEndTime("");
      setLocation("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to create event"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.form}>
        <Text style={[styles.title, { color: colors.text }]}>
          Create New Event
        </Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Event Name *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.icon + "40",
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Sarah's Birthday Party"
            placeholderTextColor={colors.icon}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Date *</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.icon + "40",
              },
            ]}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD (e.g., 2024-12-25)"
            placeholderTextColor={colors.icon}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Host Name *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.icon + "40",
              },
            ]}
            value={hostName}
            onChangeText={setHostName}
            placeholder="e.g., John Doe"
            placeholderTextColor={colors.icon}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Start Time *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.icon + "40",
              },
            ]}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="HH:MM (e.g., 18:00)"
            placeholderTextColor={colors.icon}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>End Time *</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.icon + "40",
              },
            ]}
            value={endTime}
            onChangeText={setEndTime}
            placeholder="HH:MM (e.g., 23:30)"
            placeholderTextColor={colors.icon}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Location</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.icon + "40",
              },
            ]}
            value={location}
            onChangeText={setLocation}
            placeholder="e.g., 123 Party Avenue"
            placeholderTextColor={colors.icon}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.button,
              styles.submitButton,
              { backgroundColor: "#007AFF" },
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Create Event</Text>
            )}
          </Pressable>

          {onCancel && (
            <Pressable
              style={[
                styles.button,
                styles.cancelButton,
                { borderColor: colors.icon },
              ]}
              onPress={onCancel}
              disabled={isSubmitting}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                Cancel
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
