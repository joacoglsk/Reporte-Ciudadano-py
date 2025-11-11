import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import api from "../api/client";
export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const send = async () => {
    if (!input.trim()) return;
    const { data } = await api.post("/chat", { message: input });
    setMessages([...messages, { from: "me", text: input }, { from: "ai", text: data.reply }]);
    setInput("");
    };
    return (
        <View style={styles.c}>
        <FlatList
            data={messages}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => (
            <Text style={{
                alignSelf: item.from === "me" ? "flex-end" : "flex-start",
                backgroundColor: item.from === "me" ? "#6A1B9A" : "#eee",
                color: item.from === "me" ? "#fff" : "#000",
                padding: 10, borderRadius: 6, margin: 4
            }}>{item.text}</Text>
            )}
        />
        <View style={styles.row}>
            <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Escribí..." />
            <TouchableOpacity style={styles.btn} onPress={send}><Text style={{ color: "#fff" }}>Enviar</Text></TouchableOpacity>
        </View>
        </View>
    );
}
const styles = StyleSheet.create({ c: { flex: 1, padding: 10 }, row: { flexDirection: "row" }, input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 8 }, btn: { backgroundColor: "#6A1B9A", marginLeft: 8, padding: 12, borderRadius: 6 } });
