import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../auth/AuthProvider";
export default function Perfil() {
    const { user, logout } = useAuth();
    return (
        <View style={styles.c}>
        <Image source={{ uri: user?.picture }} style={styles.i} />
        <Text style={styles.t}>{user?.name}</Text>
        <Text>{user?.email}</Text>
        <TouchableOpacity style={styles.btn} onPress={logout}>
            <Text style={{ color: "#fff" }}>Cerrar sesión</Text>
        </TouchableOpacity>
        </View>
    );
    }
    const styles = StyleSheet.create({
    c: { flex: 1, alignItems: "center", justifyContent: "center" },
    i: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
    t: { fontWeight: "bold", fontSize: 18 },
    btn: { backgroundColor: "#6A1B9A", padding: 14, borderRadius: 8, marginTop: 16 },
});
