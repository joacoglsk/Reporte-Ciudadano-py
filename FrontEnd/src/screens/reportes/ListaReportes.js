import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";

import api from "../../api/client";

export default function ListaReportes() {
  const [items, setItems] = useState([]);

  // === Cargar reportes ===
  const load = async () => {
    try {
      const { data } = await api.get("/reportes");
      setItems(data);
    } catch (error) {
      console.error("❌ Error al cargar reportes:", error);
      Alert.alert("Error", "No se pudieron cargar los reportes.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // === Generar y descargar PDF ===
  const generarPDF = async (it) => {
    try {
      console.log("🧾 Descargando PDF para reporte", it.id);

      const pdfUrl = `${api.defaults.baseURL}/pdf/reporte/${it.id}`;
      const fileUri = `${FileSystem.documentDirectory}reporte_${it.id}.pdf`;

      // Descargar el archivo desde el backend
      const { uri } = await FileSystem.downloadAsync(pdfUrl, fileUri);

      console.log("✅ PDF descargado en:", uri);

      // En Android, moverlo a la carpeta pública "Download"
      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
          const destUri =
            permissions.directoryUri +
            `/reporte_${it.id}.pdf`;

          const fileBase64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            `reporte_${it.id}`,
            "application/pdf"
          ).then(async (fileUri) => {
            await FileSystem.writeAsStringAsync(fileUri, fileBase64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          });

          Alert.alert(
            "PDF guardado",
            "El archivo se descargó correctamente. ¿Querés abrirlo?",
            [
              { text: "Cancelar", style: "cancel" },
              { text: "Abrir", onPress: () => Linking.openURL(pdfUrl) },
            ]
          );
        } else {
          Alert.alert(
            "Permiso denegado",
            "No se pudo guardar el PDF en la carpeta Descargas."
          );
        }
      } else {
        // iOS o web
        Alert.alert("PDF generado", "¿Querés abrirlo?", [
          { text: "Cancelar", style: "cancel" },
          { text: "Abrir", onPress: () => Linking.openURL(pdfUrl) },
        ]);
      }
    } catch (error) {
      console.error("💥 Error al generar PDF:", error);
      Alert.alert("Error", "No se pudo generar el PDF del reporte.");
    }
  };

  // === Eliminar reporte ===
  const eliminarReporte = async (it) => {
    Alert.alert(
      "Eliminar reporte",
      "¿Seguro que querés eliminar este reporte?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/reportes/${it.id}`);
              Alert.alert("🗑️ Eliminado", "El reporte fue borrado correctamente.");
              load(); // recargar lista
            } catch (error) {
              console.error("💥 Error al eliminar:", error);
              Alert.alert("Error", "No se pudo eliminar el reporte.");
            }
          },
        },
      ]
    );
  };

  // === Marcar como resuelto ===
  const marcarResuelto = async (it) => {
    try {
      await api.put(`/reportes/${it.id}`, { estado: "resuelto" });
      Alert.alert("✅ Reporte actualizado correctamente");
      load();
    } catch (error) {
      console.error("💥 Error al actualizar:", error);
      Alert.alert("Error", "No se pudo actualizar el estado del reporte.");
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Reportes</Text>

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.id}>#{item.id}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>

            {item.imagen && (
              <Image source={{ uri: item.imagen }} style={styles.imagen} />
            )}

            <Text style={styles.ubicacion}>
              Ubicación: {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
            </Text>

            <Text style={styles.estado}>
              Estado:{" "}
              <Text
                style={{
                  color: item.estado === "resuelto" ? "green" : "orange",
                  fontWeight: "bold",
                }}
              >
                {item.estado}
              </Text>
            </Text>

            {/* Botones */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#6A1B9A" }]}
                onPress={() => generarPDF(item)}
              >
                <Text style={styles.btnText}>📄 PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "green" }]}
                onPress={() => marcarResuelto(item)}
              >
                <Text style={styles.btnText}>✔️ Resuelto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "red" }]}
                onPress={() => eliminarReporte(item)}
              >
                <Text style={styles.btnText}>🗑️ Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6A1B9A",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
  id: { fontWeight: "bold", marginBottom: 4 },
  descripcion: { marginBottom: 8 },
  imagen: {
    width: "100%",
    height: 150,
    borderRadius: 6,
    marginBottom: 8,
  },
  ubicacion: { fontSize: 12, color: "#555" },
  estado: { fontSize: 13, marginTop: 4 },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 4,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
