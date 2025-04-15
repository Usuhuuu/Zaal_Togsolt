import Colors from "@/constants/Colors";
import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChildModal from "./childModal";

interface Message {
  sender_unique_name: string;
  groupId: string;
  message: string;
  timestamp: Date;
  grouped?: boolean;
}
interface MainChatModalProps {
  readyToShow: boolean;
  setReadyToShow: React.Dispatch<React.SetStateAction<boolean>>;
  socketRef: React.RefObject<any>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isitReady: boolean;
  setChildModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  childModalVisible: boolean;
  currentGroupId: string;
  markedMessages: Message[];
  loadOlderMsj: () => void;
  loading: boolean;
  flatListRef: React.RefObject<FlatList>;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (message: string) => void;
  renderChatItem: ({ item }: { item: Message }) => JSX.Element;
  chatInitLang: {
    enterMessage: string;
  };
}

const MainChatModal: React.FC<MainChatModalProps> = ({
  readyToShow,
  setReadyToShow,
  socketRef,
  setMessages,
  isitReady,
  setChildModalVisible,
  childModalVisible,
  currentGroupId,
  markedMessages,
  loadOlderMsj,
  loading,
  flatListRef,
  newMessage,
  setNewMessage,
  sendMessage,
  renderChatItem,
  chatInitLang,
}) => {
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;
  const headerHeight = useHeaderHeight();
  const { bottom } = useSafeAreaInsets();

  return (
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
                    flex: 1,
                    maxHeight: height - headerHeight - bottom - 80,
                    backgroundColor: "#eeeeee",
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
                    <Entypo name="emoji-happy" size={24} color={Colors.grey} />
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
  );
};
export default MainChatModal;

const styles = StyleSheet.create({
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
