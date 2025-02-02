import React, { useRef, useState } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Href, router, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import "@/utils/i18";

const { t } = useTranslation();
const sportDetail: any = t("sportTextIcons", { returnObjects: true });

const iconMap: { [key: string]: any } = {
  basketball: require("../assets/sport-icons/test_icons/basketball.png"),
  football: require("../assets/sport-icons/test_icons/football.png"),
  volleyball: require("../assets/sport-icons/test_icons/volleyball.png"),
  tennis: require("../assets/sport-icons/test_icons/tennis.png"),
  bowling: require("../assets/sport-icons/test_icons/bowling.png"),
  golf: require("../assets/sport-icons/test_icons/golf.png"),
};

interface Props {
  onCategoryChanged: (category: string) => void;
}
const ExploreHeader = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<React.RefObject<TouchableOpacity>[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const navigation = useNavigation(); // Initialize navigation hook

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
    onCategoryChanged(sportDetail[index].name);
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
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
                  style={{ width: 30, height: 30, right: 100 }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.notification}
              onPress={() =>
                router.push(
                  "/listing/notification" as Href<"/listing/notification">
                )
              }
            >
              {/* <Image
                source={require("../assets/sport-icons/notifications.png")}
                style={{ width: 23, height: 23 }}
              /> */}
              <Ionicons
                name="notifications"
                size={25}
                style={{ color: Colors.primary }}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.notification} onPress={openDrawer}>
              {/* <Image
                source={require("../assets/images/category.png")}
                style={{ width: 20, height: 20 }}
              /> */}
              <Ionicons
                name="menu"
                size={25}
                style={{ color: Colors.primary }}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {sportDetail.map((item: any, index: any) => (
              <TouchableOpacity
                key={index}
                //ref={(el) => (itemsRef.current[index] = el)}
                style={
                  activeIndex === index
                    ? styles.categoriesBtnActive
                    : styles.categoriesBtn
                }
                onPress={() => selectCategory(index)}
              >
                <View style={styles.iconContainer}>
                  <Image
                    source={iconMap[item.icon]}
                    style={{ width: 25, height: 25 }}
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
    backgroundColor: Colors.light,
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
    color: Colors.dark,
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
