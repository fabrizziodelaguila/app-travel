import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements";
import CategoryButtons from "@/components/CategoryButtons";
import Listings from "@/components/Listings";
import GroupListings from "@/components/GroupListings";
import { VueloType } from "@/types/vueloType";
import debounce from "lodash/debounce";
import { API_URLS } from "@/config/config";
import { UserContext } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import AuthMiddleware from "../context/authMiddleware"; // Importar el middleware

const Page = () => {
  const { username } = useContext(UserContext);
  const headerHeight = useHeaderHeight();
  const router = useRouter();
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

  useEffect(() => {
    fetchData(API_URLS.DESTINOS, setListings, setLoading);
  }, []);

  useEffect(() => {
    fetchData(API_URLS.VUELOS, setVuelos, setLoadingVuelos);
  }, []);

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

  const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token"); // Eliminar el token
    router.push("/login"); // Redirigir al login
  };

  return (
    <AuthMiddleware>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}>
              <Text style={{ marginRight: 10, fontWeight: "bold", color: Colors.black }}>
                {username}
              </Text>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: Colors.primaryColor,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: Colors.white, fontWeight: "bold" }}>
                  {username[0]?.toUpperCase()}
                </Text>
              </View>
              <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 10 }}>
                <Ionicons name="log-out-outline" size={24} color={Colors.primaryColor} />
              </TouchableOpacity>
            </View>
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
    </AuthMiddleware>
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