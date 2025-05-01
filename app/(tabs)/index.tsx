import { View, StyleSheet, Dimensions, Platform } from "react-native";
import React, { useMemo, useState } from "react";
import { Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import ListingsMap from "@/components/ListingsMap";
import listingsDataGeo from "@/assets/Data/airbnb-listings.geo (1).json"; // Ensure the filename is correct
import { ListingGeo } from "@/interfaces/listingGeo";
import ListingBottomSheet from "@/components/ListingBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import the root view component
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FeatureCollection {
  type: "FeatureCollection";
  features: ListingGeo[];
}

const Page = () => {
  const listingsData = require("@/assets/Data/airbnb-listings.json");
  const [category, setCategory] = useState<string>("Sags");
  const items = useMemo(() => listingsData as any[], []);
  const height = Dimensions.get("window").height;
  // Category change handler
  const onDataChanged = (category: string) => {
    console.log(`CHANGED_`, category);
    setCategory(category);
  };
  const { top, bottom } = useSafeAreaInsets();

  return (
    <GestureHandlerRootView
      style={[
        {
          marginTop: top,
          height: height - top - (Platform.select({ ios: 20, android: 10 }) ?? 0),
        },
      ]}
    >
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      {/*<Listing listings={items} category={category} />*/}
      <ListingsMap listings={listingsDataGeo as FeatureCollection} />
      <ListingBottomSheet listing={items} category={category} />
    </GestureHandlerRootView>
  );
};


export default Page;
