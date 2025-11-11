import React, { createContext, useContext, useEffect, useState } from "react";
import Auth0 from "react-native-auth0";
import * as SecureStore from "expo-secure-store";
import api from "../api/client";

const auth0 = new Auth0({
    domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN,
    clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID,
    });

    const AuthContext = createContext(null);
    export const useAuth = () => useContext(AuthContext);

    export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { (async () => {
        const token = await SecureStore.getItemAsync("access_token");
        if (token) await hydrate(token);
        setLoading(false);
    })(); }, []);

    const hydrate = async (token) => {
        try {
        const info = await auth0.auth.userInfo({ token });
        const { data } = await api.post("/perfil/sync", {
            sub: info.sub, email: info.email, name: info.name, picture: info.picture,
        });
        setUser({ ...info, roles: [data.role] });
        } catch { setUser(null); }
    };

    const login = async () => {
        const creds = await auth0.webAuth.authorize({ scope: "openid profile email" });
        await SecureStore.setItemAsync("access_token", creds.accessToken);
        await hydrate(creds.accessToken);
    };

    const logout = async () => {
        try { await auth0.webAuth.clearSession(); } catch {}
        await SecureStore.deleteItemAsync("access_token");
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
