import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { io, Socket } from "socket.io-client";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import Colors from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { format, parseISO, differenceInDays } from "date-fns";
import { useTranslation } from "react-i18next";
import { useAuth } from "../(modals)/context/authContext";
import { auth_swr, regular_swr } from "../(modals)/functions/useswr";
import MainChatModal from "../(modals)/functions/modals/mainChatModal";
import { Avatar } from "react-native-paper";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

interface Message {
  sender_unique_name: string;
  groupId: string;
  message: string;
  timestamp: Date;
  showDateSeparator?: boolean;
}
interface GroupChat {
  group_ID: string;
  group_chat_name: string;
  members: string;
  chat_image: string;
}

const prepareMessages = (messages: Message[]) => {
  return messages.map((message, index) => {
    const currentDate = format(
      parseISO(message.timestamp.toString()),
      "yyyy-MM-dd"
    );

    const nextMessage = messages[index + 1];
    const nextDate = nextMessage
      ? format(parseISO(nextMessage.timestamp.toString()), "yyyy-MM-dd")
      : null;

    const isLastMessageOfDay = currentDate !== nextDate;

    const hasOlderDate = messages.some((msg, i) => {
      if (i <= index) return false;
      const msgDate = format(parseISO(msg.timestamp.toString()), "yyyy-MM-dd");
      return msgDate !== currentDate;
    });

    return {
      ...message,
      showDateSeparator: isLastMessageOfDay && hasOlderDate,
    };
  });
};

const newMsjPrepare = (previewMsj: any, newMsj: any) => {
  const diff = differenceInDays(newMsj.timestamp, previewMsj.timestamp);
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

const ChatComponent: React.FC = () => {
  const [chatGroups, setChatGroups] = useState<GroupChat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [currentGroupId, setCurrentGroupId] = useState<string>("");
  const [readyToShow, setReadyToShow] = useState<boolean>(false);
  const [userDatas, setUserDatas] = useState<any>([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isitReady, setIsitReady] = useState<boolean>(false);
  const [childModalVisible, setChildModalVisible] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList | null>(null);
  const { t } = useTranslation();

  const chatInitLang: any = t("chatRoom", { returnObjects: true });
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
    item: { pathname: "/auth/chatcheck", cacheKey: "group_chat" },
  });

  useEffect(() => {
    if (chatLoading) {
      setLoading(true);
    } else if (chatData && chatData.success) {
      setChatGroups(
        chatData.chatGroupIDs.map((groupID: any) => ({
          group_ID: groupID._id,
          members: groupID.members,
          group_chat_name: groupID.group_chat_name,
          chat_image: groupID.chat_image,
        }))
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
      // if (chatError.message === "Token not founded pisda") {
      //   return Alert.alert("Login required.");
      // }
      Sentry.captureException(chatError);
    }
  }, [userData, userError, userLoading]);

  const chatInit = async (groupId: string) => {
    try {
      setCurrentGroupId(groupId);
      const token = await SecureStore.getItemAsync("Tokens");
      if (!token) {
        return Alert.alert("Login required to join group.");
      }
      const { accessToken, refreshToken } = JSON.parse(token);
      // Initialize socket if not already connected
      if (!socketRef.current || socketRef.current.disconnected) {
        socketRef.current = io(`${apiUrl}`, {
          auth: { token: accessToken },
          query: { groupId },
          transports: ["websocket"],
          secure: false,
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
        });
        (socketRef.current as any).hasFetchedHistory = false;

        // 🔹 Handle successful connection
        socketRef.current.on("connect", () => {
          if (!(socketRef.current as any).hasFetchedHistory) {
            socketRef.current?.emit("chatHistory", { timer: Date.now() });
            socketRef.current?.once("chatHistory", (message) => {
              setIsitReady(true);
              if (message.nextCursor === null) {
                setLoading(false);
                setIsitReady(false);
                return;
              }
              const formattedMessages = prepareMessages(message.messages);
              setMessages((prevMsj) => [...formattedMessages, ...prevMsj]);
              setCursor(message.nextCursor);
              setIsitReady(false);
            });
          }

          socketRef.current?.on("receiveMessage", (data: Message) => {
            if (data.groupId !== currentGroupId) return;
            const newMsj: Message = {
              sender_unique_name: data.sender_unique_name,
              groupId: data.groupId,
              message: data.message,
              timestamp: new Date(data.timestamp),
            };

            if (data.sender_unique_name === userDatas.unique_user_ID) {
              return;
            }
            setMessages((prevMessages) => [newMsj, ...prevMessages]);
          });

          socketRef.current?.on("reconnect", (attempt) => {
            console.log(`Reconnected successfully after ${attempt} attempts`);
          });
        });

        socketRef.current.emit("joinGroup");

        // 🔹 Handle token expiration & reconnection
        socketRef.current.on("connect_error", async (error) => {
          if (error.message === "websocket error") {
            console.log("WebSocket error, retrying...");
            return;
          }
          try {
            const res = await axios.post(
              `${apiUrl}/auth/refresh`,
              {},
              { headers: { Authorization: `Bearer ${refreshToken}` } }
            );
            if (res.status == 200 && res.data.success) {
              await SecureStore.setItemAsync(
                "Tokens",
                JSON.stringify({
                  accessToken: res.data.newAccessToken,
                  refreshToken,
                })
              );
              if (socketRef.current) {
                socketRef.current.auth = {
                  token: res.data.newAccessToken,
                };
                socketRef.current.connect();
                //socketRef.current?.off("chatHistory");
              }
            } else if (res.status === 400) {
              await SecureStore.deleteItemAsync("Tokens");
              alert("Token has expired. Please login again.");
            }
          } catch (err) {
            console.log(err);
          }
        });

        // 🔹 Handle disconnection
        socketRef.current.on("disconnect", async (reason) => {
          console.log(`Disconnected from chat. Reason: ${reason}`);
        });
      }

      setReadyToShow(true);
    } catch (error) {
      console.error("Error joining group:", error);
      Sentry.captureException(error);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    const groupId = currentGroupId;
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
    socketRef.current.emit("sendMessage", newMessage);
    console.log("Message sent:", newMessage);
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
                          backgroundColor: Colors.lightGrey,
                          borderColor: Colors.lightGrey,
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
    (prevProps, nextProps) => prevProps.item === nextProps.item
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
      {isLoading ? (
        <View>
          <ActivityIndicator color={Colors.primary} size={"large"} />
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
                <Avatar.Icon icon={item.chat_image} />
                <TouchableOpacity onPress={() => chatInit(item.group_ID)}>
                  <Text style={styles.groupText}>{item.group_chat_name}</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.group_ID}
          />
        </View>
      )}
      <MainChatModal
        readyToShow={readyToShow}
        setReadyToShow={setReadyToShow}
        socketRef={socketRef}
        setMessages={setMessages}
        isitReady={isitReady}
        setChildModalVisible={setChildModalVisible}
        childModalVisible={childModalVisible}
        currentGroupId={currentGroupId}
        message={messages}
        loadOlderMsj={loadOlderMsj}
        loading={loading}
        flatListRef={flatListRef}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        renderChatItem={renderChatItem}
        chatInitLang={chatInitLang}
        memberData={chatGroups}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderWidth: 0.3,
    padding: 10,
    marginVertical: 7,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
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
