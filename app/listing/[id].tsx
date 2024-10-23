import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Share,
  Modal,
  StatusBar,
  SafeAreaView,
} from "react-native";
import listingsData from "@/assets/Data/airbnb-listings.json";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { defaultStyles } from "@/constants/Styles";
import axios from "axios";
import Constants from "expo-constants";
import CalendarStrip from "react-native-calendar-strip";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 500;

const ScheduleScreen = () => (
  <View style={styles.modalContent}>
    <Text>This is the schedule screen!</Text>
  </View>
);

const DetailsPage = () => {
  const [isScheduleVisible, setIsScheduleVisible] = useState(false);
  const [isOrderScreenVisible, setIsOrderScreenVisible] = useState(false);
  const zaalFormData = {
    zaalId: "",
    date: "",
    startTime: "",
    endTime: "",
  };
  const { id } = useLocalSearchParams();
  const listing = (listingsData as any[]).find((item) => item.id === id);
  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const apiUrl = Constants.expoConfig?.extra?.apiUrl || "http://localhost:3001";

  const shareListing = async () => {
    try {
      await Share.share({
        title: listing.name,
        url: listing.listing_url,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const baseTimeSlots = [
    { start_time: "06:00", end_time: "08:00" },
    { start_time: "08:00", end_time: "10:00" },
    { start_time: "10:00", end_time: "12:00" },
    { start_time: "12:00", end_time: "14:00" },
    { start_time: "14:00", end_time: "16:00" },
    { start_time: "16:00", end_time: "18:00" },
    { start_time: "18:00", end_time: "20:00" },
    { start_time: "20:00", end_time: "22:00" },
    { start_time: "22:00", end_time: "24:00" },
  ];
  const [availableTimes, setAvailableTimes] = useState(baseTimeSlots); // Initialize with baseTimeSlots
  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [zahialgaBtn, setZahialgaBtn] = useState(false);
  const dateSlotGiver = async (date: any) => {
    try {
      const odor = date.toISOString().split("T")[0];
      const zaalniID = zaalFormData.zaalId;
      const response = await axios.get(`${apiUrl}/timeslotscheck`, {
        params: { zaalniID, odor },
      });
      if (!response.data.available && response.data.not_possible_time != "") {
        //mean theres not avaible time and that times are saved on not_possible_time
        const notPossibleTime: string[] =
          response.data.not_possible_time.orderedTime.map(
            (time: any) => `${time.start_time} ~ ${time.end_time}`
          );
        setUnavailableTimes(notPossibleTime); // Update the unavailable times as strings
        setIsAvailable(false);
      } else {
        setUnavailableTimes([]);
        setIsAvailable(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handlePressTimeSlot = (timeSlot: any) => {
    console.log(`Time slot pressed: ${timeSlot}`);
    setZahialgaBtn(true);
  };
  useEffect(() => {
    console.log(unavailableTimes);
  });
  const OrderScreen = () => {
    return (
      <View style={styles.zahialgaView}>
        <CalendarStrip
          style={styles.calendars}
          scrollerPaging={true}
          daySelectionAnimation={{
            type: "background",
            duration: 200,
            highlightColor: "gray",
          }}
          startingDate={new Date()}
          calendarAnimation={{ type: "sequence", duration: 5 }}
          onDateSelected={(e) => {
            dateSlotGiver(e);
          }}
          dateNumberStyle={{ fontSize: 18, fontWeight: 400 }}
          dateNameStyle={{ fontSize: 10, fontWeight: 400 }}
          calendarHeaderStyle={{ fontSize: 18, fontWeight: 500 }}
        />
        <View style={styles.LLR_style}>
          {/* Render available and unavailable time slots */}
          {baseTimeSlots.map((timeSlot, index) => {
            const timeString = `${timeSlot.start_time}~${timeSlot.end_time}`;
            const isDisabled = unavailableTimes.includes(timeString);
            return (
              <View style={styles.timeSlotView} key={index}>
                <TouchableOpacity
                  onPress={() => handlePressTimeSlot(timeString)}
                  disabled={isDisabled}
                  style={[
                    styles.timeSlotButton,
                    {
                      backgroundColor: isDisabled ? "grey" : "white",
                      opacity: isDisabled ? 0.5 : 1,
                    },
                  ]}
                >
                  <Text>{timeString}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
          <TouchableOpacity
            style={{
              padding: 10,
              marginVertical: 5,
              borderWidth: 0.5,
              borderRadius: 20,
              width: "40%",
              alignItems: "center",
              display: "none",
            }}
          ></TouchableOpacity>
        </View>
      </View>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerTransparent: true,

      headerBackground: () => (
        <Animated.View
          style={[headerAnimatedStyle, styles.header]}
        ></Animated.View>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity
            style={styles.timeSlotButton}
            onPress={shareListing}
          >
            <Image
              source={require("@/assets/images/listingicons/share.png")}
              style={styles.headerButton}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="heart" size={30} color={"red"} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("@/assets/images/listingicons/arrow.png")}
            style={styles.headerButton}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  const scrollOffset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  }, []);

  const handleZaalId = (input: any) => {
    zaalFormData.zaalId = input;
  };
  useEffect(() => {
    handleZaalId(id);
  }, [zaalFormData]);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.Image
          source={{ uri: listing.xl_picture_url }}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode="cover"
        />
        <Text>{listing.id}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{listing.name}</Text>
          <TouchableOpacity>
            <Text style={styles.location}>
              <Image
                source={require("@/assets/images/placeholder.png")}
                style={styles.placeholderImage}
              />
              {listing.smart_location}
            </Text>
          </TouchableOpacity>
          <Text style={styles.rooms}>
            {listing.guests_included} guests · {listing.bedrooms} bedrooms ·{" "}
            {listing.beds} bed · {listing.bathrooms} bathrooms
          </Text>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <MaterialIcons name="sports-score" size={24} color="red" />
            <Text style={{ fontSize: 16 }}>
              {listing.review_scores_rating / 20} -
            </Text>
            <TouchableOpacity>
              <Text style={styles.ratings}>
                {listing.number_of_reviews} reviews
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          <View style={styles.hostView}>
            <Image
              source={{ uri: listing.host_picture_url }}
              style={styles.host}
            />

            <View>
              <Text style={{ fontWeight: "500", fontSize: 16 }}>
                Hosted by {listing.host_name}
              </Text>
              <Text>Host since {listing.host_since}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{listing.description}</Text>
        </View>
      </Animated.ScrollView>

      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>€{listing.price}</Text>
            <Text>night</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsScheduleVisible(true);
            }}
            style={[styles.btn, { paddingRight: 20, paddingLeft: 20 }]}
          >
            <Text style={defaultStyles.btnText}>tsagiin huvaari </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsOrderScreenVisible(true)}
            style={[styles.btn, { paddingRight: 20, paddingLeft: 20 }]}
          >
            <Text style={defaultStyles.btnText}>zahialga</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Modal for Schedule Screen */}
      <Modal
        animationType="slide"
        visible={isScheduleVisible}
        transparent={true}
        onRequestClose={() => setIsScheduleVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setIsScheduleVisible(false)}>
              <Ionicons name="close" size={24} color={Colors.grey} />
            </TouchableOpacity>
            <ScheduleScreen />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        visible={isOrderScreenVisible}
        transparent={true}
        onRequestClose={() => setIsOrderScreenVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setIsOrderScreenVisible(false)}>
              <Ionicons name="close" size={24} color={Colors.grey} />
            </TouchableOpacity>
            <OrderScreen />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: "#fff",
  },
  text: {
    fontFamily: "mon",
  },
  boldText: {
    fontFamily: "mon-sb",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "mon-sb",
  },
  location: {
    flexDirection: "row",
    fontSize: 18,
    marginTop: 10,
    fontFamily: "mon-sb",
    color: Colors.primary,
  },
  rooms: {
    fontSize: 16,
    color: Colors.grey,
    marginVertical: 4,
  },
  ratings: {
    color: Colors.primary,
    fontSize: 16,
    fontFamily: "mon-sb",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: 16,
  },
  placeholderImage: {
    width: 20,
    height: 20,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  hostView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  footer: {
    position: "absolute",
    height: 60,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopColor: Colors.primary,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerText: {
    height: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: "mon-sb",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    color: Colors.primary,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  header: {
    backgroundColor: "#fff",
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
  headerButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    width: 40,
    height: 40,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    height: "90%",
  },

  zahialgaView: {
    height: "95%",
    paddingBottom: "30%",
    borderBottomWidth: 1,
    width: "100%",
  },
  timeSlotView: {
    paddingTop: 10,
    flexDirection: "row",
    //backgroundColor: "black",
  },
  timeSlotButton: {
    borderWidth: 0.5,
    borderRadius: 20,
    marginBottom: 10,
    width: "50%",
    padding: 10,
    minWidth: "50%",
    marginHorizontal: -2,
    alignItems: "center",
  },
  calendars: {
    height: "20%",
    borderBottomWidth: 1,
  },
  LLR_style: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default DetailsPage;
