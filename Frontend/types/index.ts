
export type User = {
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
    password?: string;
};

export type Event = {
    id: string;
    eventId?: number;
    eventName?: string; 
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
