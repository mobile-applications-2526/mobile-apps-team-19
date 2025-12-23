import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Picture = {
    url: string;
    tags: string;
};

type EventDetails = {
    name: string;
    date: string;
    hostName?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    pictures: Picture[];
    usernames?: string[];
};

export default function EventDetailsScreen() {
    const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
    const router = useRouter();
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const screenWidth = Dimensions.get('window').width;
    const imageSize = (screenWidth - 48) / 3; // 3 columns with padding

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch event by name (title is the event name)
            const eventName = title || id;
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/events`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch event details: ${response.status}`);
            }

            const text = await response.text();
            let allEvents;

            try {
                allEvents = JSON.parse(text);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                // Try to extract event data from malformed JSON
                const eventMatch = text.match(/"name":"([^"]+)","date":"([^"]+)","hostName":"([^"]+)","startTime":"([^"]+)","endTime":"([^"]+)"/);
                if (eventMatch) {
                    const [_, name, date, hostName, startTime, endTime] = eventMatch;
                    setEvent({
                        name: name,
                        date: date,
                        hostName: hostName,
                        startTime: startTime,
                        endTime: endTime,
                        pictures: [],
                    });
                    return;
                }
                throw new Error('Unable to parse event data');
            }

            // Find the specific event by name
            const eventData = Array.isArray(allEvents)
                ? allEvents.find(e => e.name === eventName || e.name === decodeURIComponent(eventName))
                : allEvents;

            if (!eventData) {
                throw new Error('Event not found');
            }

            setEvent({
                name: eventData.name,
                date: eventData.date,
                hostName: eventData.hostName,
                startTime: eventData.startTime,
                endTime: eventData.endTime,
                location: eventData.location,
                pictures: eventData.pictures || [],
                usernames: eventData.usernames || [],
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching event details:', err);

            // Fallback with empty data
            setEvent({
                name: title || 'Event',
                date: '',
                pictures: [],
            });
        } finally {
            setLoading(false);
        }
    };

    const openImageFullscreen = (imageUri: string) => {
        setSelectedImage(imageUri);
    };

    const closeImageFullscreen = () => {
        setSelectedImage(null);
    };

    const handleCameraPress = () => {
        router.push('/camera-test');
    };

    if (loading) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.tint} />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ScrollView>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ThemedText style={styles.backButtonText}>← Back</ThemedText>
                    </Pressable>
                    <ThemedText style={styles.title}>{event?.name || title}</ThemedText>
                    {event?.date && (
                        <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
                            📅 {event.date}
                        </ThemedText>
                    )}
                    {event?.hostName && (
                        <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
                            📍 {event.hostName}
                        </ThemedText>
                    )}
                    {event?.startTime && event?.endTime && (
                        <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
                            🕐 {event.startTime} - {event.endTime}
                        </ThemedText>
                    )}
                </View>

                {/* Images Grid */}
                {event?.pictures && event.pictures.length > 0 ? (
                    <View style={styles.imagesSection}>
                        <ThemedText style={styles.sectionTitle}>
                            Photos ({event.pictures.length})
                        </ThemedText>
                        <View style={styles.imageGrid}>
                            {event.pictures.map((picture, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => openImageFullscreen(picture.url)}
                                    style={[styles.imageContainer, { width: imageSize, height: imageSize }]}
                                >
                                    <Image
                                        source={{ uri: picture.url }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <ThemedText style={styles.emptyText}>📷</ThemedText>
                        <ThemedText style={[styles.emptySubtext, { color: colors.icon }]}>
                            No photos yet
                        </ThemedText>
                    </View>
                )}
            </ScrollView>

            {/* Fullscreen Image Modal */}
            {selectedImage && (
                <Pressable style={styles.fullscreenContainer} onPress={closeImageFullscreen}>
                    <View style={styles.fullscreenContent}>
                        <Pressable onPress={closeImageFullscreen} style={styles.closeButton}>
                            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
                        </Pressable>
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.fullscreenImage}
                            resizeMode="contain"
                        />
                    </View>
                </Pressable>
            )}

            {/* Floating Camera Button */}
            <Pressable
                style={({ pressed }) => [
                    styles.fab,
                    { backgroundColor: '#0066FF' },
                    pressed && styles.fabPressed,
                ]}
                onPress={handleCameraPress}>
                <Text style={styles.fabIcon}>📷</Text>
            </Pressable>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 24,
    },
    backButton: {
        marginBottom: 16,
    },
    backButtonText: {
        fontSize: 16,
        color: '#007AFF',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 4,
    },
    imagesSection: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    imageContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptySubtext: {
        fontSize: 16,
        textAlign: 'center',
    },
    fullscreenContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    fullscreenImage: {
        width: '100%',
        height: '100%',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 32,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.95 }],
    },
    fabIcon: {
        fontSize: 28,
    },
});
