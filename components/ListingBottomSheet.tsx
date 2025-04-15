import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import Listings from "@/components/Listing";
import BottomSheet from "@gorhom/bottom-sheet";
import { Listing } from "@/interfaces/listing";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ListingBottomSheetProps {
  listing: Listing[];
  category: string;
}
const ListingBottomSheet = ({ listing, category }: ListingBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [refresh, setrefresh] = useState<number>(0);

  const showMap = () => {
    bottomSheetRef.current?.collapse();
    setrefresh(refresh + 1);
  };
  const { bottom, top } = useSafeAreaInsets();
  const snapPoints = useMemo(() => [bottom + 100, "100%"], []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleIndicatorStyle={{
        backgroundColor: Colors.primary,
        width: 60,
        borderRadius: 2,
      }}
      style={[styles.sheetContainer, { marginTop: top }]}
    >
      <View style={styles.contentContainer}>
        <Listings listings={listing} category={category} refresh={refresh} />
        <View style={styles.absoluteBtn}>
          <TouchableOpacity onPress={showMap} style={styles.btn}>
            <Text style={styles.btnText}>Map</Text>
            <Ionicons name="map" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  absoluteBtn: {
    bottom: 20,
    alignSelf: "center",
    width: "90%",
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 8,

    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 5, // For Android shadow
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: Colors.white,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  handleIndicator: {
    backgroundColor: Colors.primary,
    width: 60,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    alignSelf: "center",

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // For Android shadow
  },
});

export default ListingBottomSheet;
