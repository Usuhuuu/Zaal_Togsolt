import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useSWR from "swr";
import { fetchRoleAndProfil } from "../(modals)/functions/UserProfile";
import { useNavigation } from "@react-navigation/native";
import { Href, router } from "expo-router";

const notificationsData = [
  {
    id: "1",
    message: "Таны захиалга баталгаажсан.",
    time: "2 минутын өмнө",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "2",
    message: "Таны дараагийн захиалгад шинэ санал байна!",
    time: "1 цагийн өмнө",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "3",
    message: "Суралцах цагийн 30 минутын өмнө сануулга.",
    time: "3 цагийн өмнө",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "4",
    message: "Таны дасгалжуулагчтай шинэ мессеж ирлээ.",
    time: "5 цагийн өмнө",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "5",
    message: "Таны дасгал эхлэхэд 10 минут үлдлээ.",
    time: "1 өдрийн өмнө",
    avatar: "https://via.placeholder.com/40",
  },
];
const NotificationScreen = () => {
  const [userData, setUserData] = useState<string>("");
  const [isitLoading, setIsitLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  const handleNotificationPress = (message: string) => {
    alert(`Та дарахад: ${message}`);
  };

  const {
    data: userFriendData,
    error,
    isLoading,
  } = useSWR("User_Friend", {
    fetcher: () => fetchRoleAndProfil("friends"),
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryInterval: 4000,
    errorRetryCount: 3,
    dedupeInterval: 10000,
  });
  useEffect(() => {
    if (userFriendData) {
      setUserData(userFriendData);
    } else if (error) {
      console.error("Error fetching user friend data:", error);
    }
    //setIsitLoading(isLoading);
  });

  return (
    <SafeAreaProvider>
      {isLoading ? (
        <ActivityIndicator size="large" style={styles.container} />
      ) : (
        <>
          <View style={styles.container}>
            <TouchableOpacity
              style={[styles.buttons, { gap: 10 }]}
              onPress={() =>
                router.push(
                  "/listing/friendRequest" as Href<"listing/friendRequest">
                )
              }
            >
              <Image
                source={{ uri: "https://via.placeholder.com/40" }}
                style={styles.avatar}
              />
              <Text style={styles.texts}>Friend Request</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>

            <FlatList
              data={notificationsData}
              contentContainerStyle={{
                top: 10,
                borderColor: Colors.primary,
                borderTopWidth: 1,
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.notificationItem}
                  onPress={() => handleNotificationPress(item.message)}
                >
                  <View style={styles.notificationContent}>
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.avatar}
                    />
                    <View style={styles.notificationText}>
                      <Text style={styles.notificationMessage}>
                        {item.message}
                      </Text>
                      <Text style={styles.notificationTime}>{item.time}</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={Colors.primary}
                    />
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />

            <View style={styles.footer}>
              <Text style={styles.footerButtonText}>google ad</Text>
            </View>
          </View>
        </>
      )}
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    justifyContent: "space-between",
    backgroundColor: Colors.light,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    backgroundColor: Colors.secondary,
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 8,

    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 5,
  },
  notificationItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    margin: 10,

    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notificationText: {
    flex: 1,
    marginLeft: 10,
  },
  notificationMessage: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  notificationTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  footer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderTopColor: Colors.primary,
  },
  footerButtonText: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  texts: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NotificationScreen;
