import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { io, Socket } from "socket.io-client";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import useSWR from "swr";
import {
  fetchRoleAndProfile,
  normalFetch,
} from "../(modals)/functions/profile_data_fetch";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { differenceInMinutes, formatDistanceToNow, parseISO } from "date-fns";
import ChildModal from "../(modals)/childModal";
import { useTranslation } from "react-i18next";
import { useAuth } from "../(modals)/context/authContext";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

interface Message {
  sender_unique_name: string;
  groupId: string;
  message: string;
  timestamp: Date;
  grouped?: boolean;
}

const markGroupedMessages = (messages: Message[]) => {
  if (!messages.length) return [];

  let initMsj = parseISO(messages[0].timestamp.toString());
  const markedMsj = messages.map((msj, index) => {
    if (index === 0) {
      return { ...msj, grouped: false };
    }
    const timeDiff = differenceInMinutes(
      initMsj,
      parseISO(msj.timestamp.toString())
    );
    if (timeDiff < 30) {
      return { ...msj, grouped: true };
    } else {
      initMsj = parseISO(msj.timestamp.toString());
      return { ...msj, grouped: false };
    }
  });

  return markedMsj;
};

const ChatComponent: React.FC = () => {
  const [chatGroups, setChatGroups] = useState<{ groupId: string }[]>([]);
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
  } = useSWR(LoginStatus ? [`RoleAndProfile_main`, LoginStatus] : null, {
    fetcher: () => fetchRoleAndProfile("main", LoginStatus),
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 10000,
    errorRetryInterval: 4000,
    errorRetryCount: 3,
  });

  const {
    data: chatData,
    error: chatError,
    isLoading: chatLoading,
  } = useSWR("group_chat", {
    fetcher: () => normalFetch("/auth/chatcheck"),
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
  });

  useEffect(() => {
    if (chatLoading) {
      setLoading(true);
    } else if (chatData && chatData.success) {
      setChatGroups(
        chatData.chatGroupIDs.map((groupId: string) => ({ groupId }))
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
        Sentry.captureException("Token not found while joining group.");
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
          socketRef.current?.emit("chatHistory", { timer: Date.now() });

          socketRef.current?.once("chatHistory", (message) => {
            setIsitReady(true);
            if (message.nextCursor == null) {
              setIsitReady(false);
              return;
            }

            setMessages((prevMsj) => [...message.messages, ...prevMsj]);
            setCursor(message.nextCursor);
            setIsitReady(false);
          });

          socketRef.current?.on("receiveMessage", (data: Message) => {
            if (data.groupId !== currentGroupId) return;

            if (data.sender_unique_name === userDatas.unique_user_ID) {
              return;
            }
            setMessages((prevMessages) => [...prevMessages, data]);
          });

          socketRef.current?.on("reconnect", (attempt) => {
            console.log(`Reconnected successfully after ${attempt} attempts`);
          });
        });

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

    setMessages((prevMessages) => [newMessage, ...prevMessages]);
    socketRef.current.emit("sendMessage", newMessage);
    flatListRef.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
  };

  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;
  const headerHeight = useHeaderHeight();
  const { bottom } = useSafeAreaInsets();

  const MemoizedChatItem = React.memo(
    ({ item, userDatas }: { item: Message; userDatas: any }) => {
      return (
        <View>
          {item.sender_unique_name === userDatas.unique_user_ID ? (
            <View
              style={[
                styles.msjContainer,
                { alignItems: "flex-end", marginVertical: 3 },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 5,
                }}
              >
                {!item.grouped && (
                  <Text style={{ color: Colors.dark, fontWeight: "200" }}>
                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.msjInside,
                  {
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    borderTopLeftRadius: 10,
                    borderColor: Colors.lightGrey,
                    backgroundColor: Colors.lightGrey,
                    alignItems: "center",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    { fontWeight: "500", alignItems: "center" },
                  ]}
                >
                  {item.message}
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.msjContainer,
                { alignItems: "flex-start", marginVertical: 3 },
              ]}
            >
              <View
                style={[
                  styles.msjInside,
                  {
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                    borderColor: Colors.primary,
                    backgroundColor: Colors.primary,
                  },
                ]}
              >
                <Text style={[styles.messageText, { color: Colors.light }]}>
                  {item.message}
                </Text>
              </View>
              {!item.grouped && (
                <Text style={{ color: Colors.dark, fontWeight: "200" }}>
                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </Text>
              )}
            </View>
          )}
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

      setMessages((prevMessages) => [...prevMessages, ...message.messages]);
      setCursor(message.nextCursor);
      setLoading(false);
    });
  };
  const markedMessages = markGroupedMessages(messages);
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
              <TouchableOpacity
                style={styles.groupItem}
                onPress={() => chatInit(item.groupId)}
              >
                <Text style={styles.groupText}>{item.groupId}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.groupId}
          />
          <Text>sda</Text>
        </View>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={readyToShow}
        style={{ zIndex: 1 }}
        onRequestClose={() => {
          if (socketRef.current?.connected) {
            socketRef.current?.disconnect();
          }
          setReadyToShow(false);
        }}
        onDismiss={() => {
          setMessages([]);
        }}
      >
        {isitReady ? (
          <ActivityIndicator color={Colors.primary} size={"large"} />
        ) : (
          <SafeAreaProvider
            style={{
              backgroundColor: "#fff",
            }}
          >
            <SafeAreaView
              style={{
                height: height,
                width: width,
              }}
            >
              <View
                style={{
                  height: height - headerHeight,
                  width: "95%",
                  marginHorizontal: 10,
                }}
              >
                <View
                  style={{
                    height: headerHeight / 2,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    borderBottomColor: "#ddd",
                    borderBottomWidth: 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setReadyToShow(false);
                      if (socketRef.current) {
                        socketRef.current?.disconnect();
                        setTimeout(() => {
                          if (!socketRef.current?.connected) {
                          } else {
                            console.log("Socket still connected");
                          }
                        }, 500);
                      }
                    }}
                  >
                    <Ionicons
                      name="chevron-back-outline"
                      size={24}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                  <Text style={{ color: Colors.primary, fontSize: 18 }}>
                    {currentGroupId}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setChildModalVisible(true);
                    }}
                  >
                    <AntDesign
                      name="exclamationcircleo"
                      size={24}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={markedMessages}
                  style={[
                    {
                      maxHeight: height - headerHeight - bottom - 80,
                    },
                  ]}
                  renderItem={renderChatItem}
                  keyExtractor={(item) =>
                    item.timestamp
                      ? item.timestamp.toString()
                      : Math.random().toString()
                  }
                  inverted={true}
                  onEndReached={loadOlderMsj}
                  onEndReachedThreshold={0.2}
                  ListFooterComponent={loading ? <ActivityIndicator /> : null}
                  ref={flatListRef}
                  maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                  }}
                  initialNumToRender={20}
                  maxToRenderPerBatch={20}
                  windowSize={10}
                  removeClippedSubviews={true}
                />
                <KeyboardAvoidingView
                  behavior={Platform.OS == "ios" ? "padding" : "height"}
                  keyboardVerticalOffset={headerHeight / 2 + 10}
                >
                  <View style={[styles.inputContainer]}>
                    <TouchableOpacity>
                      <AntDesign
                        name="pluscircleo"
                        size={24}
                        color={Colors.grey}
                      />
                    </TouchableOpacity>
                    <View style={styles.input}>
                      <TextInput
                        placeholder={chatInitLang.enterMessage}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        maxLength={2000}
                        style={{ flex: 1 }}
                        placeholderTextColor={Colors.grey}
                        clearTextOnFocus={false}
                        multiline
                      />
                      <Entypo
                        name="emoji-happy"
                        size={24}
                        color={Colors.grey}
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.sendButton}
                      onPress={() => sendMessage(newMessage)}
                    >
                      <Ionicons name="send" size={24} color={Colors.light} />
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </SafeAreaView>
          </SafeAreaProvider>
        )}

        <Modal
          animationType="fade"
          transparent={true}
          visible={childModalVisible}
          style={{ zIndex: 2 }}
        >
          <SafeAreaProvider style={{ backgroundColor: "#fff" }}>
            <SafeAreaView>
              <View
                style={{
                  height: headerHeight / 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  borderBottomColor: "#ddd",
                  borderBottomWidth: 1,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setChildModalVisible(false);
                  }}
                >
                  <Ionicons
                    name="chevron-back-outline"
                    size={24}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
                <Text style={{ fontSize: 24, color: Colors.primary }}>
                  Group Chat Settings
                </Text>
              </View>
              <ChildModal />
            </SafeAreaView>
          </SafeAreaProvider>
        </Modal>
      </Modal>
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
    textShadowColor: Colors.primary, // Adds text shadow
    textShadowRadius: 2,
  },
  messageText: {
    padding: 10,
    maxWidth: "80%",
    minWidth: "30%",
    justifyContent: "center",
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
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    padding: 12,
    borderRadius: 25,
    marginLeft: 8,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: Colors.primary,
  },
  sendButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },

  msjContainer: {},
  msjInside: {
    flexDirection: "column",
    borderWidth: 1,
    padding: 5,
  },
});

export default ChatComponent;
