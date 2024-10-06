import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ListRenderItem,
} from "react-native";
import { useRouter } from "expo-router"; // Import useRouter from expo-router
import { Listing } from "@/interfaces/listing";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import BottomSheet, { BottomSheetFlatList, BottomSheetFlatListMethods } from "@gorhom/bottom-sheet";

interface Props {
  listings: Listing[];
  category: string;
  refresh : number; 
}

const ListingComponent = ({ listings: items, category ,refresh }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const listRef = useRef<BottomSheetFlatListMethods>(null);
  const router = useRouter(); // Initialize the router
  
  useEffect(()=>{
    console.log('refresh listings');

  },[refresh]);

  useEffect(() => {
    console.log("Reloading items", items.length);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200); // Simulate loading
  }, [category, items]);

  const handlePress = (id: string) => {
    router.push(`/listing/${id}`); // Use router.push to navigate
  };

  const renderRow: ListRenderItem<any> = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.id)}>
      <View style={styles.itemContainer}>
        <Image style={styles.thumbnail} source={{ uri: item.medium_url }} />
        <View style={styles.filterButtonContainer}>
          <TouchableOpacity>
          <Image
            source={require("../assets/sport-icons/olympic.png")}
            style={styles.filterButton}
          />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          <Text>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="sports-score" size={24} color="red" />
            <Text>{item.review_scores_rating / 20}</Text>
          </View>
        </View>
        <Text style={styles.title}>{item.room_type}</Text>
        <View style={styles.locationContainer}>
          <Image
            source={require("../assets/images/placeholder.png")}
            style={styles.placeholderImage}
          />
           <Text>{item.city}</Text>
          <Text>{item.neighbourhood}</Text>
          <Text>  $ {item.price} tugrug</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text>{category}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <BottomSheetFlatList
          renderItem={renderRow}
          ref={listRef}
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  itemContainer: {
    marginBottom: 20,
    backgroundColor: "#f8f8f8",
    padding: 5,
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: 280,
    borderRadius: 8,
    borderColor: Colors.primary,
    marginBottom: 8,
  },
  filterButtonContainer: {
    position: "absolute",
    right: 10,
    bottom: 90,
  },
  filterButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    width: 40,
    height: 40,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  placeholderImage: {
    width: 20,
    height: 20,
  },
  flatListContent: {
    paddingBottom: 20,
  },
});

export default ListingComponent;
