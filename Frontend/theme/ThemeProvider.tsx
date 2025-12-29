import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/theme";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeContextValue>({
  themeMode: "light",
  toggleTheme: () => undefined,
  setThemeMode: () => undefined,
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

type AppThemeProviderProps = {
  children: ReactNode;
};

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  const LightTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: Colors.light.background,
        card: Colors.light.background,
        text: Colors.light.text,
        primary: "#7C3AED",
        border: "#E5E7EB",
        notification: "#7C3AED",
      },
    }),
    []
  );

  const DarkAppTheme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: Colors.dark.background,
        card: Colors.dark.background,
        text: Colors.dark.text,
        primary: "#7C3AED",
        border: "#1F2933",
        notification: "#7C3AED",
      },
    }),
    []
  );

  const appTheme = themeMode === "dark" ? DarkAppTheme : LightTheme;
  const statusBarStyle = themeMode === "dark" ? "light" : "dark";
  const toggleTheme = () =>
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeModeContext.Provider value={{ themeMode, toggleTheme, setThemeMode }}>
      <ThemeProvider value={appTheme}>
        {children}
        <StatusBar style={statusBarStyle} />
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
