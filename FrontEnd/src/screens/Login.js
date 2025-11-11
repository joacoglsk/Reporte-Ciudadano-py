import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../auth/AuthProvider";
export default function Login() {
  const { login } = useAuth();
  return (
    <View style={styles.c}>
      <Text style={styles.t}>Reporte Ciudadano</Text>
      <TouchableOpacity style={styles.btn} onPress={login}>
        <Text style={{ color: "#fff" }}>Ingresar con Auth0</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  c: { flex: 1, justifyContent: "center", alignItems: "center" },
  t: { fontSize: 28, marginBottom: 20, fontWeight: "bold", color: "#6A1B9A" },
  btn: { backgroundColor: "#6A1B9A", padding: 14, borderRadius: 8 },
});
