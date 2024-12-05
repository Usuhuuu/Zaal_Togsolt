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
import { Link } from "expo-router";
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
            


            <Link href={`/(modals)/sags`} asChild>
              <TouchableOpacity style={styles.notification}>
                <Image
                  source={require("../assets/sport-icons/notifications.png")}
                  style={{ width: 23, height: 23  }}
                />
              </TouchableOpacity>
            </Link>

            <TouchableOpacity style={styles.notification}>
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
    // Ensures the gradient does not overflow outside the container
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
 
  search:{
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 40,
    backgroundColor: "#fafafa",
    borderColor: '#b0d9fc',
    borderWidth: 2,
    borderRadius: 20,
    elevation: 10, // For Android shadow
    shadowColor: '#000', // For iOS shadow
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
    elevation: 10, // For Android shadow
    shadowColor: '#000', // For iOS shadow
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
    borderColor: '#b0d9fc',
    borderWidth: 1,
    marginBottom: 5,
    elevation: 10, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default ExploreHeader;
