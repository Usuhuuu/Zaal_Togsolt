import Colors from "@/constants/Colors";
import React, { useState } from "react";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import { axiosInstanceRegular } from "../(modals)/functions/axiosInstance";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useBookingStore } from "../(modals)/context/store";

export type FormData = {
  sportHallID: string;
  name: string;
  date: string;
  price: {
    oneHour: string;
    wholeDay: string;
  };
};
export type baseTimeSlotType = {
  start_time: string;
  end_time: string;
};

type TimeSlotItemProps = {
  timeSlot: {
    start_time: string;
    end_time: string;
  };
  unavailableTimes: any[];
  selectedTimeSlots: string[];
  onSelect: (timeString: string[]) => void;
};

const TimeSlotItem: React.FC<TimeSlotItemProps> = React.memo(
  ({ timeSlot, unavailableTimes, selectedTimeSlots, onSelect }) => {
    const timeString = `${timeSlot.start_time}~${timeSlot.end_time}`;
    const isDisabled = unavailableTimes.some(
      (time) => time.time === timeString && time.status.includes("Completed")
    );
    const isPending = unavailableTimes.some(
      (time) => time.time === timeString && time.status.includes("Pending")
    );

    return (
      <View style={styles.timeSlotView}>
        <TouchableOpacity
          onPress={() => {
            const newSelected = selectedTimeSlots.filter(
              (t) => t !== "WHOLE_DAY"
            );
            if (selectedTimeSlots.includes(timeString)) {
              onSelect(newSelected.filter((t) => t !== timeString));
            } else {
              onSelect([...newSelected, timeString]);
            }
          }}
          disabled={isDisabled}
          style={[
            styles.lalarinSdaBtn,
            {
              backgroundColor: isDisabled
                ? "red"
                : isPending
                ? "yellow"
                : "white",
              opacity: isDisabled || isPending ? 0.5 : 1,
              borderColor: selectedTimeSlots.includes(timeString)
                ? Colors.dark
                : Colors.littleDarkGrey,
            },
          ]}
        >
          <Text style={{ color: Colors.darkGrey }}>{timeString}</Text>
        </TouchableOpacity>
      </View>
    );
  },
  (prevProps, nextProps) =>
    prevProps.selectedTimeSlots === nextProps.selectedTimeSlots &&
    prevProps.unavailableTimes === nextProps.unavailableTimes
);
interface OrderScreenProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  baseTimeSlot: baseTimeSlotType[];
  sportHallID: string;
  setIsOrderScreenVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
const OrderScreen: React.FC<OrderScreenProps> = ({
  formData,
  setFormData,
  baseTimeSlot,
  sportHallID,
  setIsOrderScreenVisible,
}) => {
  const [today, setToday] = useState<string>(new Date().toISOString());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const dateSlotGiver = async (date: Date) => {
    setIsLoading(true);
    setSelectedTimeSlots([]);
    try {
      const odor: string = date.toISOString().split("T")[0];
      setToday(odor);
      const response = await axiosInstanceRegular.get("/timeslotscheck", {
        params: { zaalniID: sportHallID, odor },
      });
      console.log(response.status);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleOrder = () => {
    const zaal_id = sportHallID;
    setIsOrderScreenVisible(false);

    useBookingStore.getState().setBookingDetails({
      ...formData,
      selectedTimeSlots: selectedTimeSlots,
      date: today,
    });
    router.push(`/listing/book/${zaal_id}`);
  };

  return (
    <View style={styles.zahialgaView}>
      {isLoading ? (
        <View
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <ActivityIndicator size="large" color="blue" style={styles.loader} />
        </View>
      ) : (
        <SafeAreaView
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: Colors.white,
          }}
        >
          <View
            style={{
              height: "20%",
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => setIsOrderScreenVisible(false)}
              style={{
                width: "5%",
                height: "30%",
              }}
            >
              <Ionicons name="close" size={20} color={Colors.darkGrey} />
            </TouchableOpacity>
            <CalendarStrip
              style={styles.calendars}
              selectedDate={new Date(today)}
              calendarAnimation={{ type: "parallel", duration: 30 }}
              onDateSelected={(date: any) => dateSlotGiver(date)}
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
            <View
              style={{
                width: "5%",
                height: "30%",
              }}
            ></View>
          </View>
          {/* Header */}

          <View style={styles.LLR_style}>
            {/* Render available and unavailable time slots */}
            <View
              style={{
                paddingVertical: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  borderColor: selectedTimeSlots.includes("WHOLE_DAY")
                    ? Colors.darkGrey
                    : Colors.littleDarkGrey,
                  borderWidth: 1,
                  padding: 15,
                  borderRadius: 5,
                }}
                onPress={() => {
                  setSelectedTimeSlots(["WHOLE_DAY"]);
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    color: Colors.littleDark,
                  }}
                >
                  Select Whole Day
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: "space-between",
                flexWrap: "wrap",
                flexDirection: "row",
              }}
            >
              {baseTimeSlot?.map((timeSlot) => (
                <TimeSlotItem
                  key={`${timeSlot.start_time}~${timeSlot.end_time}`}
                  timeSlot={timeSlot}
                  unavailableTimes={unavailableTimes}
                  selectedTimeSlots={selectedTimeSlots}
                  onSelect={setSelectedTimeSlots}
                />
              ))}
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              width: "100%",
              alignItems: "center",
            }}
          >
            {selectedTimeSlots.length !== 0 && (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  borderWidth: 1,
                  padding: 15,
                  width: "50%",
                  borderRadius: 5,
                  borderColor: Colors.primary,
                  backgroundColor: Colors.secondary,
                }}
                onPress={() => handleOrder()}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 400,
                    color: Colors.littleDark,
                  }}
                >
                  Order
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  loader: {
    height: "100%",
  },
  zahialgaView: {
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: Colors.white,
  },
  timeSlotView: {
    flexDirection: "row",
    //backgroundColor: "black",
  },
  lalarinSdaBtn: {
    borderWidth: 1,

    borderRadius: 5,
    marginBottom: 10,
    width: "50%",
    padding: 10,
    minWidth: "50%",
    marginHorizontal: -2,
    alignItems: "center",
  },
  calendars: {
    height: "100%",
    width: "90%",
  },
  LLR_style: {
    flexDirection: "column",
    padding: 10,
  },
});

