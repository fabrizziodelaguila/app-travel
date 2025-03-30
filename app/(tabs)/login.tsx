import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setUsername: setGlobalUsername } = useContext(UserContext);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.0.5:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Login exitoso', `Bienvenido, ${username}`);
        setGlobalUsername(username); // Guardar el usuario en el contexto
        router.push('/'); // Redirigir al Home (index.tsx)
      } else {
        Alert.alert('Error', data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

    const handleRegister = async () => {
        try {
            const response = await fetch('http://192.168.0.5:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión');
                setIsRegistering(false); // Cambiar a la vista de inicio de sesión
            } else {
                Alert.alert('Error', data.error || 'Error al registrarse');
            }
        } catch (error) {
            console.error('Error en registro:', error);
            Alert.alert('Error', 'No se pudo conectar con el servidor');
        }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
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
        <Button title="Registrarse" onPress={handleRegister} />
      ) : (
        <Button title="Iniciar Sesión" onPress={handleLogin} />
      )}
      <Button
        title={isRegistering ? 'Volver a Iniciar Sesión' : 'Registrarse'}
        onPress={() => setIsRegistering(!isRegistering)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default Login;