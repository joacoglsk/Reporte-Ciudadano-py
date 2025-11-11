import React, { createContext, useContext, useState } from "react";
import { Appearance } from "react-native";
const ThemeContext = createContext(null);
export const useThemeMode = () => useContext(ThemeContext);
export default function ThemeProvider({ children }) {
    const [mode, setMode] = useState(Appearance.getColorScheme() || "light");
    const toggle = () => setMode((m) => (m === "light" ? "dark" : "light"));
    const theme = mode === "light"
        ? { colors: { primary: "#6A1B9A", bg: "#fff", text: "#111" } }
        : { colors: { primary: "#BB86FC", bg: "#111", text: "#fff" } };
    return <ThemeContext.Provider value={{ mode, theme, toggle }}>{children}</ThemeContext.Provider>;
}
