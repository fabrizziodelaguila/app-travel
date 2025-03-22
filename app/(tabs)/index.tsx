import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements";
import CategoryButtons from "@/components/CategoryButtons";
import Listings from "@/components/Listings";
import GroupListings from "@/components/GroupListings";
import { VueloType } from "@/types/vueloType";
import debounce from "lodash/debounce";
import { API_URLS } from '@/config/config'; // Apunta a config/config.ts

const Page = () => {
  const headerHeight = useHeaderHeight();
  const [category, setCategory] = useState("All");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [vuelos, setVuelos] = useState<VueloType[]>([]);
  const [loadingVuelos, setLoadingVuelos] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const onCatChanged = (category: string) => {
    setCategory(category);
  };

  // Función genérica para hacer solicitudes HTTP
  const fetchData = async (
    url: string,
    setData: (data: any) => void,
    setLoadingState: (loading: boolean) => void
  ) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingState(false);
    }
  };

  // Obtener destinos
  useEffect(() => {
    fetchData(API_URLS.DESTINOS, setListings, setLoading);
  }, []);

  // Obtener vuelos
  useEffect(() => {
    fetchData(API_URLS.VUELOS, setVuelos, setLoadingVuelos);
  }, []);

  // Función para buscar destinos
  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(`${API_URLS.SEARCH_DESTINOS}?name=${query}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching destinations:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce de la búsqueda
  const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                marginRight: 20,
                backgroundColor: Colors.white,
                padding: 10,
                borderRadius: 10,
                shadowColor: "#171717",
                shadowOffset: { width: 2, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Ionicons name="notifications" size={20} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={[styles.container, { paddingTop: headerHeight }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.headingTxt}>Travel App</Text>

          <View style={styles.searchSectionWrapper}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search"
                size={18}
                style={{ marginRight: 5 }}
                color={Colors.black}
              />
              <TextInput
                placeholder="Buscar..."
                value={searchText}
                onChangeText={handleSearchTextChange}
                returnKeyType="search"
                style={{ flex: 1 }}
              />
            </View>
          </View>

          <CategoryButtons onCagtegoryChanged={onCatChanged} />

          {searchResults.length > 0 ? (
            <Listings
              listings={searchResults}
              category={category}
              loading={isSearching}
            />
          ) : (
            <Listings listings={listings} category={category} loading={loading} />
          )}

          <GroupListings listings={vuelos} />
        </ScrollView>
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.bgColor,
  },
  headingTxt: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.black,
    marginTop: 10,
  },
  searchSectionWrapper: {
    flexDirection: "row",
    marginVertical: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
});