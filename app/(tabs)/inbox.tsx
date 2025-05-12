import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

interface SportHallFeature {
  changingRoom: boolean;
  shower: boolean;
  lighting: boolean;
  spectatorSeats: boolean;
  parking: boolean;
  freeWifi: boolean;
  scoreboard: boolean;
  speaker: boolean;
  microphone: boolean;
  tennis: boolean;
  billiards: boolean;
  darts: boolean;
}

interface SportHallData {
  sportHallID: string;
  name: string;
  address: string;
  imageUrls: string[];
  phoneNumber: string;
  workTime: string;
  availableTimeSlots: {
    start: string;
    end: string;
  }[];
  feature: SportHallFeature;
}
const Page = () => {
  const [sportHalls, setSportHalls] = useState<SportHallData[] | null>(null);

  useEffect(() => {
    setSportHalls([
      {
        sportHallID: "hall-001",
        name: "Цагаан Хуаран спорт комплек",
        address: "Улаанбаатар, БЗД, 26-р хороо",
        imageUrls: ["https://example.com/tsagaan1.jpg"],
        phoneNumber: "9999-1111",
        workTime: "06:00 - 22:00",
        availableTimeSlots: [
          { start: "10:00", end: "12:00" },
          { start: "12:00", end: "14:00" },
        ],
        feature: {
          changingRoom: true,
          shower: true,
          lighting: true,
          spectatorSeats: true,
          parking: true,
          freeWifi: true,
          scoreboard: true,
          speaker: true,
          microphone: true,
          tennis: false,
          billiards: true,
          darts: true,
        },
      },
      {
        sportHallID: "hall-002",
        name: "MCU Спорт Төв",
        address: "Улаанбаатар, СБД, 5-р хороо",
        imageUrls: ["https://example.com/mcu1.jpg"],
        phoneNumber: "8888-2222",
        workTime: "07:00 - 23:00",
        availableTimeSlots: [
          { start: "09:00", end: "11:00" },
          { start: "11:00", end: "13:00" },
        ],
        feature: {
          changingRoom: true,
          shower: false,
          lighting: true,
          spectatorSeats: false,
          parking: true,
          freeWifi: true,
          scoreboard: false,
          speaker: true,
          microphone: false,
          tennis: true,
          billiards: false,
          darts: false,
        },
      },
      {
        sportHallID: "hall-003",
        name: "UG Спорт Заал",
        address: "Улаанбаатар, ХУД, 15-р хороо",
        imageUrls: ["https://example.com/ug1.jpg"],
        phoneNumber: "7777-3333",
        workTime: "08:00 - 20:00",
        availableTimeSlots: [
          { start: "08:00", end: "10:00" },
          { start: "10:00", end: "12:00" },
        ],
        feature: {
          changingRoom: false,
          shower: false,
          lighting: true,
          spectatorSeats: false,
          parking: true,
          freeWifi: false,
          scoreboard: false,
          speaker: false,
          microphone: false,
          tennis: false,
          billiards: false,
          darts: true,
        },
      },
    ]);
  }, []);

  return (
    <ScrollView>
      {sportHalls?.map((item) => {
        return (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.address}</Text>
            <Text>{item.phoneNumber}</Text>
            <Text>{item.workTime}</Text>
            <Text>Available Time Slots:</Text>
            {item.availableTimeSlots.map((slot, index) => (
              <Text key={index}>
                {slot.start} - {slot.end}
              </Text>
            ))}
            <Text>Features:</Text>
            {Object.entries(item.feature).map(([key, value]) => (
              <Text key={key}>
                {key}: {value ? "Yes" : "No"}
              </Text>
            ))}
            {item.imageUrls.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={{ width: 100, height: 100 }}
              />
            ))}
            <Text>--------------------------------</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Page;
