import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
  fetchRoleAndProfil,
  normalFetch,
} from "../(modals)/functions/UserProfile";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { auth_Refresh_Function } from "../(modals)/functions/refresh";
import axiosInstance from "../(modals)/functions/axiosInstanc";
import axios from "axios";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

interface Message {
  sender_unique_name: string;
  groupId: string;
  message: string;
  timestamp: Date;
}

interface ChatGroup {
  groupId: string;
}

const reverseArray = (data: Message[]) => {
  let first = 0;
  let last = data.length - 1;
  while (first < last) {
    let temp = data[first];
    data[first] = data[last];
    data[last] = temp;
    first++;
    last--;
  }
  return data;
};

const ChatComponent: React.FC = () => {
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [currentGroupId, setCurrentGroupId] = useState<string>("");
  const [readyToShow, setReadyToShow] = useState<boolean>(false);
  const [userDatas, setUserDatas] = useState<any>([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const {
    data: chatData,
    error: chatError,
    isLoading,
  } = useSWR("group_chat", {
    fetcher: () => normalFetch("/auth/chatcheck"),
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
  });
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useSWR("RoleAndProfile_main", {
    fetcher: () => fetchRoleAndProfil("main"),
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 10000,
    errorRetryInterval: 4000,
    errorRetryCount: 3,
  });

  useEffect(() => {
    if (chatData) {
      setChatGroups(chatData.chatGroupIDs.map((groupId: any) => ({ groupId })));
    } else if (chatError) {
      console.error("Error fetching chat groups:", chatError);
      Sentry.captureException(chatError);
    }
  }, [chatData, chatError]);

  useEffect(() => {
    if (userData) {
      const parsedData =
        typeof userData.profileData == "string"
          ? JSON.parse(userData.profileData)
          : userData.profileData;
      setUserDatas(Array.isArray(parsedData) ? parsedData[0] : parsedData);
    } else if (userError) {
      Sentry.captureException(userError);
    }
  }, [userData, userError]);

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
          secure: true,
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
            setLoading(true);
            if (message.nextCursor == null) {
              setLoading(false);
              return;
            }
            const reversedMsj = reverseArray(message.messages);
            setMessages((prevMsj) => [...reversedMsj, ...prevMsj]);
            setCursor(message.nextCursor);
            setLoading(false);
          });

          socketRef.current?.on("receiveMessage", (data: Message) => {
            setMessages((prevMessages) => [...prevMessages, data]);
          });

          socketRef.current?.on("reconnect", (attempt) => {
            console.log(`Reconnected successfully after ${attempt} attempts`);
          });
        });

        // 🔹 Handle token expiration & reconnection
        socketRef.current.on("connect_error", async (error) => {
          socketRef.current?.off("chatHistory");
          try {
            const res = await axios.post(
              `${apiUrl}/auth/refresh`,
              {},
              { headers: { Authorization: `Bearer ${refreshToken}` } }
            );
            if (res.status == 200 && res.data.success) {
              SecureStore.setItemAsync(
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
              }
            } else if (res.status == 400) {
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
    console.log("newMessage", newMessage);
    socketRef.current.emit("sendMessage", newMessage);
  };
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;
  const headerHeight = useHeaderHeight();
  const { bottom } = useSafeAreaInsets();

  const renderChatItem = useCallback(
    ({ item }: { item: Message }) => {
      return (
        <View style={{ marginVertical: 6 }}>
          {item.sender_unique_name === userDatas.unique_user_ID ? (
            <View style={{ alignItems: "flex-end", marginVertical: 3 }}>
              <Text
                style={[
                  styles.messageText,
                  {
                    shadowOffset: { width: -3, height: -3 },
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    borderWidth: 3,
                  },
                ]}
              >
                {item.message}
              </Text>
            </View>
          ) : (
            <View style={{ alignItems: "flex-start" }}>
              <Text
                style={[
                  styles.messageText,
                  {
                    backgroundColor: Colors.primary,
                    color: Colors.light,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: Colors.primary,
                  },
                ]}
              >
                {item.message}
              </Text>
            </View>
          )}
        </View>
      );
    },
    [messages]
  );
  const loadOlderMsj = async () => {
    if (!cursor || !socketRef.current || loading) return;

    if (loadedOnce) {
      return;
    }
    setLoading(true);

    socketRef.current?.emit("chatHistory", { timer: cursor });

    socketRef.current?.on("chatHistory", (message, nextCursor) => {
      if (
        !message.messages ||
        message.messages.length === 0 ||
        message.nextCursor == null
      ) {
        setLoading(false);
        setLoadedOnce(true);
        return;
      }

      const reversedMsj = reverseArray(message.messages);
      setMessages((prevMessages) => [...reversedMsj, ...prevMessages]);
      setCursor(nextCursor);
      setLoading(false);
    });
  };

  return (
    <View style={[styles.container]}>
      {isLoading ? (
        <View>
          <ActivityIndicator size={"large"} />
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
        </View>
      )}
      {chatData ? (
        <>
          <Modal
            animationType="fade"
            transparent={true}
            visible={readyToShow}
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
                      <Ionicons name="chevron-back-outline" size={24} />
                    </TouchableOpacity>
                    <Text>{currentGroupId}</Text>
                    <TouchableOpacity>
                      <AntDesign
                        name="exclamationcircleo"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={messages}
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
                    //maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
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
                          placeholder="Enter Chat"
                          value={newMessage}
                          onChangeText={setNewMessage}
                          maxLength={2000}
                          placeholderTextColor={Colors.grey}
                          style={{ flex: 1 }}
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
          </Modal>
        </>
      ) : (
        <ActivityIndicator size={"large"} />
      )}
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
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  messageText: {
    borderWidth: 3,
    padding: 10,
    maxWidth: "80%",
    borderColor: Colors.lightGrey,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sendButton: {
    padding: 12,
    borderRadius: 25,
    marginLeft: 8,
    shadowOffset: { width: 0, height: 1 },
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
});

export default ChatComponent;
