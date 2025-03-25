import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ListRenderItem,
  ImageBackground,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Listing } from "@/interfaces/listing";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  listings: Listing[];
  category: string;
  refresh: number;
}

const ListingComponent = ({ listings: items, category }: Props) => {
  const [loading, setLoading] = useState(false);
  const listRef = useRef<BottomSheetFlatListMethods>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category, items]);

  const handlePress = (id: string) => {
    router.push(`/listing/${id}`);
  };

  const renderRow: ListRenderItem<Listing> = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => handlePress(item.id)}
        style={styles.itemContainer}
      >
        <ImageBackground
          source={require("../assets/images/listingicons/1.png")}
          style={styles.backgroundImage}
        >
          <View style={styles.detailsContainer}>
            <Text style={styles.text}>{item.name}</Text>

            <View style={styles.ratingContainer}>
              <MaterialIcons name="sports-score" size={24} color="red" />
              <Text style={styles.text}>{item.review_scores_rating / 20}</Text>
            </View>

            <View style={styles.locationContainer}>
              <Image
                source={require("../assets/images/placeholder.png")}
                style={styles.placeholderImage}
              />
              <Text style={styles.text}>{item.city}</Text>
              <Text style={styles.text}>{item.neighbourhood}</Text>
            </View>

            <Text style={styles.text}>${item.price} tugrug</Text>

            <TouchableOpacity style={styles.viewButton}>
              <Image
                source={require("../assets/images/listingicons/right.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    ),
    [handlePress]
  );

  const CategoryButton = ({ label }: { label: string }) => (
    <TouchableOpacity style={styles.categoryButton}>
      <Text style={styles.categoryTitle}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#f8f9fa", Colors.primary]}
      start={[0, 0]}
      end={[0, 1]}
      style={styles.container}
    >
      <Link href={`/(modals)/sags`} asChild>
        <TouchableOpacity style={styles.searchbtn}>
          <Image
            source={require("../assets/images/ranking.png")}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Search</Text>
          <Image
            source={require("../assets/images/listingicons/adjust.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </Link>

      <View style={styles.categoryContainer}>
        {["oirhon", "shildeg", "zovloh"].map((label) => (
          <CategoryButton key={label} label={label} />
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <BottomSheetFlatList
          ref={listRef}
          data={items}
          renderItem={renderRow}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 16,
  },
  itemContainer: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  backgroundImage: {
    width: "100%",
    height: 200,
    justifyContent: "flex-end",
    resizeMode: "cover",
  },
  detailsContainer: {
    padding: 20,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: "100%",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  placeholderImage: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  flatListContent: {},
  searchbtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 45,
    paddingHorizontal: "5%",
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  icon: {
    width: 23,
    height: 23,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.light,
    borderRadius: 20,
    paddingVertical: 8,
    marginVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  viewButton: {
    backgroundColor: "rgba(97, 179, 250, 0)",
    height: 200,
    width: 40,
    position: "absolute",
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ListingComponent;
