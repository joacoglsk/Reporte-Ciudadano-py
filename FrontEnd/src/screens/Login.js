import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../auth/AuthProvider";

export default function Login() {
  const { login, loading } = useAuth();

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/984/984196.png",
        }}
        style={styles.logo}
      />

      <Text style={styles.title}>Reporte Ciudadano</Text>
      <Text style={styles.subtitle}>Iniciá sesión con Auth0 para continuar</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6A1B9A" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Iniciar sesión con Auth0</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.footer}>
        Tu sesión es segura y gestionada con Auth0 🔒
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6A1B9A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6A1B9A",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
});
