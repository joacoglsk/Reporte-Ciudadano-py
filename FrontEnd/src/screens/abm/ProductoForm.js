import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import api from "../../api/client";

export default function ProductoForm({ route, navigation }) {
    const { mode, item } = route.params || {};
    const [nombre, setNombre] = useState(item?.nombre || "");
    const [precio, setPrecio] = useState(String(item?.precio || "0"));

    const guardar = async () => {
        if (mode === "create") await api.post("/productos", { nombre, precio: parseFloat(precio) });
        else await api.put(`/productos/${item.id}`, { nombre, precio: parseFloat(precio) });
        navigation.goBack();
    };
    const eliminar = async () => { await api.delete(`/productos/${item.id}`); navigation.goBack(); };

    return (
        <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
            {mode === "create" ? "Nuevo producto" : "Editar producto"}
        </Text>
        <Text>Nombre</Text>
        <TextInput value={nombre} onChangeText={setNombre} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
        <Text>Precio</Text>
        <TextInput value={precio} onChangeText={setPrecio} keyboardType="numeric" style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
        <TouchableOpacity onPress={guardar} style={{ backgroundColor: "#6A1B9A", padding: 12, borderRadius: 8, marginBottom: 8 }}>
            <Text style={{ color: "#fff", textAlign: "center" }}>Guardar</Text>
        </TouchableOpacity>
        {mode === "edit" && (
            <TouchableOpacity onPress={eliminar} style={{ backgroundColor: "#cc0000", padding: 12, borderRadius: 8 }}>
            <Text style={{ color: "#fff", textAlign: "center" }}>Eliminar</Text>
            </TouchableOpacity>
        )}
        </View>
    );
}
