import React, { createContext, useContext, useState, useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// === VARIABLES DE ENTORNO ===
const domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID;
const audience = process.env.EXPO_PUBLIC_AUTH0_AUDIENCE; // 👈 Agregado

// === Redirect URI generado automáticamente por Expo ===
const redirectUri = AuthSession.makeRedirectUri({
    scheme: "com.joacoglsk.reporteciudadano",
    });

    export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Recupera token guardado si existe
    useEffect(() => {
        (async () => {
        const token = await SecureStore.getItemAsync("access_token");
        if (token) setUser({ token });
        setLoading(false);
        })();
    }, []);

    // === LOGIN CON AUTH0 ===
    const login = async () => {
        try {
        const discovery = {
            authorizationEndpoint: `https://${domain}/authorize`,
            tokenEndpoint: `https://${domain}/oauth/token`,
            revocationEndpoint: `https://${domain}/oauth/revoke`,
        };

        console.log("🔗 Redirect URI generada por Expo:", redirectUri);

        const request = new AuthSession.AuthRequest({
            clientId,
            redirectUri,
            scopes: ["openid", "profile", "email"],
            responseType: AuthSession.ResponseType.Token,
            extraParams: {
            audience,        // 👈 NECESARIO para obtener un access_token válido para tu API
            prompt: "login", // 👈 fuerza a elegir cuenta cada vez (opcional)
            },
        });

        const result = await request.promptAsync(discovery);

        if (result.type === "success" && result.authentication?.accessToken) {
            console.log("🧩 Token recibido:", result.authentication.accessToken); // 👈 Agregá esto
            await SecureStore.setItemAsync("access_token", result.authentication.accessToken);
            setUser({ token: result.authentication.accessToken });
            console.log("✅ Login exitoso. Token guardado en SecureStore.");
        } else {
            Alert.alert("Error", "No se pudo iniciar sesión con Auth0.");
            console.log("❌ Resultado inesperado:", result);
        }
        } catch (error) {
        console.error("💥 Error en login:", error);
        }
    };

    // === LOGOUT ===
    const logout = async () => {
        await SecureStore.deleteItemAsync("access_token");
        setUser(null);
        console.log("👋 Sesión cerrada correctamente.");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}
