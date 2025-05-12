import React, { useCallback, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
  Modal,
} from "react-native";
import {
  ActiveUserType,
  GroupChat,
  newMsjPrepare,
  prepareMessages,
} from "@/app/(tabs)/chat";
import { Socket } from "socket.io-client";
import Colors from "@/constants/Colors";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";
import { format } from "date-fns";
import { connectSocket, getSocket } from "@/hooks/socketConnection";

interface Message {
  sender_unique_name: string;
  groupId: string;
  message: string;
  timestamp: Date;
  showDateSeparator?: boolean;
}

const DirectChatScreen: React.FC = ({}) => {
  const { item } = useLocalSearchParams();
  const [chatGroups, setChatGroups] = useState<GroupChat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [currentGroupId, setCurrentGroupId] = useState<string>("");
  const [mainModalShow, setmainModalShow] = useState<boolean>(true);
  const [userDatas, setUserDatas] = useState<any>([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isitReady, setIsitReady] = useState<boolean>(false);
  const [childModalVisible, setChildModalVisible] = useState<boolean>(false);
  const [activeUserData, setActiveUserData] = useState<ActiveUserType[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList | null>(null);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    if (!socketRef.current?.connected) return;

    const newMessage = {
      sender_unique_name: userDatas.unique_user_ID,
      groupId: currentGroupId,
      message: messageText,
      timestamp: new Date(),
    };

    const prevMsj = messages.length > 0 ? messages[0].timestamp : null;
    console.log("New message", newMessage);
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
    socketRef.current.emit("directChatSend", newMessage);
    flatListRef.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
  };
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

  const width = Dimensions.get("window").width;
  const [menuVisible, setMenuVisible] = React.useState(false);

  const initIndividualChat = async () => {
    if (!socketRef.current?.connected) {
      await connectSocket();
    }
    socketRef.current = getSocket();
    socketRef.current?.emit("directChatJoin", {
      initFriend: item,
    });
    socketRef.current?.emit(
      "directChatHistory",
      {
        timer: new Date(),
        initFriend: item,
      },
      (message: any) => {
        console.log(message);
        setIsitReady(true);
        if (message.nextCursor === null) {
          setLoading(false);
          setIsitReady(false);
          return;
        }
        const formatMessages = prepareMessages(message.messages);
        setMessages((prevMsj: Message[]) => {
          const merged = [...formatMessages, ...prevMsj];
          const seen = new Set();
          return merged.filter((item) => {
            if (seen.has(item.timestamp)) return false;
            seen.add(item.timestamp);
            return true;
          });
        });
        setCursor(message.nextCursor);
        setIsitReady(false);
      }
    );
    socketRef.current?.on("directMessageReceived", () => {});
  };
  useEffect(() => {
    initIndividualChat();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: Colors.white }}>
        <View
          style={{
            height: "100%",
            width: width,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomColor: Colors.lightGrey,
              borderBottomWidth: 1,
              maxWidth: "100%",
              marginHorizontal: 10,
              height: "10%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons
                name="arrow-back-sharp"
                size={24}
                color={Colors.primary}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></View>
            <TouchableOpacity
              onPress={() => {
                setChildModalVisible(true);
              }}
            >
              <Feather name="more-vertical" size={30} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.timestamp.toString()}
            inverted
            style={[
              {
                backgroundColor: Colors.lightGrey,
                paddingBottom: 40,
              },
            ]}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (!loading) {
                setLoading(true);
                loadOlderMsj();
              }
            }}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100 / 2 + 10}
          >
            <View style={[styles.inputContainer]}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setMenuVisible(!menuVisible);
                  }}
                  style={{
                    backgroundColor: Colors.lightGrey,
                    padding: 7,
                    borderRadius: 20,
                  }}
                >
                  <AntDesign name="plus" size={24} color={Colors.darkGrey} />
                </TouchableOpacity>
                {menuVisible && (
                  <View
                    style={{
                      position: "absolute",
                      backgroundColor: "white",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5,
                      top: -80,
                      flex: 1,
                      left: 0,
                      right: 0,
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 5,
                      width: 40,
                      gap: 10,
                      borderRadius: 10,
                    }}
                  >
                    <TouchableOpacity onPress={() => console.log("Option 1")}>
                      <Ionicons
                        name="camera"
                        size={24}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log("Option 2")}>
                      <Ionicons
                        name="camera"
                        size={24}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.input}>
                <TextInput
                  value={newMessage}
                  onChangeText={(newMsj) => setNewMessage(newMsj)}
                  maxLength={2000}
                  style={{ flex: 1 }}
                  placeholderTextColor={Colors.darkGrey}
                  clearTextOnFocus={false}
                  multiline
                />
              </View>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => sendMessage(newMessage)}
              >
                <Ionicons name="send" size={32} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
        <Modal
          animationType="fade"
          visible={childModalVisible}
          style={{ zIndex: 2 }}
        >
          <SafeAreaProvider style={{ backgroundColor: Colors.white }}>
            <SafeAreaView style={{ width: width, height: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  borderBottomColor: "#ddd",
                  borderBottomWidth: 1,
                  height: "10%",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setChildModalVisible(false);
                  }}
                >
                  <Ionicons
                    name="arrow-back-sharp"
                    size={24}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
                <Text style={{ fontSize: 24, color: Colors.primary }}>
                  Group Chat Settings
                </Text>
              </View>
            </SafeAreaView>
          </SafeAreaProvider>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    borderRadius: 20,
    padding: 7,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightGrey,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 10,
  },
  sendButton: {
    padding: 12,
    borderRadius: 25,
    marginLeft: 8,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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

export default DirectChatScreen;
