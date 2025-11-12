import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function ReporteCard({ reporte, token, recargar }) {
    const marcarResuelto = async () => {
        try {
        const res = await axios.put(
            `${API_URL}/reportes/${reporte.id}/resolver`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        Alert.alert("✅ Éxito", "El reporte fue marcado como resuelto.");
        recargar(); // vuelve a cargar la lista
        } catch (error) {
        console.error("❌ Error al marcar como resuelto:", error);
        Alert.alert("Error", "No se pudo marcar como resuelto.");
        }
    };

    const eliminarReporte = async () => {
        Alert.alert(
        "Eliminar reporte",
        "¿Estás seguro que querés eliminar este reporte?",
        [
            { text: "Cancelar", style: "cancel" },
            {
            text: "Eliminar",
            onPress: async () => {
                try {
                await axios.delete(`${API_URL}/reportes/${reporte.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                Alert.alert("🗑️ Eliminado", "El reporte fue eliminado correctamente.");
                recargar(); // refresca la lista
                } catch (error) {
                console.error("💥 Error al eliminar reporte:", error);
                Alert.alert("Error", "No se pudo eliminar el reporte.");
                }
            },
            },
        ]
        );
    };

    return (
        <View style={styles.card}>
        <Text style={styles.id}>#{reporte.id}</Text>
        <Text>{reporte.descripcion}</Text>
        {reporte.imagen && (
            <Image source={{ uri: reporte.imagen }} style={styles.image} />
        )}
        <Text>Ubicación: {reporte.lat.toFixed(4)}, {reporte.lng.toFixed(4)}</Text>
        <Text>Estado: {reporte.estado}</Text>

        <TouchableOpacity style={styles.button} onPress={marcarResuelto}>
            <Text style={styles.buttonText}>Marcar como Resuelto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonDelete} onPress={eliminarReporte}>
            <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
        </View>
    );
    }

    const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
    },
    id: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 4,
    },
    image: {
        width: "100%",
        height: 150,
        borderRadius: 8,
        marginVertical: 8,
    },
    button: {
        backgroundColor: "#6a0dad",
        padding: 8,
        borderRadius: 6,
        marginTop: 8,
    },
    buttonDelete: {
        backgroundColor: "#cc0000",
        padding: 8,
        borderRadius: 6,
        marginTop: 6,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
    },
});
