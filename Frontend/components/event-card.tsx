import React from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export type Event = {
    id: string;
    title: string;
    dateRange: string;
    location?: string;
    photoCount: number;
    thumbnails: string[]; 
};

type EventCardProps = {
    event: Event;
    onPress: () => void;
};

export function EventCard({ event, onPress }: EventCardProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                { backgroundColor: colors.background },
                pressed && styles.cardPressed,
            ]}
            onPress={onPress}>
            <View style={styles.thumbnailContainer}>
                {event.thumbnails.slice(0, 4).map((thumb, index) => (
                    <View
                        key={index}
                        style={[
                            styles.thumbnail,
                            { backgroundColor: colors.icon + '20' },
                        ]}>
                        {thumb ? (
                            <Image source={{ uri: thumb }} style={styles.thumbnailImage} />
                        ) : (
                            <Text style={[styles.placeholderText, { color: colors.icon }]}>
                                📷
                            </Text>
                        )}
                    </View>
                ))}
            </View>

            <View style={styles.details}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {event.title}
                </Text>
                <Text style={[styles.meta, { color: colors.icon }]}>
                    {event.photoCount} {event.photoCount === 1 ? 'photo' : 'photos'} · {event.dateRange}
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardPressed: {
        opacity: 0.7,
    },
    thumbnailContainer: {
        width: 100,
        height: 100,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        marginRight: 16,
    },
    thumbnail: {
        width: 48,
        height: 48,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
    placeholderText: {
        fontSize: 20,
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
