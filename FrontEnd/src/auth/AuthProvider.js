import React, { createContext, useContext, useState, useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// === VARIABLES DE ENTORNO ===
const domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID;
const audience = process.env.EXPO_PUBLIC_AUTH0_AUDIENCE;

// === Redirect URI generado por Expo ===
const redirectUri = AuthSession.makeRedirectUri({
    scheme: "com.joacoglsk.reporteciudadano",
    });

    export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);      // { token, name, email, picture }
    const [token, setToken] = useState(null);    // 👈 Necesitamos token separado
    const [loading, setLoading] = useState(true);

    // === Al iniciar la app: intenta recuperar token guardado ===
    useEffect(() => {
        (async () => {
        const savedToken = await SecureStore.getItemAsync("access_token");

        if (savedToken) {
            console.log("🔐 Token recuperado:", savedToken);

            setToken(savedToken);
            setUser({ token: savedToken });  // Mantenemos compatibilidad
        }

        setLoading(false);  // 👈 SIEMPRE TERMINA
        })();
    }, []);

    // === LOGIN ===
    const login = async () => {
        try {
        const discovery = {
            authorizationEndpoint: `https://${domain}/authorize`,
            tokenEndpoint: `https://${domain}/oauth/token`,
            revocationEndpoint: `https://${domain}/oauth/revoke`,
        };

        const request = new AuthSession.AuthRequest({
            clientId,
            redirectUri,
            scopes: ["openid", "profile", "email"],
            responseType: AuthSession.ResponseType.Token,
            extraParams: {
            audience, // NECESARIO para tu API
            prompt: "login",
            },
        });

        const result = await request.promptAsync(discovery);

        if (result.type === "success" && result.authentication?.accessToken) {
            const accessToken = result.authentication.accessToken;

            console.log("🧩 Token recibido:", accessToken);

            await SecureStore.setItemAsync("access_token", accessToken);

            setToken(accessToken);
            setUser({ token: accessToken });

            console.log("✅ Login exitoso, token guardado.");
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
        setToken(null);
        console.log("👋 Sesión cerrada correctamente.");
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}
