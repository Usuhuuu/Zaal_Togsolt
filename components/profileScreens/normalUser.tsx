import { router, Href } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileData from "@/components/profileData";
import Ionicons from "@expo/vector-icons/Ionicons";
import Team from "@/components/clans";
import Colors from "@/constants/Colors";
import SavedHalls from "@/app/(modals)/SavedHalls";

interface ProfileNormalUserProps {
  copyToClipboard: () => void;
  formData: [
    {
      firstName: string;
      unique_user_ID: string;
    }
  ];
}
const NormalUser: React.FC<ProfileNormalUserProps> = ({
  copyToClipboard,
  formData,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleBackPress = () => {
    console.log("Back button pressed");
  };

  const handleSharePress = () => {
    console.log("Share button pressed");
  };

  const openModal = () => {
    setModalVisible(true); // Open the modal
  };

  const closeModal = () => {
    setModalVisible(false); // Close the modal
  };

  return (
    <>
      <LinearGradient
        colors={[Colors.primary, "#ffffff"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.titleBar}>
          <TouchableOpacity onPress={handleBackPress} style={{ backgroundColor: Colors.primary , borderRadius: 20, padding: 5}}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSharePress} style={{ backgroundColor: Colors.primary , borderRadius: 20, padding: 5}}>
            <Ionicons name="share-social" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              router.push(
                "/settings/profileSettings" as Href<"/settings/profileSettings">
              )
            }
            style={{ backgroundColor: Colors.primary , borderRadius: 20, padding: 5}}
          >
            <Ionicons name="settings" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ProfileHeader
          copyToClipboard={copyToClipboard}
          profileImageUri="https://example.com/profile.jpg"
          firstName={formData[0]?.firstName}
          unique_user_ID={formData[0].unique_user_ID}
        />
        
        

        {/* Button to open modal */}
        <View style={styles.saved}>
          <TouchableOpacity style={styles.savedBackground} onPress={openModal}>
            <ImageBackground
              source={require("@/assets/images/zurag1.jpg")} // Replace with your image path
              resizeMode="cover"
              borderRadius={20} // Rounded corners
              style={styles.savedBackground}
            >
              <Text style={styles.savedText}>Saved Records</Text>
              <ImageBackground
                source={require("@/assets/images/saved.png")} // Replace with your image path
                style={styles.savedicon}
              />
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SavedHalls />
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    zIndex: -10, // Ensure the background is behind other components",
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50, // Adjust for safe area / image space
    marginHorizontal: 15,
    backgroundColor: "transparent", // ✅ make background transparent
    position: "absolute", // ✅ position it on top of the content
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // ✅ ensure it's above the profile image
    
  },
  saved: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    margin: 10,
    height: 200, // Fixed height, adjust as needed
    borderRadius: 20,
    position: "relative", // Ensures that children are positioned correctly
    elevation: 4,
  },
  savedText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
    zIndex: 1,
    position: "absolute", // Ensures that the text is positioned correctly
    bottom: 10, // Adjust as needed
    left: 15, // Adjust as needed
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background overlay
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  savedBackground: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "80%",
    flex: 1, // Ensures the background image fills the parent container
    borderRadius: 20,
    backgroundColor: "#e5f0ff", // Dark background overlay
  },
  savedicon: {
    zIndex: 1,
    position: "relative", // Ensures that the icon is positioned correctly
    justifyContent: "center", // Adjust as needed
    alignItems: "center", // Adjust as needed
    width: 80,
    height: 80,
  },
  adminText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  contractorText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});

export default NormalUser;
