import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import useSWR, { mutate } from "swr";
import { fetchRoleAndProfil } from "../(modals)/functions/UserProfile";
import Colors from "@/constants/Colors";
import axiosInstance from "../(modals)/functions/axiosInstanc";

interface friendRequestProps {
  copyToClipboard: () => void;
  friendRequestData: Array<string>;
}

const FriendRequest = ({ friendRequestData = [] }: friendRequestProps) => {
  const [friendData, setFriendData] = useState<string[]>([]);
  const [userRequestData, setUserRequestData] = useState<string[]>([]);
  const [isitLoading, setIsitLoading] = useState<boolean>(false);

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

  const { data, error, isLoading } = useSWR("User_Friend", {
    fetcher: () => fetchRoleAndProfil("friends"),
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryInterval: 4000,
    errorRetryCount: 3,
    dedupeInterval: 3000,
  });

  useEffect(() => {
    if (data) {
      const profileData = JSON.parse(data.profileData);
      setFriendData(profileData.friends);
      setUserRequestData(profileData.recieved_requests);
    } else if (error) {
      console.error("Error fetching user friend data:", error);
    }

    setIsitLoading(isLoading);
  }, []);

  return (
    <>
      {isitLoading ? (
        <ActivityIndicator size="large" style={style.Container} />
      ) : (
        <ScrollView style={style.subContainer}>
          <View style={style.requestContainer}>
            <Text style={style.sectionTitle}>Friend Requests</Text>
            {userRequestData.length > 0 ? (
              userRequestData.map((item, index) => (
                <View style={style.requestSubContainer}>
                  <Text style={style.requestItem} key={index}>
                    {item}
                  </Text>
                  <TouchableOpacity
                    style={style.buttonAccept}
                    onPress={() => handleAccept(item)}
                  >
                    <Text style={{ fontSize: 18, color: Colors.light }}>
                      Accept
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={style.buttonCancel}
                    onPress={() => handleCancel(item)}
                  >
                    <Text style={{ fontSize: 18, color: Colors.light }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={style.requestItem}>No friend requests</Text>
            )}
          </View>
          <View style={style.friendContainer}>
            <Text style={style.sectionTitle}>Friends List</Text>
            {friendData.length > 0 ? (
              friendData.map((item, index) => (
                <Text style={style.requestItem} key={index}>
                  {item}
                </Text>
              ))
            ) : (
              <Text style={style.requestItem}>No friends</Text>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
};

const style = StyleSheet.create({
  Container: {
    height: Dimensions.get("window").height,
    zIndex: 1,
  },
  subContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  requestSubContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requestContainer: {
    backgroundColor: Colors.light,
    padding: 20,
    minHeight: Dimensions.get("window").height / 2 - 50,
  },
  friendContainer: {
    backgroundColor: Colors.light,
    padding: 20,
    minHeight: Dimensions.get("window").height / 2 - 50,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  requestItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    fontSize: 25,
    fontWeight: "300",
  },
  friendItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  buttonAccept: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 25,
  },
  buttonCancel: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 25,
  },
});
export default FriendRequest;
