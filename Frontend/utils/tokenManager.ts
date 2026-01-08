import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const USERNAME_KEY = "username";

export const tokenManager = {
  async saveToken(
    token: string,
    username?: string
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      if (username) {
        await AsyncStorage.setItem(USERNAME_KEY, username);
      }
      console.log("Token saved successfully");
    } catch (error) {
      console.error("Error saving token:", error);
      throw error;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      console.log("Token retrieved:", token ? "exists" : "null");
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  async getUsername(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(USERNAME_KEY);
    } catch (error) {
      console.error("Error getting username:", error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USERNAME_KEY);
      console.log("Token and username removed successfully");
    } catch (error) {
      console.error("Error removing token:", error);
      throw error;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  },
};
