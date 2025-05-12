import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Socket } from "socket.io-client";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import Colors from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { format, parseISO, differenceInDays } from "date-fns";
import { useTranslation } from "react-i18next";
import { useAuth } from "../(modals)/context/authContext";
import { auth_swr, regular_swr } from "../../hooks/useswr";
import MainChatModal from "../(modals)/functions/modals/mainChatModal";
import { Avatar } from "react-native-paper";
import { useFocusEffect } from "expo-router";
import { connectSocket, getSocket } from "@/hooks/socketConnection";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

interface Message {
  sender_unique_name: string;
  groupId: string;
  message: string;
  timestamp: Date;
  showDateSeparator?: boolean;
}
export interface GroupChat {
  group_ID: string;
  group_chat_name: string;
  members: string[];
  chat_image: string;
  sportHallName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

export const prepareMessages = (messages: Message[]) => {
  const result = [...messages];
  const dateGroups: Record<string, number[]> = {};

  // Group messages by their date
  result.forEach((msg, index) => {
    const dateKey = format(parseISO(msg.timestamp.toString()), "yyyy-MM-dd");
    if (!dateGroups[dateKey]) dateGroups[dateKey] = [];
    dateGroups[dateKey].push(index);
  });

  const dates = Object.keys(dateGroups);

  // If there is only 1 date, don't mark anything
  if (dates.length <= 1) {
    return result.map((msg) => ({ ...msg, showDateSeparator: false }));
  }

  // Otherwise, mark the last message of each day
  dates.forEach((dateKey) => {
    const indexes = dateGroups[dateKey];
    const lastIndex = indexes[indexes.length - 1];
    result[lastIndex] = {
      ...result[lastIndex],
      showDateSeparator: true,
    };
  });

  return result;
};

export const newMsjPrepare = (previewMsj: any, newMsj: any) => {
  const diff = differenceInDays(newMsj.timestamp, previewMsj);
  if (diff > 0) {
    return {
      ...newMsj,
      showDateSeparator: true,
    };
  } else {
    return {
      ...newMsj,
      showDateSeparator: false,
    };
  }
};

export interface ActiveUserType {
  unique_user_ID: string;
  status: string;
}
const ChatComponent: React.FC = () => {
  const [chatGroups, setChatGroups] = useState<GroupChat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [currentGroupId, setCurrentGroupId] = useState<string>("");
  const [mainModalShow, setmainModalShow] = useState<boolean>(false);
  const [userDatas, setUserDatas] = useState<any>([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isitReady, setIsitReady] = useState<boolean>(false);
  const [childModalVisible, setChildModalVisible] = useState<boolean>(false);
  const [activeUserData, setActiveUserData] = useState<ActiveUserType[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList | null>(null);

  const { t } = useTranslation();

  const { LoginStatus } = useAuth();

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = auth_swr({
    item: {
      pathname: "main",
      cacheKey: "RoleAndProfile_main",
      loginStatus: LoginStatus,
    },
  });

  const {
    data: chatData,
    error: chatError,
    isLoading: chatLoading,
  } = regular_swr({
    item: {
      pathname: "/auth/chatcheck",
      cacheKey: "group_chat",
      loginStatus: LoginStatus,
    },
  });

  useEffect(() => {
    if (chatLoading) {
      setLoading(true);
    } else if (chatData && chatData.success) {
      setChatGroups(
        chatData.chatGroupIDs.map((groupID: any) => {
          const groupChatName = groupID.group_chat_name;
          const regex =
            /(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s+[–-]\s+(\d{2}:\d{2})/;
          const match = groupChatName.match(regex);
          if (match) {
            const [_, date, startTime, endTime] = match;
            const indexOfDate = groupChatName.indexOf(date);

            const sportHallName = groupChatName
              .substring(0, indexOfDate)
              .replace(/-\s*$/, "")
              .trim();

            return {
              group_ID: groupID._id,
              members: groupID.members,
              group_chat_name: `${sportHallName} - ${date} ${startTime} – ${endTime}`,
              chat_image: groupID.chat_image,
              // splitted data
              sportHallName,
              date,
              startTime,
              endTime,
            };
          } else if (match === null) {
            return {
              group_ID: groupID._id,
              members: groupID.members,
              group_chat_name: groupChatName,
              chat_image: groupID.chat_image,
            };
          }
        })
      );
    } else if (chatError) {
      console.log("Chat Error:", chatError);
      Sentry.captureException(chatError);
    }
  }, [chatData, chatError, userLoading]);

  useEffect(() => {
    if (userLoading) {
      setLoading(true);
    } else if (userData) {
      const parsedData =
        typeof userData.profileData == "string"
          ? JSON.parse(userData.profileData)
          : userData.profileData;
      setUserDatas(Array.isArray(parsedData) ? parsedData[0] : parsedData);
    } else if (userError) {
      Sentry.captureException(chatError);
    }
  }, [userData, userError, userLoading]);

  const joinSpecificChat = async (groupId: string) => {
    let socket = getSocket();

    if (!socket || !socket.connected) {
      console.warn("Socket not ready");
      socket = await connectSocket();
    }

    if (!socket) {
      console.warn("Failed to establish socket connection");
      return;
    }

    if ((socket as any).currentGroupId === groupId) {
      setmainModalShow(true);
      return;
    }

    setMessages([]);

    if ((socket as any).currentGroupId) {
      socket.emit("leave_group", (socket as any).currentGroupId);
    }

    socket.emit("joinGroup", { item: groupId });
    (socket as any).currentGroupId = groupId;

    socket.emit("chatHistory", { timer: Date.now() });

    socket.once("chatHistory", (message) => {
      setIsitReady(true);

      if (message.nextCursor === null) {
        setLoading(false);
        setIsitReady(false);
        return;
      }

      const formattedMessages = prepareMessages(message.messages);
      setMessages((prevMsj: Message[]) => {
        const merged = [...formattedMessages, ...prevMsj];
        const seen = new Set();
        return merged.filter((item) => {
          if (seen.has(item.timestamp)) return false;
          seen.add(item.timestamp);
          return true;
        });
      });
      setCursor(message.nextCursor);
      setIsitReady(false);
    });

    setmainModalShow(true);

    // 🧼 Clean previous listener
    socket.off("receiveMessage");

    socket.on("receiveMessage", (data: Message) => {
      const newMsj: Message = {
        sender_unique_name: data.sender_unique_name,
        groupId: data.groupId,
        message: data.message,
        timestamp: new Date(data.timestamp),
      };

      setMessages((prevMessages: Message[]) => {
        const merged = [newMsj, ...prevMessages];
        const seen = new Set();
        return merged.filter((item) => {
          if (seen.has(item.timestamp)) return false;
          seen.add(item.timestamp);
          return true;
        });
      });

      flatListRef.current?.scrollToIndex({
        index: 0,
        animated: true,
      });
    });
  };
  useFocusEffect(
    useCallback(() => {
      const initSocket = async () => {
        const socket = await connectSocket();
        if (!socket) return;
        socketRef.current = socket;
      };
      initSocket();
    }, [])
  );
  const handleSocket = useCallback(() => {
    if (mainModalShow) {
      socketRef.current?.emit("chat-active");
    } else {
      socketRef.current?.emit("chat-inactive");
    }
  }, [mainModalShow]);

  useEffect(() => {
    handleSocket();
  }, [mainModalShow]);

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current?.on("user-active-change", (data) => {
      setActiveUserData(
        data
          .filter((user: ActiveUserType) => user.status === "active")
          .map((user: ActiveUserType) => ({
            unique_user_ID: user.unique_user_ID,
            status: user.status,
          }))
      );
    });
    return () => {
      socketRef.current?.off("user-active-change");
    };
  }, [socketRef.current]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    const groupId = (socketRef.current as any).currentGroupId;
    if (!groupId || !socketRef.current) return;

    const newMessage = {
      sender_unique_name: userDatas.unique_user_ID,
      groupId: currentGroupId,
      message: messageText,
      timestamp: new Date(),
    };

    const prevMsj = messages.length > 0 ? messages[0].timestamp : null;

    if (!prevMsj) {
      const newMsjPrepared = {
        ...newMessage,
        showDateSeparator: true,
      };
      setMessages((prevMessages) => [newMsjPrepared, ...prevMessages]);
    } else {
      const newMsjPrepared = newMsjPrepare(prevMsj, newMessage);
      setMessages((prevMessages) => [newMsjPrepared, ...prevMessages]);
    }
    console.log(newMessage);
    socketRef.current.emit("sendMessage", newMessage);
    flatListRef.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
  };

  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;
  const { bottom } = useSafeAreaInsets();

  const MemoizedChatItem = React.memo(
    ({ item, userDatas }: { item: Message; userDatas: any }) => {
      //본인
      const userSelf: boolean =
        item.sender_unique_name === userDatas.unique_user_ID;
      return (
        <View>
          {item.showDateSeparator && (
            <View style={styles.dateSeparator}>
              <View style={styles.line} />
              <Text style={styles.dateText}>
                {format(new Date(item.timestamp), "EEEE MMMM dd")}
              </Text>
              <View style={styles.line} />
            </View>
          )}

          <View
            style={[
              styles.msjContainer,
              { alignItems: userSelf ? "flex-end" : "flex-start" },
            ]}
          >
            <View style={{ flexDirection: "row" }}>
              {!userSelf && (
                <View style={{ marginRight: 6 }}>
                  <Avatar.Icon size={40} icon={"account"} />
                </View>
              )}

              <View>
                <View>
                  {!userSelf && (
                    <Text style={[styles.userNameText, { marginBottom: 4 }]}>
                      {item.sender_unique_name}
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    styles.msjInside,
                    userSelf
                      ? {
                          borderBottomLeftRadius: 10,
                          borderBottomRightRadius: 10,
                          borderTopLeftRadius: 10,
                          backgroundColor: Colors.primary,
                          borderColor: Colors.primary,
                          marginLeft: 50,
                        }
                      : {
                          borderBottomLeftRadius: 10,
                          borderBottomRightRadius: 10,
                          borderTopRightRadius: 10,
                          backgroundColor: Colors.white,
                          borderColor: Colors.white,
                          marginRight: 100,
                        },
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      {
                        color: userSelf ? Colors.light : Colors.dark,
                      },
                    ]}
                  >
                    {item.message}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 11,
                    color: Colors.dark,
                    fontWeight: "300",
                    marginTop: 2,
                    alignSelf: userSelf ? "flex-end" : "flex-start",
                  }}
                >
                  {format(item.timestamp, "hh:mm a")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    },
    (prev, next) =>
      prev.item.message === next.item.message &&
      prev.item.timestamp === next.item.timestamp
  );

  const renderChatItem = useCallback(
    ({ item }: { item: Message }) => {
      return <MemoizedChatItem item={item} userDatas={userDatas} />;
    },
    [userDatas]
  );

  const loadOlderMsj = async () => {
    if (!socketRef.current?.connected || !cursor) return;

    socketRef.current?.emit("chatHistory", { timer: cursor });
    socketRef.current?.once("chatHistory", (message) => {
      if (
        !message.messages ||
        message.messages.length === 0 ||
        message.nextCursor == null
      ) {
        setLoading(false);
        return;
      }
      const formattedMessages = prepareMessages(message.messages);
      setMessages((prevMessages) => [...prevMessages, ...formattedMessages]);
      setCursor(message.nextCursor);
      setLoading(false);
    });
  };

  return (
    <View style={[styles.container]}>
      {userLoading ? (
        <View>
          <ActivityIndicator color={Colors.primary} size={"small"} />
        </View>
      ) : (
        <View
          style={{
            width: width,
            height: height - bottom,
          }}
        >
          <FlatList
            data={chatGroups}
            style={styles.groupItemContainer}
            renderItem={({ item }) => (
              <View style={styles.groupItem}>
                <TouchableOpacity
                  onPress={() => joinSpecificChat(item.group_ID)}
                  style={{ flexDirection: "row", padding: 5, gap: 5 }}
                >
                  <Avatar.Image
                    size={40}
                    source={require("@/assets/images/sportHall_Icon_full_primary.png")}
                    theme={{
                      colors: { primary: Colors.white },
                    }}
                  />
                  <View
                    style={{
                      flex: 1,
                      flexWrap: "wrap",
                      flexDirection: "row",
                      gap: 5,
                    }}
                  >
                    {item.sportHallName &&
                    item.date &&
                    item.startTime &&
                    item.endTime ? (
                      <>
                        <Text style={{ fontWeight: 600 }}>
                          {item.sportHallName}
                        </Text>
                        <Text style={{ fontWeight: 800 }}>-</Text>
                        <Text style={{ fontWeight: 300 }}>
                          {item.date
                            ? format(new Date(item.date), "MMMM dd")
                            : ""}
                        </Text>
                        <Text>
                          {item.startTime} - {item.endTime}
                        </Text>
                      </>
                    ) : (
                      <Text>{item.group_chat_name}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.group_ID}
          />
        </View>
      )}

      <MainChatModal
        mainModalShow={mainModalShow}
        setmainModalShow={setmainModalShow}
        isitReady={isitReady}
        setChildModalVisible={setChildModalVisible}
        childModalVisible={childModalVisible}
        message={messages}
        loadOlderMsj={loadOlderMsj}
        loading={loading}
        flatListRef={flatListRef}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        renderChatItem={renderChatItem}
        memberData={chatGroups}
        activeUserData={activeUserData}
        socketRef={socketRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 28,
    marginVertical: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 12,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
  },
  groupItemContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  groupItem: {
    padding: 10,
    marginVertical: 7,
    borderRadius: 5,
    backgroundColor: Colors.white,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  groupText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  messageContainer: {
    marginVertical: 3,
    width: "100%",
  },
  userNameText: {
    fontSize: 12,
    color: Colors.primary,
    textShadowColor: Colors.primary,
    textShadowRadius: 0.5,
  },
  messageText: {
    padding: 5,
    fontSize: 18,
    marginRight: 0,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  messagesList: {
    //height: Dimensions.get("window").height,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    gap: 10,
  },

  msjContainer: {
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  msjInside: {
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  TimerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  userImage: {},

  dateSeparator: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.primary,
    marginHorizontal: 5,
  },
  dateText: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: Colors.primary,
    fontWeight: "400",
  },
});

export default ChatComponent;
