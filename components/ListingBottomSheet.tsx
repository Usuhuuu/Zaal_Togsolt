import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import Listings from "@/components/Listing";
import BottomSheet from "@gorhom/bottom-sheet";
import { Listing } from "@/interfaces/listing";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

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
  const snapPoints = useMemo(() => ["10%", "87%"], []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableOverDrag={false}
      handleIndicatorStyle={{
        backgroundColor: Colors.primary,
        width: 60,
        borderRadius: 2,
      }}
      style={[styles.sheetContainer]}
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
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  absoluteBtn: {
    position: "absolute",
    bottom: 50,
    alignSelf: "flex-end",
    width: "30%",
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginRight: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    bottom: 30,

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
