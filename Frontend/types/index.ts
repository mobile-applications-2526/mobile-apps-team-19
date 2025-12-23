
export type User = {
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
    password?: string;
};

export type Event = {
    id: string;
    eventId?: number; // Numeric ID for backend operations
    title: string;
    date?: string;
    dateRange?: string;
    location?: string;
    photoCount?: number;
    description?: string;
    usernames?: string[];
};

export type StatusMessage = {
    message: string;
    type: "error" | "success";
};
