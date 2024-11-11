import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Animated, 
  Dimensions, 
  ImageBackground 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import listingsData from "@/assets/Data/airbnb-listings.json";
import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";

interface Listing {
  name: string;
  xl_picture_url: string;
  // Add other properties as needed
}

const listings: Listing[] = listingsData as Listing[];

const { width: screenWidth } = Dimensions.get("window");

interface ChatHeaderProps {
  onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onBack }) => (
  <View style={styles.headerContainer}>
    <View style={styles.leftSection}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Image
        source={require("../assets/images/profileIcons/profile.png")}
        style={styles.profileImage}
      />
    </View>

    <Text style={styles.title}>Hamtdaa</Text>

    <View style={styles.rightSection}>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="search" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="white" />
      </TouchableOpacity>
    </View>
  </View>
);

const Page: React.FC = () => {
  const [infoHeight, setInfoHeight] = useState(0);

  const handleBack = () => {
    console.log("Back button pressed");
  };

  const listingData = listings[0];
  if (!listingData) {
    return <Text style={styles.errorText}>Listing data not found</Text>;
  }

  return (
    <View style={styles.container}>
      <ChatHeader onBack={handleBack} />

      {/* Image Gallery */}
      <Animated.ScrollView contentContainerStyle={styles.imageGallery}>
        <Image
          source={{ uri: listingData.xl_picture_url }}
          style={[styles.image, { width: screenWidth }]}
          resizeMode="cover"
        />
        <View
          onLayout={(event) => setInfoHeight(event.nativeEvent.layout.height)}
          style={styles.infoContainer}
        >
          <View style={styles.facilitiesRow}>
            <Text style={styles.listingName}>{listingData.name}</Text>
            <TouchableOpacity>
            <Ionicons name="share" size={24} color="black" />
            </TouchableOpacity>

          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 10,
  },
  imageGallery: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 250,
  },
  infoContainer: {
    padding: 24,
    marginTop: -40,
    borderRadius: 15,
    backgroundColor: "white",
    width: "97%",
    alignSelf: "center",
  },
  facilitiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listingName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  hostView: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    paddingHorizontal: 10,
  },
  hostBackground: {
    borderRadius: 20,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  hostBackgroundContainer: {
    padding: 10,
    borderRadius: 20,
    left: 33,
  },
  hostText: {
    color: "white",
    fontSize: 12,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Page;
