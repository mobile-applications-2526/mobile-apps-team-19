import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Header } from "@/components/header";
import { useThemeMode } from "@/theme/ThemeProvider";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function SignupScreen() {
  const { themeMode } = useThemeMode();
  const colors = Colors[themeMode];
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!firstName || !lastName || !username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL + "/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            username,
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server error response:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      Alert.alert("Success", "Account created successfully!");
      router.push("/(tabs)/login");
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
      console.error("Signup error:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formWrapper}>
            <ThemedText style={styles.title}>Create Account</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
              Join us today
            </ThemedText>

            <View style={styles.formContainer}>
              <ThemedText style={styles.label}>First Name</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      themeMode === "dark" ? "#1F2937" : "#F9FAFB",
                    color: colors.text,
                    borderColor: themeMode === "dark" ? "#374151" : "#E5E7EB",
                  },
                ]}
                placeholder="Enter your first name"
                placeholderTextColor={colors.icon}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />

              <ThemedText style={styles.label}>Last Name</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      themeMode === "dark" ? "#1F2937" : "#F9FAFB",
                    color: colors.text,
                    borderColor: themeMode === "dark" ? "#374151" : "#E5E7EB",
                  },
                ]}
                placeholder="Enter your last name"
                placeholderTextColor={colors.icon}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />

              <ThemedText style={styles.label}>Username</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      themeMode === "dark" ? "#1F2937" : "#F9FAFB",
                    color: colors.text,
                    borderColor: themeMode === "dark" ? "#374151" : "#E5E7EB",
                  },
                ]}
                placeholder="Choose a username"
                placeholderTextColor={colors.icon}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      themeMode === "dark" ? "#1F2937" : "#F9FAFB",
                    color: colors.text,
                    borderColor: themeMode === "dark" ? "#374151" : "#E5E7EB",
                  },
                ]}
                placeholder="Enter your email"
                placeholderTextColor={colors.icon}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      themeMode === "dark" ? "#1F2937" : "#F9FAFB",
                    color: colors.text,
                    borderColor: themeMode === "dark" ? "#374151" : "#E5E7EB",
                  },
                ]}
                placeholder="Create a password (min 6 characters)"
                placeholderTextColor={colors.icon}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <ThemedText style={[styles.loginText, { color: colors.text }]}>
                  Already have an account?{" "}
                </ThemedText>
                <TouchableOpacity onPress={() => router.push("/(tabs)/login")}>
                  <ThemedText style={styles.loginLink}>Login</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: "5%",
    paddingVertical: 20,
    paddingBottom: 100,
  },
  formWrapper: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#7C3AED",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 4,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7C3AED",
  },
});
