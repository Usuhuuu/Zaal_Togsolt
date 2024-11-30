import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface ProfileHeaderProps {
  copyToClipboard: () => void;
  profileImageUri: string;
  firstName: string;
  unique_user_ID: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  copyToClipboard,
  firstName,
  unique_user_ID,
  profileImageUri,
}) => {
  console.log(
    "ProfileHeader Props: ",
    firstName,
    unique_user_ID,
    profileImageUri
  );
  return (
    <View>
      {/* Profile Header */}
      <View style={styles.profileContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.profileName}>{firstName}</Text>
          <View style={styles.userIdContainer}>
            <Text style={{ color: Colors.dark }}> ID: {unique_user_ID} </Text>
            <TouchableOpacity onPress={copyToClipboard}>
              <Ionicons name="copy" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.friend}>
            <Image
              source={require("@/assets/tab-icons/teamwork.png")}
              style={{ width: 20, height: 20 }}
            />
            <Text style={styles.socialCount}> Naiz</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={require("@/assets/images/profileIcons/profile.png")}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.useredit}>
            <FontAwesome5 name="user-edit" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Friends and Followers Section */}
      <View style={styles.socialContainer}>
        <View style={styles.socialItem}>
          <Text style={styles.socialCount}>150</Text>
          <Text style={styles.socialLabel}>Naiz</Text>
        </View>
        <View style={styles.socialItem}>
          <Text style={styles.socialCount}>250</Text>
          <Text style={styles.socialLabel}>Teams</Text>
        </View>
        <View style={styles.socialItem}>
          <Text style={styles.socialCount}>180</Text>
          <Text style={styles.socialLabel}>toglolt</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row", // Align text and image horizontally
    alignItems: "center", // Center the content vertically
    marginTop: 20,
    paddingHorizontal: 20,
  },
  nameContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
    marginBottom: 10,
    height: 100,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  friend: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  userIdContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    marginLeft: 20, // Space between the text and the profile picture
  },
  profileImage: {
    width: 150, // Set the size of the profile image
    height: 150,
    borderRadius: 25, // Make the image round
  },
  useredit: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  socialItem: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  socialCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light,
  },
  socialLabel: {
    fontSize: 16,
    color: Colors.dark,
  },
});

export default ProfileHeader;
