import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar: React.FC = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();

  const [joinableDays, setJoinableDays] = useState<number[]>([
    1, 3, 5, 7, 10, 15, 22,
  ]); // just for example
  const [unavailableDays, setUnavailableDays] = useState<number[]>([
    2, 4, 6, 8, 12, 18, 25,
  ]); // example
  const [selectedDates, setSelectedDates] = useState<number[]>([]);

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const toggleSelectDate = (day: number) => {
    setSelectedDates((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.monthYear}>
        {today.toLocaleString("default", { month: "long" })} {year}
      </Text>

      <View style={styles.weekRow}>
        {DAYS.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.datesGrid}>
        {calendarDays.map((day, index) => {
          if (!day) return <View key={index} style={styles.emptyCell} />;

          const isToday = day === date;
          const isSelected = selectedDates.includes(day);
          const isJoinable = joinableDays.includes(day);
          const isUnavailable = unavailableDays.includes(day);

          let label = "";
          if (isJoinable) label = "Join";
          else if (isUnavailable) label = "Unavailable";
          else label = "Free";

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateButton,
                isToday && styles.today,
                isSelected && styles.selectedDate,
                isJoinable && styles.joinable,
                isUnavailable && styles.unavailable,
              ]}
              onPress={() => toggleSelectDate(day)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.dateText,
                  (isToday || isSelected || isJoinable || isUnavailable) &&
                    styles.whiteText,
                ]}
              >
                {day}
              </Text>
              <Text
                style={[
                  styles.labelText,
                  (isJoinable || isUnavailable) && styles.whiteText,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.legends}>
        <Text style={styles.legendTitle}>Joinable Days:</Text>
        <Text style={styles.legendList}>
          {joinableDays.join(", ") || "None"}
        </Text>

        <Text style={[styles.legendTitle, { marginTop: 12 }]}>
          Unavailable Days:
        </Text>
        <Text style={styles.legendList}>
          {unavailableDays.join(", ") || "None"}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  monthYear: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekDay: {
    width: 32,
    textAlign: "center",
    fontWeight: "600",
    color: "#666",
  },
  datesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dateButton: {
    width: "14.28%",
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  today: {
    backgroundColor: "#3399FF",
  },
  joinable: {
    backgroundColor: "#4CAF50",
  },
  unavailable: {
    backgroundColor: "#F44336",
  },
  selectedDate: {
    backgroundColor: "#FF9933",
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
  whiteText: {
    color: "white",
    fontWeight: "700",
  },
  emptyCell: {
    width: "14.28%",
    height: 40,
  },
  legends: {
    marginTop: 20,
    paddingHorizontal: 8,
  },
  legendTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  legendList: {
    fontSize: 14,
    color: "#444",
  },
  labelText: {
    fontSize: 10,
    marginTop: 2,
    color: "#666",
  },
});

export default Calendar;
