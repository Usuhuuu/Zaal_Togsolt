import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import Animated, { interpolate, SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, Extrapolate } from "react-native-reanimated";
import { it } from "node:test";






interface ProfileHeaderProps {
  copyToClipboard: () => void;
  profileImageUri: string;
  firstName: string;
  unique_user_ID: string;
}

const { width } = Dimensions.get("window");

const _itemSize = width / 3.5;
const _spacing = 12;
const _itemTotalSize = _itemSize + _spacing;


// Dummy menu items
const menu = [
  { name: "Settings",
  icon: require("@/assets/tab-icons/athlete.png") },

  { name: "Achievements"
  ,  icon: require("@/assets/tab-icons/athlete.png")
   },
  { name: "Rewards"
  ,  icon: require("@/assets/tab-icons/athlete.png")
   },
   
];

function CarouselItem({ item, index, scrollX }: { item: any; index: number; scrollX: SharedValue<number> }) {
  const animatedStyle = useAnimatedStyle(() => {

    const inputRange = [index - 1, index, index + 1];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );

    const rotateY = interpolate(
      scrollX.value,
      inputRange,
      [30, 0, -30], // degrees
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [20, 0, 20],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { perspective: 1000 },
        { scale },
        { rotateY: `${rotateY}deg` },
        { translateY },
      ],
    };
  });
  
 return (
    <Animated.View style={[styles.menuItem, animatedStyle]}>
      <Image source={item.icon} style={{ width: 50, height: 50 }} />
      <Text style={styles.titleText}>{item.name}</Text>
    </Animated.View>
  );
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  copyToClipboard,
  firstName,
  unique_user_ID,
  profileImageUri,
}) => {

  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(e => {
    console.log(scrollX.value);
    scrollX.value = e.contentOffset.x / _itemTotalSize;


  })

  return (
    <ScrollView>
      {/* Profile Header */}
      <View style={styles.profileContainer}>
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
            <TouchableOpacity
              onPress={() => router.push("/(modals)/SavedHalls")}
              style={styles.friend}
            >
              <FontAwesome5 name="share-alt" size={20} color={Colors.dark} />
            </TouchableOpacity>
            <TouchableOpacity onPress={copyToClipboard} style={styles.friend}>
              <Ionicons name="copy-outline" size={20} color={Colors.dark} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Menu Section */}
      <View style={styles.menuContainer}>

        
        <Animated.FlatList
        data = {menu}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <CarouselItem item={item} index={index} scrollX={scrollX} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}

        onScroll ={onScroll}
        scrollEventThrottle={1000/60}
        snapToInterval={_itemSize + _spacing}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: width / 2 - _itemSize / 2,
         
         
          height: 200,
          gap: _spacing,
        }}
        style={{
          flexGrow: 0,
          paddingVertical: 20,
          borderRadius: 20,
        }}
        
          
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: width / 1.2,
    backgroundColor: "transparent",
    height: width / 2.5,
    marginTop: -width / 3,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    backgroundColor: Colors.light,
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
  profileImageContainer: {
    width: width,
    height: width,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 110,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
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
    flexWrap: "wrap",
    gap: 10,
  },
  menuContainer: {
    flexDirection: "row",
    alignItems: "center",
   
    marginTop: 40,
    height: 200,
  },
  menuItem: {
   flex: 1,
   flexDirection:"column",
    padding: 10,
    width: _itemSize+10,
    height: _itemSize+10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    
    backgroundColor: Colors.light,
    borderWidth: 1,
   
   
   
  },  
  categoriesBtn: {
    backgroundColor: Colors.light,
   
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginHorizontal: 5,
    flexDirection: "row",
  },
  categoriesBtnActive: {
    padding: 10,
    backgroundColor: Colors.light,
    borderRadius: 70,
   
  },
  titleText: {
    color: Colors.dark,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileHeader;
