import React, { useRef, useState } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import "@/utils/i18";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { router } from "expo-router";

// ICON MAP
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
  bottomSheetY: SharedValue<number>;
}

const ExploreHeader = ({ onCategoryChanged, bottomSheetY }: Props) => {
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { t } = useTranslation();
  const sportDetail: any = t("sportTextIcons", { returnObjects: true });
  const windowHeight = Dimensions.get("window").height;

  const animatedIconStyle = useAnimatedStyle(() => {
    const translateYValue = interpolate(
      bottomSheetY.value,
      [0,   windowHeight * 0.5],
      [-80, 0],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY: translateYValue }],
    };
  });

  const itemsRef = useRef<(View | null)[]>([]);

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
        

        

        {/* ACTION ROW */}
        <View style={styles.actionRowWrapper}>
          <TouchableOpacity style={styles.search}>
            <Image
              source={require("../assets/images/ranking.png")}
              style={{ width: 30, height: 30, right: 100 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.notification}
          
            onPress={() =>
                router.push("/listing/notification")
              }

          >
            <Ionicons name="notifications" size={25} color={Colors.primary} />

          </TouchableOpacity>

          <TouchableOpacity style={styles.notification}
          onPress={openDrawer}
          >
            <Ionicons name="menu" size={25} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* ICON SECTION */}
        <Animated.View style={[styles.iconsWrapper, animatedIconStyle]}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {sportDetail?.map((item: any, index: number) => (
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
                    source={iconMap[item.icon]}
                    style={{ width: 25, height: 25 }}
                  />
                </View>
                <Text style={styles.titleText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 170,
    overflow: "visible",
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
  actionRowWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 10,
    borderColor: "#b0d9fc",
    borderWidth: 2,
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
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  iconsWrapper: {
    position: "absolute",
    top: 65,
    left: 0,
    right: 0,
    zIndex: 10,
    borderColor: "#b0d9fc",
    borderWidth: 2,
  },
  scrollViewContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingHorizontal: 10,
  },
  categoriesBtn: {
    alignItems: "center",
    paddingBottom: 6,
  },
  categoriesBtnActive: {
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
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  titleText: {
    color: Colors.dark,
    fontWeight: "500",
  },
});

export default ExploreHeader;
