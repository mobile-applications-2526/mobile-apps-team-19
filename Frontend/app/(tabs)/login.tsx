import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Header } from "@/components/header";
import { useThemeMode } from "@/theme/ThemeProvider";
import { Colors } from "@/constants/theme";
import UserService from "@/service/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function LoginScreen() {
  const { themeMode } = useThemeMode();
  const colors = Colors[themeMode];
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const result = await UserService.loginUser({ username, password });
      console.log("Login result:", JSON.stringify(result, null, 2));

      const userDataToSave = {
        token: result.token,
        username: result.username,
      };

      await AsyncStorage.setItem(
        "loggedInUser",
        JSON.stringify(userDataToSave)
      );
      console.log(
        "User saved to AsyncStorage:",
        JSON.stringify(userDataToSave, null, 2)
      );

      Alert.alert("Success", "Login successful!");

      setTimeout(() => {
        router.push("/(tabs)");
      }, 100);
    } catch (error) {
      Alert.alert(
        "Error",
        "Login failed. Please check your credentials and network connection."
      );
      console.error("Login error:", error);
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
            <ThemedText style={styles.title}>Welcome Back</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
              Sign in to continue
            </ThemedText>

            <View style={styles.formContainer}>
              <ThemedText style={styles.label}>Username or Email</ThemedText>
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
                placeholder="Enter your username"
                placeholderTextColor={colors.icon}
                value={username}
                onChangeText={setUsername}
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
                placeholder="Enter your password"
                placeholderTextColor={colors.icon}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <ThemedText style={styles.buttonText}>Login</ThemedText>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <ThemedText style={[styles.signupText, { color: colors.text }]}>
                  Don't have an account?{" "}
                </ThemedText>
                <TouchableOpacity onPress={() => router.push("/(tabs)/signup")}>
                  <ThemedText style={styles.signupLink}>Sign up</ThemedText>
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
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 4,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7C3AED",
  },
});
