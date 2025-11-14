import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../auth/AuthProvider";

export default function Perfil() {
    const { user, logout } = useAuth();
    const [photo, setPhoto] = useState(user?.picture);
    const [name, setName] = useState(user?.name);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        });
        if (!result.canceled) setPhoto(result.assets[0].uri);
    };

    return (
        <View style={styles.bg}>
            <View style={styles.card}>

                <TouchableOpacity onPress={pickImage}>
                    <Image source={{ uri: photo }} style={styles.i} />
                </TouchableOpacity>

                <TextInput
                    style={styles.nameInput}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.email}>{user?.email}</Text>

                <TouchableOpacity style={styles.btn} onPress={logout}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Cerrar sesión</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1, backgroundColor: "#E6D9F5", justifyContent: "center", alignItems: "center" },
    card: { backgroundColor: "#FFF", padding: 28, borderRadius: 14, width: "80%", alignItems: "center", elevation: 5 },
    i: { width: 120, height: 120, borderRadius: 60, marginBottom: 16, borderWidth: 3, borderColor: "#6A1B9A" },
    nameInput: {
        fontSize: 20, fontWeight: "bold", marginBottom: 6, textAlign: "center",
        borderBottomWidth: 1, borderColor: "#6A1B9A", width: "80%"
    },
    email: { marginBottom: 16, color: "#555" },
    btn: { backgroundColor: "#6A1B9A", padding: 14, borderRadius: 10, width: "70%", alignItems: "center" }
});
