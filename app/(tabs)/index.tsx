import { Dimensions } from "react-native";
import React, { useMemo, useState } from "react";
import { Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import ListingsMap from "@/components/ListingsMap";
import SportHallData from "@/assets/Data/sportHall.json";
import ListingBottomSheet from "@/components/ListingBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import the root view component
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Page = () => {
  const listingsData = require("@/assets/Data/sportHall.json");
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
          height: "99%",
        },
      ]}
    >
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      {/*<Listing listings={items} category={category} />*/}
      <ListingsMap
        listings={SportHallData.map((item: any) => ({
          ...item,
          availableTimeSlots: item.availableTimeSlots.map((slot: any) => ({
            start_time: slot.start,
            end_time: slot.end,
          })),
        }))}
      />
      <ListingBottomSheet listing={items} category={category} />
    </GestureHandlerRootView>
  );
};

export default Page;
