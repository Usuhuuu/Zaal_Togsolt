import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ChildModal = () => {
  console.log("ChildModal");
  const [settingsModalVisible, setSettingsModalVisible] =
    useState<boolean>(false);
  const [memberModalVisible, setMemberModalVisible] = useState<boolean>(false);
  const childModalNested = [
    {
      id: "1",
      title: "Settings",
      icon: "settings",
      onPress: () => setSettingsModalVisible(true),
    },
    {
      id: "2",
      title: "Members",
      icon: "people",
      onPress: () => setMemberModalVisible(true),
    },
  ];

  const height = Dimensions.get("window").height;
  const headerHeight = useHeaderHeight();
  const { bottom } = useSafeAreaInsets();
  return (
    <View>
      <View>
        <FlatList
          data={childModalNested}
          style={{
            maxHeight: "95%",
            maxWidth: "95%",
            marginHorizontal: 20,
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={item.onPress} style={{ padding: 20 }}>
              <Text style={{ fontSize: 20 }}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Settings Modal */}
      <Modal
        visible={settingsModalVisible}
        transparent={true}
        animationType="fade"
        style={{ zIndex: 3 }}
      >
        <SafeAreaProvider>
          <SafeAreaView
            style={{
              height: height - bottom,
              backgroundColor: Colors.light,
            }}
          >
            <View style={{ height: headerHeight }}>
              <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>

      {/* Members Modal */}
      <Modal visible={memberModalVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
          >
            <Text>Members Modal</Text>
            <TouchableOpacity onPress={() => setMemberModalVisible(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChildModal;
