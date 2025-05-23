import { View } from "react-native";
import React, { useMemo, useState } from "react";
import { Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import ListingsMap from "@/components/ListingsMap";
import SportHallData from "@/assets/Data/sportHall.json";
import ListingBottomSheet from "@/components/ListingBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useSharedValue } from "react-native-reanimated";

const Page = () => {
  const listingsData = require("@/assets/Data/sportHall.json");
  const [category, setCategory] = useState<string>("Sags");
  const items = useMemo(() => listingsData as any[], []);
  const { top } = useSafeAreaInsets();
  const bottomSheetY = useSharedValue(0); // Shared value to track bottom sheet position

  const onDataChanged = (category: string) => {
    console.log(`CHANGED_`, category);
    setCategory(category);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: top }}>
        <Stack.Screen
          options={{
            header: () => (
              <ExploreHeader
                onCategoryChanged={onDataChanged}
                bottomSheetY={bottomSheetY} // Pass shared value here
              />
            ),
          }}
        />
        <ListingsMap
          listings={SportHallData.map((item: any) => ({
            ...item,
            availableTimeSlots: item.availableTimeSlots.map((slot: any) => ({
              start_time: slot.start,
              end_time: slot.end,
            })),
          }))}
        />
        <ListingBottomSheet
          listing={items}
          category={category}
          bottomSheetY={bottomSheetY}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default Page;
