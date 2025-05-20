import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { SportHallDataType } from "@/interfaces/listing";
import SportHall from "@/assets/Data/sportHall.json";

const { width } = Dimensions.get("window");
const SWIPE_WIDTH = width - 90; // 16 padding on each side
const BUTTON_WIDTH = 60;

const Page = () => {
  const [sportHalls, setSportHalls] = useState<SportHallDataType[] | null>(
    null
  );
  const translateX = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  const handleCompleteSwipe = () => {
    alert("✅ Booking confirmed!");
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isSwiping.value = true;
    })
    .onUpdate((e) => {
      if (e.translationX >= 0 && e.translationX <= SWIPE_WIDTH - BUTTON_WIDTH) {
        translateX.value = e.translationX;
      }
    })
    .onEnd(() => {
      isSwiping.value = false;
      if (translateX.value > SWIPE_WIDTH - BUTTON_WIDTH - 20) {
        runOnJS(handleCompleteSwipe)();
      }
      translateX.value = withSpring(0);
    });
  const bounceStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isSwiping.value ? 1 : 1.2, {
            damping: 5,
            stiffness: 100,
          }),
        },
        {
          translateY: withSpring(isSwiping.value ? 0 : -5, {
            damping: 5,
            stiffness: 100,
          }),
        },
      ],
      color: isSwiping.value ? Colors.primary : Colors.darkGrey,
    };
  });

  const railAnimatedStyle = useAnimatedStyle(() => {
    const progress = translateX.value / (SWIPE_WIDTH - BUTTON_WIDTH); // 0 to 1
    const startColor = [224, 224, 224]; // #e0e0e0
    const endColor = [33, 150, 243]; // Colors.primary (blue)

    const r = startColor[0] + (endColor[0] - startColor[0]) * progress;
    const g = startColor[1] + (endColor[1] - startColor[1]) * progress;
    const b = startColor[2] + (endColor[2] - startColor[2]) * progress;

    return {
      borderColor: `rgb(${r}, ${g}, ${b})`,
    };
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    backgroundColor:
      translateX.value > SWIPE_WIDTH - BUTTON_WIDTH - 20
        ? Colors.primary
        : Colors.secondary,

    borderRadius: 30,
    width: BUTTON_WIDTH,
    height: 60,
    justifyContent: "center",
  }));
  //daraa duudan
  useEffect(() => {
    setSportHalls(SportHall);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.Text style={[styles.swipet, bounceStyle]}>
        Swipe to find partner
      </Animated.Text>
      <Text style={styles.text}>
        Swipe right to confirm your booking for the selected sport hall.
      </Text>

      <Animated.View style={[styles.rail, railAnimatedStyle]}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.swipeButton, animatedStyle]}>
            <Text style={styles.swipeText}>→</Text>
          </Animated.View>
        </GestureDetector>
      </Animated.View>
      {sportHalls?.map((item) => (
        <View key={item.sportHallID} style={styles.card}>
          <Image
            source={{ uri: item.imageUrls[0] }}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.text}>📍 {item.address}</Text>
          <Text style={styles.text}>📞 {item.phoneNumber}</Text>
          <Text style={styles.text}>🕒 {item.workTime}</Text>

          <Text style={styles.subTitle}>🗓️ Available Time Slots:</Text>
          {item.availableTimeSlots.map((slot, idx) => (
            <Text key={idx} style={styles.text}>
              {slot.start_time} - {slot.end_time}
            </Text>
          ))}

          <Text style={styles.subTitle}>🎯 Features:</Text>
          <View style={styles.featuresContainer}>
            {Object.entries(item.feature).map(([key, value]) => (
              <Text
                key={key}
                style={[
                  styles.featureItem,
                  { color: value ? "#2e7d32" : "#ccc" },
                ]}
              >
                {value ? `✔️ ${key}` : `❌ ${key}`}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  rail: {
    width: SWIPE_WIDTH,
    height: 40,
    marginHorizontal: 30,
    borderRadius: 30,
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  swipet: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",

    textAlign: "center",
  },
  swipeButton: {
    width: BUTTON_WIDTH,
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
  },
  swipeText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#212121",
    textAlign: "center",
  },
  subTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  text: {
    fontSize: 14,
    color: "#555",
  },
  featuresContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    marginTop: 8,
    gap: 6,
  },
  featureItem: {
    fontSize: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginTop: 4,
  },
});

export default Page;
