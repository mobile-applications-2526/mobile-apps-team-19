import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type Event = {
    id: string;
    title: string;
    date?: string;
    dateRange?: string;
    location?: string;
    photoCount?: number;
    description?: string;
    usernames?: string[];
};

type EventCardProps = {
    event: Event;
    onPress: () => void;
};

export function EventCard({ event, onPress }: EventCardProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const displayDate = event.dateRange || event.date || 'Date not set';
    const photoInfo = event.photoCount !== undefined
        ? `${event.photoCount} ${event.photoCount === 1 ? 'photo' : 'photos'}`
        : null;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                {
                    backgroundColor: colors.background,
                    borderColor: colors.icon + '20',
                },
                pressed && styles.cardPressed,
            ]}
            onPress={onPress}>
            <View style={styles.iconPill}>
                <Text style={styles.iconText}>📅</Text>
            </View>

            <View style={styles.details}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {event.title}
                </Text>
                <Text style={[styles.meta, { color: colors.icon }]}>
                    {photoInfo ? `${photoInfo} · ${displayDate}` : displayDate}
                </Text>
                {event.location && (
                    <Text style={[styles.location, { color: colors.icon }]} numberOfLines={1}>
                        📍 {event.location}
                    </Text>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    cardPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
    iconPill: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    iconText: {
        fontSize: 28,
    },
    details: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    meta: {
        fontSize: 14,
        marginBottom: 2,
    },
    location: {
        fontSize: 13,
        marginTop: 4,
    },
});
