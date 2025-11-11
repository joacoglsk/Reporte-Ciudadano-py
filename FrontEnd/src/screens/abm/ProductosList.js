import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import api from "../../api/client";
import { useAuth } from "../../auth/AuthProvider";

export default function ProductosList({ navigation }) {
    const [items, setItems] = useState([]);
    const { user } = useAuth();
    const isAdmin = user?.roles?.includes("admin");
    const load = async () => { const { data } = await api.get("/productos"); setItems(data); };
    useEffect(() => { const unsub = navigation.addListener("focus", load); return unsub; }, [navigation]);

    return (
        <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>Productos</Text>
        {isAdmin && (
            <TouchableOpacity onPress={() => navigation.navigate("ProductoForm", { mode: "create" })} style={styles.nuevo}>
            <Text style={{ color: "#fff" }}>Nuevo</Text>
            </TouchableOpacity>
        )}
        <FlatList
            data={items}
            keyExtractor={(i) => String(i.id)}
            renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => isAdmin && navigation.navigate("ProductoForm", { mode: "edit", item })}
                style={styles.row}>
                <Text style={{ fontWeight: "bold" }}>{item.nombre}</Text>
                <Text>${item.precio}</Text>
            </TouchableOpacity>
            )}
        />
        </View>
    );
    }
    const styles = StyleSheet.create({
    row: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 8 },
    nuevo: { backgroundColor: "#6A1B9A", padding: 12, borderRadius: 8, marginBottom: 12, alignItems: "center" },
});