import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => Promise<void>;
  checkLoginStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    // Skip on SSR
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }
    
    try {
      const loggedInUser = await AsyncStorage.getItem("loggedInUser");
      setIsLoggedIn(!!loggedInUser);
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
    }
  };

  const logout = async () => {
    // Skip on SSR
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }
    
    try {
      await AsyncStorage.removeItem("loggedInUser");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    // Skip on server-side rendering
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }
    
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, logout, checkLoginStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
