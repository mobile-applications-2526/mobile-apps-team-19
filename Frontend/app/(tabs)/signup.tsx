import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (!firstName || !lastName || !username || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        try {
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    username,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Server error response:', errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            Alert.alert('Success', 'Account created successfully!');
            router.push('/(tabs)/login');
        } catch (error) {
            Alert.alert('Error', 'Registration failed. Please try again.');
            console.error('Signup error:', error);
        }
    };

    return (
        <ScrollView>
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title}>Create Account</ThemedText>

                <View style={styles.formContainer}>
                    <ThemedText style={styles.label}>First Name</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your first name"
                        placeholderTextColor="#999"
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCapitalize="words"
                    />

                    <ThemedText style={styles.label}>Last Name</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your last name"
                        placeholderTextColor="#999"
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize="words"
                    />

                    <ThemedText style={styles.label}>Username</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Choose a username"
                        placeholderTextColor="#999"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <ThemedText style={styles.label}>Email</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <ThemedText style={styles.label}>Password</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Create a password (min 6 characters)"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSignup}>
                        <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => router.push('/(tabs)/login')}
                    >
                        <ThemedText style={styles.linkText}>
                            Already have an account? Login
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
    },
    formContainer: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        fontSize: 14,
        color: '#007AFF',
    },
});
