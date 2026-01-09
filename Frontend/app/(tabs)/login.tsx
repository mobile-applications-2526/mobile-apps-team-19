import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Header } from "@/components/header";
import { useThemeMode } from "@/theme/ThemeProvider";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import UserService from "@/service/userService";
import { tokenManager } from "@/utils/tokenManager";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";

export default function LoginScreen() {
  const { themeMode } = useThemeMode();
  const colors = Colors[themeMode];
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;
  const { setIsLoggedIn } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const result = await UserService.loginUser({ username, password });
      console.log("Login result:", JSON.stringify(result, null, 2));

      // Save token and username using tokenManager
      await tokenManager.saveToken(result.token, result.username);

      setIsLoggedIn(true);

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
            <ThemedText
              style={[styles.title, { fontSize: isSmallScreen ? 24 : 32 }]}
            >
              Welcome Back
            </ThemedText>
            <ThemedText
              style={[
                styles.subtitle,
                { color: colors.icon, fontSize: isSmallScreen ? 14 : 16 },
              ]}
            >
              Sign in to continue
            </ThemedText>

            <View style={styles.formContainer}>
              <ThemedText
                style={[styles.label, { fontSize: isSmallScreen ? 14 : 16 }]}
              >
                Username or Email
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      themeMode === "dark" ? "#1F2937" : "#F9FAFB",
                    color: colors.text,
                    borderColor: themeMode === "dark" ? "#374151" : "#E5E7EB",
                    fontSize: isSmallScreen ? 14 : 16,
                    padding: isSmallScreen ? 12 : 16,
                  },
                ]}
                placeholder="Enter your username"
                placeholderTextColor={colors.icon}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              <ThemedText
                style={[styles.label, { fontSize: isSmallScreen ? 14 : 16 }]}
              >
                Password
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      themeMode === "dark" ? "#1F2937" : "#F9FAFB",
                    color: colors.text,
                    borderColor: themeMode === "dark" ? "#374151" : "#E5E7EB",
                    fontSize: isSmallScreen ? 14 : 16,
                    padding: isSmallScreen ? 12 : 16,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={colors.icon}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={[styles.button, { padding: isSmallScreen ? 12 : 16 }]}
                onPress={handleLogin}
              >
                <ThemedText
                  style={[
                    styles.buttonText,
                    { fontSize: isSmallScreen ? 16 : 18 },
                  ]}
                >
                  Login
                </ThemedText>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <ThemedText
                  style={[
                    styles.signupText,
                    { color: colors.text, fontSize: isSmallScreen ? 12 : 14 },
                  ]}
                >
                  Don't have an account?{" "}
                </ThemedText>
                <TouchableOpacity onPress={() => router.push("/(tabs)/signup")}>
                  <ThemedText
                    style={[
                      styles.signupLink,
                      { fontSize: isSmallScreen ? 12 : 14 },
                    ]}
                  >
                    Sign up
                  </ThemedText>
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
    paddingVertical: 15,
    paddingBottom: 40,
  },
  formWrapper: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 25,
  },
  formContainer: {
    width: "100%",
  },
  label: {
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#7C3AED",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 4,
  },
  signupText: {},
  signupLink: {
    fontWeight: "bold",
    color: "#7C3AED",
  },
});
