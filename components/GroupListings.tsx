import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { VueloType } from "@/types/vueloType";  // Asumiendo que VueloType es donde están definidos los tipos de datos del vuelo
import { Ionicons } from "@expo/vector-icons"; // Iconos para el estado

// Definimos los colores en hexadecimal
const Colors = {
  black: "#000000",
  white: "#FFFFFF",
  blue: "#1E90FF", // Azul para "Programado"
  green: "#32CD32", // Verde para "En vuelo"
  red: "#FF6347", // Rojo para "Cancelado"
  gray: "#A9A9A9", // Gris por defecto
  badgeBackground: "#FFD700", // Color de fondo para el badge del precio (amarillo dorado)
  badgeText: "#FFFFFF", // Color del texto dentro del badge
};

const GroupListings = ({ listings }: { listings: VueloType[] }) => {
  // Función para determinar el color basado en el estado del vuelo
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "Programado":
        return Colors.blue; // Azul para vuelos programados
      case "En vuelo":
        return Colors.green; // Verde para vuelos en vuelo
      case "Cancelado":
        return Colors.red; // Rojo para vuelos cancelados
      default:
        return Colors.gray; // Gris por defecto
    }
  };

  const renderItem = ({ item }: { item: VueloType }) => {
    return (
      <View style={styles.item}>
        <View>
          {/* Código de vuelo y origen/destino */}
          <Text style={styles.itemTxt}>{item.codigoVuelo}</Text>
          <Text style={styles.itemDetails}>
            {item.origen} ➔ {item.destino}
          </Text>

          {/* Fechas del vuelo */}
          <Text style={styles.itemDetails}>
            {new Date(item.fechaSalida).toLocaleString()} - {new Date(item.fechaLlegada).toLocaleString()}
          </Text>

          {/* Estado y aerolínea */}
          <View style={styles.detailsWrapper}>
            <Text style={[styles.itemDetails, { color: getStatusColor(item.estado) }]}>
              Estado: {item.estado}
            </Text>
            <Text style={styles.itemDetails}>Aerolinea: {item.aerolinea}</Text>

            {/* Badge para el precio */}
            <View style={styles.priceWrapper}>
              <Text style={styles.priceText}>${item.precio}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={styles.title}>Top Flights</Text>
      <FlatList
        data={listings}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default GroupListings;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
  },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
    flexDirection: "column", // Cambiado para acomodar los datos en una columna
    justifyContent: "center",
    alignItems: "flex-start", // Alineación ajustada
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Sombra para darle un efecto de elevación
  },
  itemTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 8,
  },
  itemDetails: {
    fontSize: 14,
    color: "#666", // Color más suave para los detalles
    marginBottom: 4,
  },
  detailsWrapper: {
    marginTop: 10,
  },
  priceWrapper: {
    backgroundColor: Colors.badgeBackground,
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginTop: 8,
    alignSelf: "flex-start", // Alineación para el badge
  },
  priceText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.badgeText,
  },
});
