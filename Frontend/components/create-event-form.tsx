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
  KeyboardAvoidingView,
  Platform,
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
  // const [hostName, setHostName] = useState("");
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
    // if (!hostName.trim()) {
    //   Alert.alert("Error", "Host name is required");
    //   return;
    // }
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
      // hostName: hostName.trim(),
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
      // setHostName("");
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formWrapper}>
          <Text
            style={[
              styles.title,
              { color: colors.text, fontSize: isSmallScreen ? 24 : 28 },
            ]}
          >
            Create New Event
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: colors.text, fontSize: isSmallScreen ? 14 : 16 },
                ]}
              >
                Event Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.icon + "40",
                    fontSize: isSmallScreen ? 14 : 16,
                    padding: isSmallScreen ? 12 : 16,
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
              <Text
                style={[
                  styles.label,
                  { color: colors.text, fontSize: isSmallScreen ? 14 : 16 },
                ]}
              >
                Date *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.icon + "40",
                    fontSize: isSmallScreen ? 14 : 16,
                    padding: isSmallScreen ? 12 : 16,
                  },
                ]}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD (e.g., 2024-12-25)"
                placeholderTextColor={colors.icon}
                editable={!isSubmitting}
              />
            </View>

            {/* <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: colors.text, fontSize: isSmallScreen ? 14 : 16 },
                ]}
              >
                Host Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.icon + "40",
                    fontSize: isSmallScreen ? 14 : 16,
                    padding: isSmallScreen ? 12 : 16,
                  },
                ]}
                value={hostName}
                onChangeText={setHostName}
                placeholder="e.g., John Doe"
                placeholderTextColor={colors.icon}
                editable={!isSubmitting}
              />
            </View> */}

            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: colors.text, fontSize: isSmallScreen ? 14 : 16 },
                ]}
              >
                Start Time *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.icon + "40",
                    fontSize: isSmallScreen ? 14 : 16,
                    padding: isSmallScreen ? 12 : 16,
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
              <Text
                style={[
                  styles.label,
                  { color: colors.text, fontSize: isSmallScreen ? 14 : 16 },
                ]}
              >
                End Time *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.icon + "40",
                    fontSize: isSmallScreen ? 14 : 16,
                    padding: isSmallScreen ? 12 : 16,
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
              <Text
                style={[
                  styles.label,
                  { color: colors.text, fontSize: isSmallScreen ? 14 : 16 },
                ]}
              >
                Location
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.icon + "40",
                    fontSize: isSmallScreen ? 14 : 16,
                    padding: isSmallScreen ? 12 : 16,
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
                  {
                    backgroundColor: "#7C3AED",
                    padding: isSmallScreen ? 12 : 16,
                  },
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text
                    style={[
                      styles.buttonText,
                      { fontSize: isSmallScreen ? 16 : 18 },
                    ]}
                  >
                    Create Event
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: "5%",
    paddingVertical: 15,
    paddingBottom: 100,
  },
  formWrapper: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  form: {
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
