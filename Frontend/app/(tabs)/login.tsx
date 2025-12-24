import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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
} from "react-native";

export default function LoginScreen() {
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
      <ThemedText style={styles.title}>Login</ThemedText>

      <View style={styles.formContainer}>
        <ThemedText style={styles.label}>Username or Email</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <ThemedText style={styles.label}>Password</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>Login</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
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
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
