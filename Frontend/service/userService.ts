import { User } from "@/types";

const loginUser = async (user: User) => {
    try {
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Server error response:", errorData);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

const UserService = {
    loginUser,
};

export default UserService;