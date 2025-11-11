import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import api from "../api/client";
export default function Home() {
    const [stats, setStats] = useState(null);
    useEffect(() => { (async () => {
        const { data } = await api.get("/reportes/stats");
        setStats(data);
    })(); }, []);
    return (
        <View style={styles.c}>
        <Text style={styles.h}>Resumen</Text>
        {stats && (
            <>
            <Text>Total: {stats.total}</Text>
            <Text>Pendientes: {stats.pendientes}</Text>
            <Text>Resueltos: {stats.resueltos}</Text>
            </>
        )}
        </View>
    );
}
const styles = StyleSheet.create({ c: { flex: 1, alignItems: "center", justifyContent: "center" }, h: { fontSize: 22, fontWeight: "bold" } });
