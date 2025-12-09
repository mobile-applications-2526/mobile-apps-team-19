
export type User = {
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
    password?: string;
};



export type StatusMessage = {
    message: string;
    type: "error" | "success";
};
