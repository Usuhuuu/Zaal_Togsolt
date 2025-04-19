import Colors from "@/constants/Colors";
import React from "react";
import { View, Modal, StyleSheet, Text } from "react-native";

interface MemberModalProps {
  memberModalVisible: boolean;
  setMemberModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  memberData: any[];
}
interface GroupMember {
  group_ID: string;
  group_chat_name: string;
  members: string;
  chat_image: string;
}

const MemberModal: React.FC<MemberModalProps> = ({
  memberModalVisible,
  setMemberModalVisible,
  memberData,
}) => {
  return (
    <View>
      <View style={[styles.modalBody, {}]}>
        {memberData.map((item: GroupMember, index: number) => (
          <Text key={index} style={{ padding: 10, color: Colors.primary }}>
            {item.members}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    backgroundColor: Colors.light,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  modalBody: {
    paddingTop: 20,
    flex: 1,
  },
});
export default MemberModal;
