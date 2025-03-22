import {
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const ListingDetails = () => {
  const { id } = useLocalSearchParams();
  const numericId = Number(id);
  const router = useRouter();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListingById = async () => {
      try {
        const response = await fetch(
          `https://vuelosapi-e8e4cke5aubjdnah.canadacentral-01.azurewebsites.net/api/destinos/${numericId}`
        );
        if (!response.ok) {
          throw new Error("Listing not found");
        }
        const data = await response.json();
        setListing(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setLoading(false);
      }
    };

    if (!isNaN(numericId)) {
      fetchListingById();
    } else {
      setLoading(false);
    }
  }, [numericId]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
              <View style={styles.navBtnInner}>
                <Feather name="arrow-left" size={20} />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => {}} style={styles.navBtn}>
              <View style={styles.navBtnInner}>
                <Ionicons name="bookmark-outline" size={20} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primaryColor} style={{ marginTop: 100 }} />
        ) : listing ? (
          <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
            <View>
              <Image source={{ uri: listing.image }} style={styles.image} />
              <View style={styles.contentWrapper}>
                <Text style={styles.listingName}>{listing.name}</Text>
                <Text style={styles.listingLocationTxt}>{listing.location}</Text>

                <View style={styles.detailsSection}>
                  <Text style={styles.detailLabel}>Duration:</Text>
                  <Text>{listing.duration} days</Text>
                </View>

                <View style={styles.detailsSection}>
                  <Text style={styles.detailLabel}>Rating:</Text>
                  <Text>{listing.rating}</Text>
                </View>

                <Text style={styles.listingDetails}>{listing.description}</Text>
              </View>
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.errorText}>Listing not found.</Text>
        )}
      </View>
    </>
  );
};

export default ListingDetails;

import { Image } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  image: {
    width: width,
    height: IMG_HEIGHT,
  },
  contentWrapper: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  listingName: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.black,
    letterSpacing: 0.5,
  },
  listingLocationTxt: {
    fontSize: 16,
    color: "#af3e3  ",
    marginVertical: 8,
  },
  detailsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  detailLabel: {
    fontWeight: "600",
    color: Colors.black,
  },
  listingDetails: {
    fontSize: 16,
    color: Colors.black,
    lineHeight: 24,
    marginTop: 15,
  },
  navBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
    padding: 4,
  },
  navBtnInner: {
    backgroundColor: Colors.white,
    padding: 6,
    borderRadius: 10,
  },
  errorText: {
    fontSize: 18,
    color: Colors.black,
    textAlign: "center",
    marginTop: 50,
  },
});
