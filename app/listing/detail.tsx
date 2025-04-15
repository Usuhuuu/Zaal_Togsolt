import Colors from "@/constants/Colors";
import React, { useState } from "react";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import { axiosInstanceRegular } from "../(modals)/functions/axiosInstance";

type TimeSlotProps = {
  timeString: string;
  isDisabled: boolean;
  isPending: boolean;
  handlePressTimeSlot: (timeSlot: string) => void;
};
const TimeSlot: React.FC<TimeSlotProps> = React.memo(
  ({ timeString, isDisabled, isPending, handlePressTimeSlot }) => {
    return (
      <View style={styles.timeSlotView}>
        <TouchableOpacity
          onPress={() => handlePressTimeSlot(timeString)}
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
            },
          ]}
        >
          <Text>{timeString}</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

type FormData = {
  zaalId: string;
  date: string;
  startTime: string;
  endTime: string;
};

interface OrderScreenProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const OrderScreen: React.FC<OrderScreenProps> = ({ formData, setFormData }) => {
  const [today, setToday] = useState<string>(new Date().toISOString());
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([]);
  const [zahialgaBtn, setZahialgaBtn] = useState<boolean>(false);

  const dateSlotGiver = async (date: Date) => {
    setIsLoading(true);
    try {
      const odor: string = date.toISOString().split("T")[0];

      setToday(odor);
      console.log(formData.zaalId);
      const tempZaal = "674c9367f5b8455cd83d70c2";
      console.log(tempZaal);

      const response = await axiosInstanceRegular.get("/timeslotscheck", {
        params: { zaalniID: tempZaal, odor },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePressTimeSlot = (timeSlot: any) => {
    console.log(`Time slot pressed: ${timeSlot}`);
    setZahialgaBtn(true);
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
        <>
          <CalendarStrip
            style={styles.calendars}
            daySelectionAnimation={{
              type: "background",
              duration: 200,
              highlightColor: Colors.primary,
              animType: "timing",
              animUpdateType: "timing",
              animProperty: "backgroundColor",
              animSpringDamping: 1,
            }}
            selectedDate={new Date(today)}
            onDateSelected={(date: any) => dateSlotGiver(date)}
            calendarAnimation={{ type: "sequence", duration: 5 }}
            dateNumberStyle={{ fontSize: 18, fontWeight: "400" }}
            dateNameStyle={{ fontSize: 10, fontWeight: "400" }}
            calendarHeaderStyle={{ fontSize: 18, fontWeight: "500" }}
          />
          <View style={styles.LLR_style}>
            {/* Render available and unavailable time slots */}
            {baseTimeSlots?.map((timeSlot, index) => {
              const timeString = `${timeSlot.start_time}~${timeSlot.end_time}`;
              const isDisabled = unavailableTimes.some(
                (time: any) =>
                  time.time === timeString && time.status.includes("Completed")
              );
              const isPending = unavailableTimes.some(
                (time: any) =>
                  time.time === timeString && time.status.includes("Pending")
              );
              return (
                <TimeSlot
                  key={index}
                  timeString={timeString}
                  isDisabled={isDisabled}
                  isPending={isPending}
                  handlePressTimeSlot={handlePressTimeSlot}
                />
              );
            })}
          </View>
        </>
      )}
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  loader: {
    height: "100%",
    color: "black",
  },
  zahialgaView: {
    height: "95%",
    paddingBottom: "30%",
    borderBottomWidth: 1,
    borderColor: Colors.primary,
    width: "100%",
  },
  timeSlotView: {
    paddingTop: 10,
    flexDirection: "row",
    //backgroundColor: "black",
  },
  lalarinSdaBtn: {
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
    borderColor: Colors.primary,
  },
  LLR_style: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
