export type CreateEventData = {
    name: string;
    date: string;
    hostName: string;
    startTime: string;
    endTime: string;
    location?: string;
    usernames?: string[];
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getEvents = async () => {
    return fetch(`${API_URL}/events`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const createEvent = async (eventData: CreateEventData) => {
    return fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
    });
};

export const getEventByName = async (name: string) => {
    return fetch(`${API_URL}/events/${encodeURIComponent(name)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const deleteEvent = async (name: string) => {
    return fetch(`${API_URL}/events/${encodeURIComponent(name)}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const joinEvent = async (eventName: string, username: string) => {
    return fetch(`${API_URL}/events/${encodeURIComponent(eventName)}/join`, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
        body: username,
    });
};
