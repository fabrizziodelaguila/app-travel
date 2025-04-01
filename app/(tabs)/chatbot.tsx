import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importar AsyncStorage
import { useRouter } from "expo-router"; // Para redirigir al login

const Chatbot = () => {
  const [input, setInput] = useState(""); // Entrada del usuario
  const [response, setResponse] = useState(""); // Respuesta del backend
  const router = useRouter(); // Para redirigir al login

  const handleSend = async () => {
    try {
      // Recuperar el token JWT de AsyncStorage
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setResponse("Por favor, inicia sesión primero.");
        return;
      }

      // Realizar la solicitud al backend
      const res = await fetch("http://192.168.0.5:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
        },
        body: JSON.stringify({ categoria: input }), // Enviar la categoría ingresada por el usuario
      });

      const data = await res.json();
      // Mostrar la respuesta del backend
      setResponse(data.respuesta_gemini || JSON.stringify(data));
    } catch (error) {
      setResponse("Error al conectar con el servidor"); // Manejo de errores
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token"); // Eliminar el token de AsyncStorage
    router.push("/login"); // Redirigir al login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consulta con Gemini</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe tu pregunta aquí..."
        value={input}
        onChangeText={setInput}
      />
      <Button title="Enviar" onPress={handleSend} />
      <Text style={styles.response}>{response}</Text>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  response: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e9ecef",
    borderRadius: 5,
    minHeight: 50,
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#dc3545",
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Chatbot;
