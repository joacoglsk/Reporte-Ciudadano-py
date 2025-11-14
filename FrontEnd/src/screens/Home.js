import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import api from "../api/client";
import { useAuth } from "../auth/AuthProvider";

export default function Home({ navigation }) {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => { (async () => {
        const { data } = await api.get("/reportes/stats");
        setStats(data);
    })(); }, []);

    return (
        <View style={styles.bg}>
            <Text style={styles.welcome}>¡Hola {user?.name?.split(" ")[0]}! 👋</Text>
            <Text style={styles.desc}>Gracias por ayudar a mejorar nuestra ciudad.</Text>

            <View style={styles.card}>
                <Text style={styles.title}>📊 Resumen de reportes</Text>

                {stats && (
                    <>
                        <Text style={styles.item}>Total: {stats.total}</Text>
                        <Text style={styles.item}>Pendientes: {stats.pendientes}</Text>
                        <Text style={styles.item}>Resueltos: {stats.resueltos}</Text>
                    </>
                )}
            </View>

            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("AgregarReporte")}>
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>+ Nuevo reporte</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1, backgroundColor: "#E6D9F5", justifyContent: "center", alignItems: "center" },
    welcome: { fontSize: 24, fontWeight: "bold", color: "#5A2E8A" },
    desc: { color: "#444", marginBottom: 20 },
    card: { backgroundColor: "#FFF", padding: 24, borderRadius: 12, width: "80%", elevation: 4, alignItems: "center" },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 12, color: "#6A1B9A" },
    item: { fontSize: 16, marginVertical: 4 },
    btn: { backgroundColor: "#6A1B9A", padding: 14, borderRadius: 10, width: "70%", alignItems: "center", marginTop: 20 }
});
