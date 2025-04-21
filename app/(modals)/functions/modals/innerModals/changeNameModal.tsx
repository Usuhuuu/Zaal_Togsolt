import Colors from "@/constants/Colors";
import React from "react";
import { View, Modal, Text } from "react-native";

interface ChangeNameModalProps {
  changeNameModalVisible: boolean;
  setChangeNameModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  groupName: string;
  setGroupName: React.Dispatch<React.SetStateAction<string>>;
}

const ChangeNameModal: React.FC<ChangeNameModalProps> = ({
  changeNameModalVisible,
  setChangeNameModalVisible,
  groupName,
  setGroupName,
}) => {
  return (
    <View style={{ backgroundColor: Colors.lightGrey, flex: 1 }}>
      <Text>Hello</Text>
    </View>
  );
};

export default ChangeNameModal;
