import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { mutate } from "swr";
import Colors from "@/constants/Colors";
import axiosInstance from "../(modals)/functions/axiosInstance";
import { useTranslation } from "react-i18next";
import { useAuth } from "../(modals)/context/authContext";
import { auth_swr } from "../../hooks/useswr";
import { Avatar, Searchbar } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const FriendRequest = () => {
  const [friendData, setFriendData] = useState<string[]>([]);
  const [userRequestData, setUserRequestData] = useState<string[]>([]);
  const [sendRequests, setSendRequests] = useState<string[]>([]);
  const [friendShow, setFriendShow] = useState<
    "Friend" | "Friend Request" | "Send Request"
  >("Friend Request");
  const [friendInfo, setFriendInfo] = useState<any>(null);
  const [entireFriendData, setEntireFriendData] = useState<any>(null);

  const [isitLoading, setIsitLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { t } = useTranslation();
  const { LoginStatus } = useAuth();

  const handleAccept = async (friend_ID: string) => {
    try {
      const response = await axiosInstance.post("/auth/friend_accept", {
        friend_unique_ID: friend_ID,
      });
      console.log(response.data);
      if (response.status == 200) {
        mutate("User_Friend");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleCancel = async (friend_ID: string) => {
    try {
      const response = await axiosInstance.post("/auth/friend_cancel", {
        friend_unique_ID: friend_ID,
      });
      if (response.status == 200) {
        mutate("User_Friend");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const { data, error, isLoading } = auth_swr({
    item: {
      pathname: "friends",
      cacheKey: "User_Friend",
      loginStatus: LoginStatus,
    },
  });

  useEffect(() => {
    if (data) {
      // Check if profileData exists and is a valid JSON string
      let profileData: {
        friends: string[];
        recieved_requests: string[];
        send_requests?: string[];
      } = { friends: [], recieved_requests: [] };
      if (
        typeof data.profileData === "string" &&
        data.profileData.trim() !== ""
      ) {
        try {
          profileData = JSON.parse(data.profileData);
        } catch (err) {
          console.error("Error parsing profileData:", err);
        }
      }
      console.log("Profile Data:", profileData);
      setFriendData(profileData.friends || []);
      setUserRequestData(profileData.recieved_requests || []);
      setSendRequests(profileData.send_requests || []);
      const allValues: string[] = [
        ...(profileData.friends || []),
        ...(profileData.recieved_requests || []),
        ...(profileData.send_requests || []),
      ];
      setEntireFriendData(allValues);
    } else if (error) {
      console.error("Error fetching user friend data:", error);
    }
    setIsitLoading(isLoading);
  }, [data, error, isLoading]);

  const handleRequestSend = async () => {
    try {
      const response = await axiosInstance.post("/auth/friend_request", {
        friend_unique_ID: searchQuery,
      });
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/auth/friend_data", {
          params: {
            friend_unique_ID: entireFriendData,
          },
        });
        console.log("User Info:", response.data);
        setFriendInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, [entireFriendData]);
  const options: ("Friend" | "Friend Request" | "Send Request")[] = [
    "Friend",
    "Friend Request",
    "Send Request",
  ];

  const currentData =
    friendShow === "Friend"
      ? friendData
      : friendShow === "Friend Request"
      ? userRequestData
      : sendRequests;

  return (
    <View style={{ backgroundColor: Colors.lightGrey, flex: 1 }}>
      {isitLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <View style={style.subContainer}>
            <Searchbar
              mode="bar"
              placeholder="Search & Add Friends"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              style={{
                width: "100%",
                backgroundColor: Colors.white,
                borderRadius: 10,
                borderBottomColor: Colors.white,
                marginTop: 10,
              }}
              placeholderTextColor={Colors.darkGrey}
              right={(props) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.secondary,
                    borderRadius: 10,
                    padding: 15,
                  }}
                  onPress={() => {
                    handleRequestSend();
                  }}
                >
                  <Text style={{ color: Colors.white }}>Send Request</Text>
                </TouchableOpacity>
              )}
            />

            <View style={style.allFriendContainer}>
              <View style={style.friendContainer}>
                {options.map((label) => (
                  <TouchableOpacity
                    key={label}
                    style={[
                      style.innerFriend,
                      {
                        backgroundColor:
                          friendShow === label
                            ? Colors.secondary
                            : Colors.white,
                      },
                    ]}
                    onPress={() => {
                      setFriendShow(label); // ✅ Now TypeScript knows it's a valid value
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color:
                          friendShow === label ? Colors.white : Colors.darkGrey,
                        writingDirection: "ltr",
                      }}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={style.outFriendContainer}>
              <FlatList
                data={currentData}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item }) => (
                  <View
                    style={{
                      backgroundColor: Colors.grey,
                      marginHorizontal: 20,
                      padding: 15,
                      borderRadius: 10,
                      marginTop: 10,
                      flexDirection: "row",
                    }}
                  >
                    <Text>{item}</Text>
                  </View>
                )}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  subContainer: {
    backgroundColor: Colors.lightGrey,
    marginHorizontal: 10,
    flex: 1,
  },
  allFriendContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    height: 50,
    backgroundColor: Colors.dark,
  },
  friendContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
    height: 70,
    borderRadius: 10,
  },
  innerFriend: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    padding: 15,
    width: "33.3%",
  },
  outFriendContainer: {
    width: "100%",
    height: "70%",
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop: 20,
  },
});
export default FriendRequest;
