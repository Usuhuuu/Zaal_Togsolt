import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from "react-native";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const CustomDrawerContent = (props: any) => {
    const {top, bottom} = useSafeAreaInsets();
    const router = useRouter();
    const handleLoginPress = () => {
        router.replace("/"); // Navigate to the login page
      };
  return (
    <View style={{flex:1}}>
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/profileIcons/profile.png")} // Replace with your profile image
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Ner</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.log}>
        <DrawerItem label={'Burtguuleh'} onPress={handleLoginPress}
         labelStyle={styles.drawerItemLabel1} // Style the label text
         style={styles.footerButton} // Style the overall item container
        />
        <DrawerItem label={'Garah'} onPress={handleLoginPress}
         labelStyle={styles.drawerItemLabel} // Style the label text
         style={styles.footerButton} // Style the overall item container
        />
            
        </View>
      </DrawerContentScrollView>

        <View style={[styles.footer, { paddingBottom: 20 + bottom }]}>
            <FontAwesome name="copyright" size={24} color="black" />
            <Text  style={styles.rightsText}>All rights reserved</Text>
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    paddingBottom: 20,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.primary,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  log: {
    justifyContent: 'center', // Vertically center the DrawerItem
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  footerButton: {
    marginVertical: 10, // Add spacing around the item
    borderRadius: 8, // Optional: rounded corners
  },
  drawerItemLabel: {
    fontWeight: 'bold', // Style the text
    color: 'red', // Change the text color
  },
  drawerItemLabel1: {
    fontWeight: 'bold', // Style the text
    color: Colors.primary, // Change the text color
  },
  rightsText: {
    fontSize: 14,  // Font size for the text
    color: '#888',  // Text color
    marginLeft: 5,  // Space between the icon and the text
  },

});

export default CustomDrawerContent;
