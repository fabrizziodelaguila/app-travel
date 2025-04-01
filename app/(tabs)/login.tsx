import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importar AsyncStorage
import { useRouter } from "expo-router";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUsername: setGlobalUsername } = useContext(UserContext);

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://loginapi-efcefzbjctcrbcax.canadacentral-01.azurewebsites.net/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Login exitoso", `Bienvenido, ${username}`);
        setGlobalUsername(username); // Guardar el usuario en el contexto
        await AsyncStorage.setItem("token", data.token); // Guardar el token en AsyncStorage
        router.push("/"); // Redirigir al Home (index.tsx)
      } else {
        Alert.alert("Error", data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error en login:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(
        "https://loginapi-efcefzbjctcrbcax.canadacentral-01.azurewebsites.net/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Registro exitoso", "Ahora puedes iniciar sesión");
        setIsRegistering(false); // Cambiar a la vista de inicio de sesión
      } else {
        Alert.alert("Error", data.error || "Error al registrarse");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isRegistering ? "Registrarse" : "Iniciar Sesión"}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {isRegistering ? (
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => setIsRegistering(!isRegistering)}
          style={styles.grayText}
        >
          <Text>
            {isRegistering
              ? "Volver a Iniciar Sesión"
              : "¿No tienes cuenta? Registrarse"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    textAlign: "center",
    width: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "90%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    alignSelf: "center",
  },
  button: {
    width: "100%",
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  grayText: {
    color: "gray",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
});

export default Login;
