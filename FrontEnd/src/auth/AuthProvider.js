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
  preferLocalhost: false,
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // === Recuperar token al abrir app ===
  useEffect(() => {
    (async () => {
      const savedToken = await SecureStore.getItemAsync("access_token");

      if (savedToken) {
        console.log("🔐 Token recuperado:", savedToken);

        setToken(savedToken);
        setUser({ token: savedToken });
      }

      setLoading(false);
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
        responseType: AuthSession.ResponseType.Code, // 🔄 PKCE obligatorio
        usePKCE: true,
        extraParams: {
          audience,
          prompt: "login",
        },
      });

      const result = await request.promptAsync(discovery);

      // === NUEVO: ya no devuelve accessToken, devuelve "code" ===
      if (result.type === "success" && result.params.code) {
        const code = result.params.code;

        // === Intercambiar code por access_token ===
        const tokenResponse = await fetch(`https://${domain}/oauth/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: clientId,
            code: code,
            redirect_uri: redirectUri,
            code_verifier: request.codeVerifier, // 🔥 NECESARIO PARA PKCE
          }),
        });

        const data = await tokenResponse.json();
        const access_token = data.access_token;

        if (access_token) {
          console.log("🔑 Token recibido:", access_token);

          await SecureStore.setItemAsync("access_token", access_token);

          setToken(access_token);
          setUser({ token: access_token });

          console.log("✅ Login exitoso con Auth0 + PKCE");
          return;
        } else {
          console.log("❌ Error obteniendo token:", data);
        }
      } else {
        Alert.alert("Error", "No se pudo iniciar sesión.");
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
