import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";
import api from "../../api/client";
import { useAuth } from "../../auth/AuthProvider";

export default function AgregarReporte({ navigation }) {
  const { user } = useAuth(); // 🔑 ahora obtenemos user completo (incluye token real)

  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [ubicacion, setUbicacion] = useState({
    latitude: -40.1579,
    longitude: -71.3534,
  });

  // === Permiso para acceder a galería ===
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso requerido",
          "Necesitamos acceso a tu galería para seleccionar imágenes."
        );
      }
    })();
  }, []);

  // === Seleccionar imagen ===
  const seleccionarImagen = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImagen(result.assets[0].uri);
        console.log("📸 Imagen seleccionada:", result.assets[0].uri);
      } else {
        console.log("🚫 Selección de imagen cancelada");
      }
    } catch (error) {
      console.error("⚠️ Error al abrir la galería:", error);
      Alert.alert("Error", "No se pudo abrir la galería de imágenes.");
    }
  };

  // === Seleccionar ubicación ===
  const seleccionarUbicacion = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setUbicacion({ latitude, longitude });
  };

  // === Enviar reporte ===
  const enviarReporte = async () => {
    if (!descripcion.trim()) {
      Alert.alert("Error", "Por favor, escribí una descripción del problema.");
      return;
    }

    if (!user?.token) {
      Alert.alert("Error", "No hay token. Iniciá sesión nuevamente.");
      return;
    }

    try {
      const nuevoReporte = {
        descripcion,
        imagen,
        ubicacion: {
          latitude: ubicacion.latitude,
          longitude: ubicacion.longitude,
        },
      };

      console.log("📤 Enviando reporte:", nuevoReporte);

      const response = await api.post("/reportes", nuevoReporte, {
        headers: {
          Authorization: `Bearer ${user.token}`, // 🔥 TOKEN REAL ENVIADO
        },
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("✅ Éxito", "Tu reporte fue registrado correctamente.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error("💥 Error al enviar reporte:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Reporte</Text>

      <TouchableOpacity style={styles.imageButton} onPress={seleccionarImagen}>
        <Text style={styles.imageButtonText}>Seleccionar Foto</Text>
      </TouchableOpacity>

      {imagen && <Image source={{ uri: imagen }} style={styles.imagePreview} />}

      <TextInput
        style={styles.input}
        placeholder="Descripción del problema"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <MapView
        style={styles.map}
        region={{ ...ubicacion, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
        onPress={seleccionarUbicacion}
      >
        <Marker coordinate={ubicacion} title="Ubicación seleccionada" />
      </MapView>

      <TouchableOpacity style={styles.submitButton} onPress={enviarReporte}>
        <Text style={styles.submitButtonText}>Enviar Reporte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6A1B9A",
    marginBottom: 16,
    textAlign: "center",
  },
  imageButton: {
    backgroundColor: "#6A1B9A",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  imageButtonText: { color: "#fff", fontWeight: "bold" },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 12,
    borderRadius: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    textAlignVertical: "top",
    height: 100,
  },
  map: { height: 200, marginBottom: 16, borderRadius: 6 },
  submitButton: {
    backgroundColor: "#6A1B9A",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
