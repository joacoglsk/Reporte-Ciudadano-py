import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import AuthProvider, { useAuth } from "./src/auth/AuthProvider";
import ThemeProvider from "./src/theme/ThemeProvider";

import SplashScreen from "./src/auth/SplashScreen";
import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import Perfil from "./src/screens/Perfil";
import ChatScreen from "./src/screens/ChatScreen";
import Mapa from "./src/screens/reportes/Mapa";
import AgregarReporte from "./src/screens/reportes/AgregarReporte";
import ListaReportes from "./src/screens/reportes/ListaReportes";
import ProductosList from "./src/screens/abm/ProductosList";
import ProductoForm from "./src/screens/abm/ProductoForm";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("admin");

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#6A1B9A",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: { backgroundColor: "#FFF", height: 60 },

        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home": iconName = "home"; break;
            case "Mapa": iconName = "map"; break;
            case "Reportes": iconName = "description"; break;
            case "Chat": iconName = "chat"; break;
            case "Perfil": iconName = "person"; break;
            case "Productos": iconName = "inventory"; break;
          }

          return <MaterialIcons name={iconName} size={28} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Mapa" component={Mapa} />
      <Tab.Screen name="Reportes" component={ListaReportes} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      {isAdmin && <Tab.Screen name="Productos" component={ProductosList} />}
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { loading, user } = useAuth();
  if (loading) return <SplashScreen />;

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="AgregarReporte" component={AgregarReporte} />
          <Stack.Screen name="ProductoForm" component={ProductoForm} />
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}
