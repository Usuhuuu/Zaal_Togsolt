import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { Dimensions } from "react-native";

interface ProfileHeaderProps {
  copyToClipboard: () => void;
  profileImageUri: string;
  firstName: string;
  unique_user_ID: string;
}
const { width } = Dimensions.get("window");

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  copyToClipboard,
  firstName,
  unique_user_ID,
  profileImageUri,
}) => {
  return (
    <ScrollView>
      {/* Profile Header */}
      <View style={styles.profileContainer}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={require("@/assets/images/profileIcons/profile.jpg")}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.infoContainer}>
        <Text style={styles.profileName}>ojhn silvia</Text>        
        <View style={styles.user}>
          <TouchableOpacity style={styles.friend}>
            <Text style={{ color: Colors.dark }}>Friend</Text>
          </TouchableOpacity>
          <View style={styles.friend}>
            <Text style={{ color: Colors.dark }}>@</Text>
            <Text style={{ color: Colors.dark }}>{unique_user_ID}</Text>

            </View> 
            <TouchableOpacity onPress={() => router.push("/(modals)/SavedHalls")} style={styles.friend}>
              <FontAwesome5 name="share-alt" size={20} color={Colors.dark} />
            </TouchableOpacity>

          <TouchableOpacity onPress={copyToClipboard} style={styles.friend}>
              <Ionicons name="copy-outline" size={20} color={Colors.dark} />
            </TouchableOpacity>

        </View>
        </View>
         
           
       
      </View>

      {/* Friends and Followers Section */}
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "column", // Align text and image horizontally
    alignItems: "center", // Center the content vertically
    
   // Space between the header and the content
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: width/1.2,
    backgroundColor: "transparent",
    height: width/2.5, 
    
    
   
    marginTop: -width/3,
     // Move it up to overlap with the image
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    backgroundColor:Colors.light,
    padding: 10,
    borderRadius: 10,
  },
  friend: {
    padding: 20,
    backgroundColor: Colors.light,
    borderRadius: 15,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderWidth: 1,
    borderColor: Colors.primary,
   
  },
  userIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  profileImageContainer: {
    width: width,  // 30% of screen width
    height: width , // same as width for a square
    
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 110,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
     // Space between the text and the profile picture
  
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    
    width: "100%",
    marginTop: 20,

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
