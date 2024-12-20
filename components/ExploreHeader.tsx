import React, { useRef, useState } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Href, Link, router, useNavigation } from "expo-router";  // Import useNavigation
import { DrawerActions } from "@react-navigation/native";  // Import DrawerActions
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

const categories = [
  { name: "Sags", source: require("../assets/sport-icons/basketball.png") },
  {
    name: "Volley-ball",
    source: require("../assets/sport-icons/volleyball.png"),
  },
  { name: "Hol-Bombog", source: require("../assets/sport-icons/football.png") },
  { name: "Tennis", source: require("../assets/sport-icons/table-tennis.png") },
  { name: "Bowling", source: require("../assets/sport-icons/lanes.png") },
  { name: "Golf", source: require("../assets/sport-icons/golf.png") },
];

interface Props {
  onCategoryChanged: (category: string) => void;
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<React.RefObject<TouchableOpacity>[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  
  const navigation = useNavigation();  // Initialize navigation hook

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);

    if (selected) {
      (selected as unknown as View).measure(
        (_fx, fy, width, height, px, py) => {
          scrollRef.current?.scrollTo({ x: px - 16, animated: true });
        }
      );
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  // Function to open the drawer
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());  // Dispatch the openDrawer action
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#61b3fa" />
      <View style={styles.container}>
        <LinearGradient
          colors={["transparent", "#61b3fa"]}
          start={{ x: 0, y: 0.8 }}
          end={{ x: 0, y: 1.3 }}
          style={styles.background}
        />
        <View style={styles.content}>
          <View style={styles.actionRow}>
            <View style={styles.titleContainer}>
              <TouchableOpacity style={styles.search}>
                <Image
                  source={require("../assets/images/ranking.png")}
                  style={{ width: 30, height: 30 , right: 100}}
                />
              </TouchableOpacity>
            </View>

              <TouchableOpacity style={styles.notification}
              onPress={() =>
                router.push(
                  "/listing/notification" as Href<"/listing/notification">
                )
              }
              >
                <Image
                  source={require("../assets/sport-icons/notifications.png")}
                  style={{ width: 23, height: 23 }}
                />
              </TouchableOpacity>

            {/* The button to open the drawer */}
            <TouchableOpacity style={styles.notification} onPress={openDrawer}>
              <Image
                source={require("../assets/images/category.png")}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                ref={(el) => (itemsRef.current[index] = el)}
                style={
                  activeIndex === index
                    ? styles.categoriesBtnActive
                    : styles.categoriesBtn
                }
                onPress={() => selectCategory(index)}
              >
                <View style={styles.iconContainer}>
                  <Image
                    source={item.source}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
                <Text style={styles.titleText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "90%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 10,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 6,
    backgroundColor: "transparent",
  },
  search: {
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 40,
    backgroundColor: "#fafafa",
    borderColor: "#b0d9fc",
    borderWidth: 2,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  notification: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  titleContainer: {
    height: 50,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  titleText: {
    color: "#000",
    fontWeight: "condensed",
  },
  scrollViewContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
  },
  categoriesBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 6,
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: "center",
    borderBottomColor: Colors.primary,
    borderBottomWidth: 2,
  },
  iconContainer: {
    backgroundColor: "#fafafa",
    padding: 8,
    borderRadius: 10,
    borderColor: Colors.primary,
    borderWidth: 1,
    marginBottom: 5,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default ExploreHeader;
