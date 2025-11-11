import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import api from "../../api/client";

export default function ListaReportes() {
  const [items, setItems] = useState([]);
  const load = async () => { const { data } = await api.get("/reportes"); setItems(data); };
  useEffect(() => { load(); }, []);
  const generarPDF = async (it) => {
    const { data } = await api.get(`/pdf/reporte/${it.id}`);
    Alert.alert("PDF generado", data.pdf_url);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Reportes</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.fecha}>#{item.id}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            {item.imagen && <Image source={{ uri: item.imagen }} style={styles.imagen} />}
            <Text style={styles.ubicacion}>Ubicación: {item.lat.toFixed(4)}, {item.lng.toFixed(4)}</Text>
            <TouchableOpacity onPress={() => generarPDF(item)} style={styles.pdfBtn}><Text style={{ color: "#fff" }}>Generar PDF</Text></TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#6A1B9A", marginBottom: 16, textAlign: "center" },
  card: { marginBottom: 16, padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 6 },
  fecha: { fontWeight: "bold", marginBottom: 4 },
  descripcion: { marginBottom: 8 },
  imagen: { width: "100%", height: 150, borderRadius: 6, marginBottom: 8 },
  ubicacion: { fontSize: 12, color: "#555" },
  pdfBtn: { backgroundColor: "#6A1B9A", padding: 10, borderRadius: 6, marginTop: 8, alignItems: "center" },
});
