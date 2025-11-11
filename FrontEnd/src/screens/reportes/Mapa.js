import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import api from "../../api/client";

export default function Mapa({ navigation }) {
  const [reportes, setReportes] = useState([]);
  const region = { latitude: -40.1579, longitude: -71.3534, latitudeDelta: 0.05, longitudeDelta: 0.05 };
  const load = async () => { const { data } = await api.get("/reportes"); setReportes(data); };
  useEffect(() => { const unsub = navigation.addListener("focus", load); return unsub; }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reportes</Text>
      <MapView style={styles.map} initialRegion={region}>
        {reportes.map((r) => (
          <Marker key={r.id} coordinate={{ latitude: r.lat, longitude: r.lng }} pinColor="red">
            <Callout>
              <View style={{ maxWidth: 200 }}>
                <Text style={{ fontWeight: "bold" }}>#{r.id}</Text>
                <Text>{r.descripcion}</Text>
                {r.imagen && <Image source={{ uri: r.imagen }} style={{ width: 180, height: 100, marginTop: 8, borderRadius: 6 }} />}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AgregarReporte")}>
        <Text style={styles.buttonText}>Agregar Reporte</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: "#ccc", marginTop: 8 }]} onPress={() => navigation.navigate("Reportes")}>
        <Text style={[styles.buttonText, { color: "#333" }]}>Ver Lista</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 24, color: "#6A1B9A", textAlign: "center", marginVertical: 16, fontWeight: "bold" },
  map: { flex: 1 },
  button: { backgroundColor: "#6A1B9A", padding: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
