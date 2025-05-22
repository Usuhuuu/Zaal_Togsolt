import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
  Touchable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withRepeat,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import CalendarStrip from "react-native-calendar-strip";

import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { SportHallDataType } from "@/interfaces/listing";
import SportHall from "@/assets/Data/sportHall.json";

const { width } = Dimensions.get("window");
const SWIPE_WIDTH = width - 170;
const BUTTON_WIDTH = 40;

const Page = () => {
  const [sportHalls, setSportHalls] = useState<SportHallDataType[] | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [today,setToday] = useState<string>(new Date().toISOString());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
  

  const sortOptions = [
    { label: "Distance", children: ["Nearest First", "Farthest First"] },
    { label: "Rating", children: ["Highest First", "Lowest First"] },
    { label: "Price", children: ["Lowest First", "Highest First"] },
   
  ];

  const sortSlotGiver = (date: Date) => {
  setIsLoading(true);

  try {
    const selectedDateStr = date.toISOString().split("T")[0];
    setToday(selectedDateStr);

    // Filter halls with available slots on the selected date AND looking for partner
    const filtered = SportHall.filter(
      (hall) =>
        hall.lookingForPartner === false && // only halls looking for partner
        hall.availableTimeSlots.some((slot) =>
          slot.start_time.startsWith(selectedDateStr)
        )
    );

    setSportHalls(filtered);
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};
  const translateX = useSharedValue(0);
  const isSwiping = useSharedValue(false);
  const scale = useSharedValue(0);

  useEffect(() => {
    setSportHalls(SportHall);
  }, []);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.5, {
        duration: 1000,
        easing: Easing.out(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedSort = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: 1.5 - scale.value,
    };
  });

  const handleCompleteSwipe = () => {




  // Reset filters and reload data
  setIsLoading(true);

  setTimeout(() => {
    // Reset to full unfiltered list
    setSportHalls(SportHall);
    setToday(new Date().toISOString());
    setIsLoading(false);
  }, 500); // simulate network delay or update
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
    const progress = translateX.value / (SWIPE_WIDTH - BUTTON_WIDTH);
    const startColor = [224, 224, 224];
    const endColor = [33, 150, 243];

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
    borderRadius: 20,
    width: BUTTON_WIDTH,
    height: 40,
    justifyContent: "center",
  }));

  const sortSportHalls = (option: string) => {
  // option example: "Distance:Nearest First"
  const [parent, child] = option.split(":");
  const sorted = [...(sportHalls || [])]; // copy current list

  switch (parent) {
    case "Distance":
      sorted.sort((a, b) =>
        child === "Farthest First"
          ? (b.distance ?? 0) - (a.distance ?? 0)
          : (a.distance ?? 0) - (b.distance ?? 0)
      );
      break;

    case "Rating":
      sorted.sort((a, b) =>
        child === "Lowest First"
          ? (a.rating ?? 0) - (b.rating ?? 0)
          : (b.rating ?? 0) - (a.rating ?? 0)
      );
      break;

    case "Price":
      sorted.sort((a, b) =>
        child === "Highest First"
          ? (b.price ?? 0) - (a.price ?? 0)
          : (a.price ?? 0) - (b.price ?? 0)
      );
      break;

    default:
      break;
  }

  setSportHalls(sorted);        // update the state to re-render list
  setSelectedSort(option);      // optionally store the selected sort option
  setModalVisible(false);       // close the sort modal
  setSelectedParent(null);      // reset sort sub-menu if any
};



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.Text style={[styles.swipet, bounceStyle]}>
        Swipe to find partner
      </Animated.Text>
      <Text style={styles.text}>
        Swipe right to show unfiltered orders sport hall.
      </Text>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
        <Animated.View style={[styles.rail, railAnimatedStyle]}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.swipeButton, animatedStyle]}>
              <Text style={styles.swipeText}>→</Text>
            </Animated.View>
          </GestureDetector>
        </Animated.View>

        <View style={styles.containermodal}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.sortButton}
          >
            <Text style={styles.sortText}>Sort by</Text>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => {
              setModalVisible(false);
              setSelectedParent(null);
            }}
          >
            <Pressable
              style={styles.overlay}
              onPress={() => {
                setModalVisible(false);
                setSelectedParent(null);
              }}
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Sort by</Text>
                 <CalendarStrip
              style={styles.calendars}
              selectedDate={new Date(today)}
              calendarAnimation={{ type: "parallel", duration: 30 }}
              onDateSelected={(date: any) => sortSlotGiver(date)}
              dateNumberStyle={{
                fontSize: 18,
                fontWeight: "400",
                color: "#464646",
              }}
              dateNameStyle={{
                fontSize: 10,
                fontWeight: "400",
                color: Colors.littleDark,
              }}
              calendarHeaderStyle={{
                fontSize: 18,
                fontWeight: "500",
                color: Colors.littleDark,
              }}
              calendarHeaderContainerStyle={{
                width: "100%",
                height: "30%",
              }}
            />
           
                {!selectedParent ? (
                  sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.label}
                      style={styles.option}
                      onPress={() =>
                        option.children.length > 0
                          ? setSelectedParent(option.label)
                          : sortSportHalls(option.label)
                      }
                    >
                      <Text style={styles.optionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <>
                    <TouchableOpacity onPress={() => setSelectedParent(null)}>
                      <Text style={{ color: Colors.primary, marginBottom: 10 }}>
                        ← Back
                      </Text>
                    </TouchableOpacity>
                    {sortOptions
  .find((opt) => opt.label === selectedParent)
  ?.children.map((child, index) => (
    <Animated.View
      key={child}
      entering={FadeIn.duration(300).delay(index * 100)}
    >
      <TouchableOpacity
        style={styles.option}
        onPress={() => sortSportHalls(`${selectedParent}:${child}`)}
      >
        <Text style={styles.optionText}>{child}</Text>
      </TouchableOpacity>
    </Animated.View>
  ))}

                  </>
                )}
              </View>
            </Pressable>
          </Modal>
        </View>
      </View>

      {sportHalls?.map((item) => (
        <View key={item.sportHallID} style={styles.card}>
          <Image
            source={{ uri: item.imageUrls[0] }}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subTitle}>📞 {item.phoneNumber}</Text>

          <TouchableOpacity
            onPress={() => {
              Linking.openURL(item.listing_url);
            }}>

         
    <Text style={styles.text}>📍 {item.address}</Text>
    </TouchableOpacity>

          <Text style={styles.subTitle}>🎯 Features:</Text>
          <View style={styles.featuresContainer}>
  {Object.entries(item.feature)
    .filter(([_, value]) => value) // show only enabled features
    .map(([key]) => (
      <View key={key} style={styles.featureBadge}>
        <Text style={styles.featureText}>✔️ {key}</Text>
      </View>
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
    height: 20,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
  },
  calendars: {
    height: "20%",
    width: "100%",
    marginBottom: 40,
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
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 8,
},
  featureBadge: {
  backgroundColor: "#e6f4ea",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "#a5d6a7",
},
featureText: {
  fontSize: 12,
  color: "#2e7d32",
  fontWeight: "500",
},
  animatedSort: {
    marginTop: 8,
    marginBottom: 8,
  },
  containermodal: {
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  sortButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  sortText: {
    fontSize: 16,
    color: Colors.primary,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,

  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#444",
  },
});

export default Page;
