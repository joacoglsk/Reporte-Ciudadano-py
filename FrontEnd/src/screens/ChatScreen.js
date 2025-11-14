import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import api from "../api/client";
import { useAuth } from "../auth/AuthProvider";

export default function ChatScreen() {
    const { token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const send = async () => {
        if (!input.trim()) return;
        if (!token) return Alert.alert("Error", "Volvé a iniciar sesión");

        try {
            const { data } = await api.post("/chat/", { message: input }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessages([
                ...messages,
                { from: "me", text: input },
                { from: "ai", text: data.reply }
            ]);
            setInput("");

        } catch (error) {
            Alert.alert("Error", "No se pudo enviar el mensaje");
        }
    };

    return (
        <View style={styles.c}>

            {messages.length === 0 && (
                <Text style={styles.welcome}>
                    💬 ¡Hola! Estoy acá para ayudarte.
                    {"\n"}Escribime lo que necesites 👇
                </Text>
            )}

            <FlatList
                data={messages}
                keyExtractor={(_, i) => String(i)}
                contentContainerStyle={{ paddingVertical: 10 }}
                renderItem={({ item }) => (
                    <Text style={{
                        alignSelf: item.from === "me" ? "flex-end" : "flex-start",
                        backgroundColor: item.from === "me" ? "#6A1B9A" : "#FFF",
                        color: item.from === "me" ? "#fff" : "#000",
                        padding: 10, borderRadius: 10, margin: 4,
                        maxWidth: "75%"
                    }}>
                        {item.text}
                    </Text>
                )}
            />

            <View style={styles.row}>
                <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Escribí..." />
                <TouchableOpacity style={styles.btn} onPress={send}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    c: { flex: 1, padding: 10, backgroundColor: "#E6D9F5" },
    welcome: {
        flex: 1,
        textAlign: "center",
        textAlignVertical: "center",
        fontWeight: "bold",
        fontSize: 18,
        color: "#5A2E8A",
        opacity: 0.9
    },
    row: { flexDirection: "row", marginBottom: 10 },
    input: { flex: 1, backgroundColor: "#FFF", borderRadius: 10, padding: 10 },
    btn: { backgroundColor: "#6A1B9A", marginLeft: 8, padding: 12, borderRadius: 10 }
});
