import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '@/constants/Colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface ProfileHeaderProps {
  userId: string;
  copyToClipboard: () => void;
  profileImageUri: string; 
}


const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userId, copyToClipboard }) => {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.nameContainer}>
        <Text style={{ color: "#fff" }}>Sainuu</Text>
        <Text style={styles.profileName}>DASHNYAM</Text>
        <View style={styles.userIdContainer}>
          <Text style={{ color: Colors.dark }}> ID: {userId} </Text>
          <TouchableOpacity onPress={copyToClipboard}>
            <Ionicons name="copy" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        <Image
          source={require('@/assets/images/profileIcons/profile.png')} 
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.useredit}>
        <FontAwesome5 name="user-edit" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row', // Align text and image horizontally
    alignItems: 'center', // Center the content vertically
    marginTop: 20,
    paddingHorizontal: 20,
  },
  nameContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
    marginBottom: 10,
    height: 100,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
  }
});

export default ProfileHeader;
