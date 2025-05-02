import Colors from "@/constants/Colors";
import { AntDesign, Ionicons, Entypo, Feather } from "@expo/vector-icons";
import React, { useEffect } from "react";
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
import ChildModal from "./childModal";
import { ActiveUserType, GroupChat } from "@/app/(tabs)/chat";
import { Avatar } from "react-native-paper";

interface Message {
  sender_unique_name: string;
  groupId: string;
  message: string;
  timestamp: Date;
  grouped?: boolean;
}
interface MainChatModalProps {
  mainModalShow: boolean;
  setmainModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  isitReady: boolean;
  setChildModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  childModalVisible: boolean;
  message: Message[];
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
  memberData: GroupChat[];
  activeUserData: ActiveUserType[];
}

const MainChatModal: React.FC<MainChatModalProps> = ({
  mainModalShow,
  setmainModalShow,
  isitReady,
  setChildModalVisible,
  childModalVisible,
  message,
  loadOlderMsj,
  loading,
  flatListRef,
  newMessage,
  setNewMessage,
  sendMessage,
  renderChatItem,
  chatInitLang,
  memberData,
  activeUserData,
}) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [activeUserMember, setActiveUserMember] = React.useState<number>(0);
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;
  const headerHeight = useHeaderHeight();
  useEffect(() => {
    console.log("activeUserData", activeUserData);
    setActiveUserMember(activeUserData.length);
  }, [activeUserData]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={mainModalShow}
      style={{ zIndex: 1 }}
      onRequestClose={() => {
        setmainModalShow(false);
      }}
    >
      {isitReady ? (
        <ActivityIndicator color={Colors.primary} size={"large"} />
      ) : (
        <SafeAreaProvider
          style={{
            backgroundColor: Colors.light,
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
                height: height,
              }}
            >
              <View
                style={{
                  height: headerHeight,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottomColor: Colors.lightGrey,
                  borderBottomWidth: 1,
                  maxWidth: "100%",
                  marginHorizontal: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setmainModalShow(false);
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
                >
                  {memberData?.[0]?.chat_image && (
                    <Avatar.Image
                      source={{ uri: memberData[0].chat_image }}
                      style={{
                        backgroundColor: Colors.light,
                      }}
                    />
                  )}
                  {memberData[0] ? (
                    memberData[0].sportHallName &&
                    memberData[0].date &&
                    memberData[0].startTime &&
                    memberData[0].endTime ? (
                      <View style={{ width: "70%" }}>
                        <Text style={{ color: Colors.primary, fontSize: 18 }}>
                          {memberData[0].sportHallName}
                        </Text>
                        <Text style={{ color: Colors.secondary, fontSize: 14 }}>
                          {memberData[0].date} {memberData[0].startTime} –{" "}
                          {memberData[0].endTime}
                        </Text>
                      </View>
                    ) : (
                      <View style={{ width: "70%", marginLeft: 8 }}>
                        <Text
                          style={{
                            fontSize: 17,
                            flexWrap: "wrap",
                            writingDirection: "ltr",
                            fontWeight: "700",
                            color: Colors.primary,
                          }}
                        >
                          {memberData[0].group_chat_name ?? ""}
                        </Text>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                          <Text style={{ color: "green" }}>
                            online:
                            {activeUserMember}
                          </Text>
                          <Text style={{ color: Colors.darkGrey }}>
                            members: {memberData[0].members.length}
                          </Text>
                        </View>
                      </View>
                    )
                  ) : (
                    <ActivityIndicator size={24} color={Colors.primary} />
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setChildModalVisible(true);
                  }}
                >
                  <Feather
                    name="more-vertical"
                    size={30}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={message}
                style={[
                  {
                    backgroundColor: Colors.lightGrey,
                  },
                ]}
                renderItem={renderChatItem}
                keyExtractor={(item) => item.timestamp.toString()}
                inverted={true}
                onEndReached={loadOlderMsj}
                onEndReachedThreshold={0.2}
                ListFooterComponent={loading ? <ActivityIndicator /> : null}
                ref={flatListRef}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={10}
                removeClippedSubviews={true}
              />
              <KeyboardAvoidingView
               behavior={Platform.OS === 'ios' ? 'padding' : undefined}
               keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight / 2 + 20: 0}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: Colors.light,
                  paddingBottom: 10,
                }}
              
                enabled={true}
              >
                <View style={[styles.inputContainer]}>
                 
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
                      <AntDesign
                        name="pluscircleo"
                        size={24}
                        color={Colors.primary}
                      />
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
                        <TouchableOpacity
                          onPress={() => console.log("Option 1")}
                        >
                          <Ionicons
                            name="camera"
                            size={24}
                            color={Colors.primary}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => console.log("Option 2")}
                        >
                          <AntDesign
                            name="addfile"
                            size={24}
                            color={Colors.primary}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                 

                  <View style={styles.input}>
                    <TextInput
                      placeholder={chatInitLang.enterMessage}
                      value={newMessage}
                      onChangeText={(newMsj) => setNewMessage(newMsj)}
                      maxLength={2000}
                      style={{ flex:1}}
                      placeholderTextColor={Colors.darkGrey}
                      clearTextOnFocus={false}
                      multiline
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={() => sendMessage(newMessage)}
                  >
                    <Entypo name="paper-plane" size={24} color={Colors.light} />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      )}

      <Modal
        animationType="fade"
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
                  name="arrow-back-sharp"
                  size={24}
                  color={Colors.primary}
                />
              </TouchableOpacity>
              <Text style={{ fontSize: 24, color: Colors.primary }}>
                Group Chat Settings
              </Text>
            </View>
            <ChildModal MemberData={memberData} />
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
    paddingVertical: 10,
    gap: 10,
  },
  sendButton: {
    padding: 10,
    borderRadius: 25,
    marginLeft: 8,
    backgroundColor: Colors.primary,
    elevation: 5,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  msjContainer: {},
  msjInside: {
    flexDirection: "column",
    borderWidth: 1,
    padding: 5,
  },
});
