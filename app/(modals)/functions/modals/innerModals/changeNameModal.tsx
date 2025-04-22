import { GroupChat } from "@/app/(tabs)/chat";
import Colors from "@/constants/Colors";
import React, { useEffect } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ChangeNameModalProps {
  changeNameModalVisible: boolean;
  setChangeNameModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  groupName: string;
  setGroupName: React.Dispatch<React.SetStateAction<string>>;
  MemberData: GroupChat[];
}

const ChangeNameModal: React.FC<ChangeNameModalProps> = ({
  changeNameModalVisible,
  setChangeNameModalVisible,
  groupName,
  setGroupName,
  MemberData,
}) => {
  const [chatName, setChatName] = React.useState<string>("");

  useEffect(() => {
    if (MemberData?.length > 0) {
      const generatedName = `${MemberData[0]?.sportHallName ?? ""} ${
        MemberData[0]?.date ?? ""
      } ${MemberData[0]?.startTime ?? ""} - ${MemberData[0]?.endTime ?? ""}`;
      setChatName(groupName || generatedName);
    }
  }, [MemberData, groupName]);

  const handleSave = () => {
    setGroupName(chatName);
    setChangeNameModalVisible(false);
  };
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: Colors.lightGrey,
        flex: 1,
        height: "100%",
        marginBottom: bottom,
        justifyContent: "center",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ marginHorizontal: 20, gap: 10 }}>
          <Text
            style={{ alignSelf: "center", fontSize: 24, fontWeight: "500" }}
          >
            Edit Group Chat Name
          </Text>
          <View>
            <TextInput
              value={chatName}
              onChangeText={(e) => setChatName(e)}
              multiline
              style={{
                backgroundColor: Colors.white,
              }}
              theme={{
                colors: {
                  primary: Colors.white,
                },
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "grey" }}>
              This name will be visible to all members.
            </Text>
            <Text style={{ color: "grey" }}>{chatName.length}/100</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: Colors.white,
              padding: 10,
              justifyContent: "space-between",
              borderRadius: 10,
              marginVertical: 20,
            }}
          >
            <TouchableOpacity
              style={[
                styles.buttons,
                {
                  borderWidth: 1,
                  borderColor: Colors.grey,
                  padding: 10,
                  width: "48%",
                  alignItems: "center",
                },
              ]}
            >
              <Text style={{ fontSize: 20, fontWeight: "400" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buttons,
                {
                  padding: 10,
                  backgroundColor: Colors.primary,
                  width: "48%",
                  alignItems: "center",
                },
              ]}
              onPress={handleSave}
            >
              <Text
                style={{ color: Colors.white, fontSize: 20, fontWeight: "500" }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {},
});

export default ChangeNameModal;
