import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    try {
      const res = await fetch('http://192.168.0.5:8000/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({categoria: input}),
      });
      const data = await res.json();
      setResponse(data.respuesta_gemini || JSON.stringify(data));
    } catch (error) {
      setResponse('Error al conectar con el servidor');
    }
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  response: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 5,
    minHeight: 50,
    textAlign: 'center',
  },
});

export default Chatbot;