import { tokenManager } from "@/utils/tokenManager";

export type CreateEventData = {
    name: string;
    date: string;
    // hostName: string;
    startTime: string;
    endTime: string;
    location?: string;
    usernames?: string[];
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const getAuthHeaders = async (): Promise<Headers> => {
    const token = await tokenManager.getToken();
    const headers = new Headers({
        "Content-Type": "application/json",
    });

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    } else {
        console.warn("No auth token found");
    }

    return headers;
};

export const getEvents = async () => {
    const headers = await getAuthHeaders();
    return fetch(`${API_URL}/events`, {
        method: "GET",
        headers,
    });
};

export const createEvent = async (eventData: CreateEventData) => {
    const headers = await getAuthHeaders();
    return fetch(`${API_URL}/events`, {
        method: "POST",
        headers,
        body: JSON.stringify(eventData),
    });
};

export const getEventByName = async (name: string) => {
    const headers = await getAuthHeaders();
    return fetch(`${API_URL}/events/${encodeURIComponent(name)}`, {
        method: "GET",
        headers,
    });
};

export const deleteEvent = async (name: string) => {
    const headers = await getAuthHeaders();
    return fetch(`${API_URL}/events/${encodeURIComponent(name)}`, {
        method: "DELETE",
        headers,
    });
};

export const deletePictureFromEvent = async (pictureId: number) => {
    console.log("deletePictureFromEvent called with ID:", pictureId);
    const headers = await getAuthHeaders();
    const url = `${API_URL}/pictures/${pictureId}`;
    console.log("Full API URL:", url);
    return fetch(url, {
        method: "DELETE",
        headers,
    });
}

export const joinEvent = async (eventName: string, username: string) => {
    const headers = await getAuthHeaders();
    headers.set("Content-Type", "text/plain");
    return fetch(`${API_URL}/events/${encodeURIComponent(eventName)}/join`, {
        method: "POST",
        headers,
        body: username,
    });
};
