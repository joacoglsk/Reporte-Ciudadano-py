import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
export default function SplashScreen() {
    return (
        <View style={styles.c}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Cargando sesión...</Text>
        </View>
    );
}
const styles = StyleSheet.create({ c: { flex: 1, alignItems: "center", justifyContent: "center" } });
