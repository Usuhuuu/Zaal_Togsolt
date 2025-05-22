import { useBookingStore } from "@/app/(modals)/context/store";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import StepIndicator from "react-native-step-indicator";
import { format } from "date-fns";

const labels = ["Players Needed", "Confirm Info", "Booking Complete"];
const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 35,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#4c9aff",
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: "#4c9aff",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#4c9aff",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#4c9aff",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#4c9aff",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#4c9aff",
};
const groupConnectedTimeSlots = (slots: string[]) => {
  if (slots.includes("WHOLE_DAY")) return [["WHOLE_DAY"]];

  // Sort by start time
  const sorted = [...slots].sort((a, b) => {
    const getMinutes = (time: string) => {
      const [h, m] = time.split("~")[0].split(":").map(Number);
      return h * 60 + m;
    };
    return getMinutes(a) - getMinutes(b);
  });

  const groups: string[][] = [];
  let currentGroup: string[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];

    currentGroup.push(current);

    if (next) {
      const [, endOfCurrent] = current.split("~");
      const [startOfNext] = next.split("~");

      if (endOfCurrent !== startOfNext) {
        groups.push(currentGroup);
        currentGroup = [];
      }
    } else {
      groups.push(currentGroup);
    }
  }

  return groups;
};
const TransactionPage = () => {
  const [steps, setSteps] = useState<number>(0);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[][]>([]);
  const [playersNeeded, setPlayersNeeded] = useState("");

  const zaal_id = useLocalSearchParams();
  const bookingDetails = useBookingStore((state) => state.bookingDetails);

  useEffect(() => {
    setSelectedTimeSlots(() =>
      groupConnectedTimeSlots(bookingDetails?.selectedTimeSlots ?? [])
    );
    console.log(selectedTimeSlots);
    console.log(bookingDetails);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: Colors.white }}>
        <View style={{ height: "100%" }}>
          {/* Header */}
          <View
            style={{
              height: "10%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: "100%",
              marginHorizontal: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons
                name="arrow-back-sharp"
                size={24}
                color={Colors.primary}
              />
            </TouchableOpacity>
            {/* Step Indicator */}
            <View
              style={{
                flex: 1,
              }}
            >
              <StepIndicator
                customStyles={customStyles}
                currentPosition={steps}
                stepCount={3}
              />
            </View>
            <TouchableOpacity onPress={() => {}}>
              <Feather name="more-vertical" size={30} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          {/* Body */}
          <View
            style={{
              backgroundColor: Colors.white,
              width: "100%",
              height: "90%",
            }}
          >
            {steps === 0 && (
              <View style={styles.innerContainer}>
                <Text
                  style={{ fontSize: 24, fontWeight: 400, textAlign: "left" }}
                >
                  {bookingDetails?.name}
                </Text>
                {/* check section */}
                <View
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    width: "70%",
                    borderColor: Colors.littleDark,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 20,
                      borderBottomWidth: 1,
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 300 }}>Date</Text>
                    <Text style={{ fontSize: 18, fontWeight: 300 }}>
                      {bookingDetails?.date
                        ? format(new Date(bookingDetails.date), "MMMM d, yyyy")
                        : ""}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                    }}
                  >
                    {selectedTimeSlots.map((group, index) => {
                      const startTime = group[0].split("~")[0];
                      const endTime = group[group.length - 1].split("~")[1];
                      const isLast = index === selectedTimeSlots.length - 1;
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 20,
                            borderBottomWidth: isLast ? 0 : 1,
                          }}
                        >
                          <Text style={{ fontSize: 18, fontWeight: 300 }}>
                            Time {index + 1}
                          </Text>
                          <Text style={{ fontSize: 18, fontWeight: 300 }}>
                            {startTime} – {endTime}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
                {/* price section */}
                <View
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    width: "70%",
                    borderColor: Colors.littleDark,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 20,
                      borderBottomWidth: 1,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 5,
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="clock-time-nine-outline"
                        size={24}
                        color="black"
                      />
                      <Text style={{ fontSize: 18, fontWeight: 300 }}>
                        1 Hour
                      </Text>
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 300 }}>
                      ₮{bookingDetails?.price.oneHour}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 20,
                    }}
                  >
                    <Text>TOTAL</Text>
                    <Text>
                      ₮
                      {(bookingDetails?.selectedTimeSlots.length ?? 0) *
                        Number(bookingDetails?.price.oneHour)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: "space-between",
                    width: "90%",
                    padding: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setSteps(steps + 1)}
                    style={{
                      borderWidth: 1,
                      alignSelf: "flex-end",
                    }}
                  >
                    <Text style={{ padding: 10 }}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {steps === 1 && (
              <View style={[styles.innerContainer, {}]}>
                <View
                  style={{
                    width: "90%",
                    gap: 10,
                  }}
                >
                  {selectedTimeSlots.map((group, index) => {
                    const startTime = group[0].split("~")[0];
                    const endTime = group[group.length - 1].split("~")[1];
                    const isLast = index === selectedTimeSlots.length - 1;
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: "column",
                          justifyContent: "space-between",
                          padding: 10,
                          gap: 5,
                          borderWidth: 1,
                          borderColor: Colors.littleDark,
                          borderRadius: 5,
                        }}
                      >
                        <Text style={{ fontSize: 18, fontWeight: 300 }}>
                          Session {index + 1}
                        </Text>
                        <Text style={{ fontSize: 18, fontWeight: 300 }}>
                          {startTime} – {endTime}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderWidth: 1,
                            padding: 5,
                            borderColor: Colors.littleDark,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <MaterialIcons
                              name="people-alt"
                              size={24}
                              color="black"
                            />
                            <Text>Peoples Needed</Text>
                          </View>
                          <Text style={{ paddingRight: 10 }}>{3}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "90%",
                    justifyContent: "center",
                    gap: 20,
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => setSteps(steps - 1)}
                  >
                    <Text>Preview</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.buttons,
                      { backgroundColor: Colors.primary },
                    ]}
                    onPress={() => setSteps(steps + 1)}
                  >
                    <Text style={{ color: Colors.white }}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {steps === 2 && (
              <View style={[styles.innerContainer, {}]}>
                <View
                  style={{
                    flexDirection: "row",
                    width: "90%",
                    justifyContent: "center",
                    gap: 20,
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => setSteps(steps - 1)}
                  >
                    <Text>Preview</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.buttons,
                      { backgroundColor: Colors.primary },
                    ]}
                    onPress={() => setSteps(steps + 1)}
                  >
                    <Text style={{ color: Colors.white }}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    alignItems: "center",
    gap: 20,
  },
  buttons: {
    width: "45%",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    gap: 10,
    borderColor: Colors.darkGrey,
    borderRadius: 5,
  },
});

export default TransactionPage;
