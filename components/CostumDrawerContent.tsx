import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTranslation } from "react-i18next";
import { Ionicons, Fontisto, AntDesign } from "@expo/vector-icons";
import { useAuth } from "@/app/(modals)/context/authContext";
import { auth_swr } from "@/app/(modals)/functions/useswr";

const CustomDrawerContent = (props: any) => {
  interface UserData {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    unique_user_ID: string;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const { LoginStatus, logIn, logOut } = useAuth();

  const router = useRouter();

  const { data, error, isLoading } = auth_swr({
    item: {
      pathname: "main",
      cacheKey: "RoleAndProfile_main",
      loginStatus: LoginStatus,
    },
  });

  const width = Dimensions.get("window").width;

  useEffect(() => {
    if (data) {
      const parsedData =
        typeof data.profileData == "string"
          ? JSON.parse(data.profileData)
          : data.profileData;
      setUserData(Array.isArray(parsedData) ? parsedData[0] : parsedData);
      logIn();
    } else if (error) {
      //logOut();
      console.log("Error fetching user data: Pisda", error);
    }
  }, [data, error]);

  useEffect(() => {
    //console.log("LoginStatus changed:", LoginStatus);
  }, [LoginStatus]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light, maxWidth: "100%" }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.container}
      >
        {!LoginStatus ? (
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerTouchable}>
              <Image
                source={{
                  uri: "https://via.placeholder.com/150",
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerTouchable}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.headerText}>{t("aboutUs.login")}</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>&</Text>
            <TouchableOpacity style={styles.headerTouchable}>
              <Text style={styles.headerText}>{t("aboutUs.register")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerTouchable}>
              <Image
                source={{ uri: "https://via.placeholder.com/150" }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <View style={{ width: width / 2.2 }}>
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {userData?.unique_user_ID}
              </Text>
              <Text style={styles.userDataContainer}>{userData?.email}</Text>
            </View>
          </View>
        )}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View>
        <View style={styles.log}>
          <View style={styles.logInside}>
            <TouchableOpacity style={styles.logInsideTouchable}>
              <Ionicons name="people" size={24} color="#78909C" />
              <Text style={styles.logText}>{t("aboutUs.aboutUs")}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logInside}>
            <TouchableOpacity style={styles.logInsideTouchable}>
              <Ionicons name="help" size={24} color="#78909C" />
              <Text style={styles.logText}>{t("aboutUs.helps")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logInside}>
            <TouchableOpacity style={styles.logInsideTouchable}>
              <AntDesign name="customerservice" size={24} color="#78909C" />
              <Text style={styles.logText}>{t("aboutUs.contactUs")}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            padding: 20,
            backgroundColor: "#ECEFF1",
            flexDirection: "row",
            justifyContent: "center",
            gap: 30,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="facebook-official" size={27} color="#78909C" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="instagram" size={27} color="#78909C" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Fontisto name="email" size={27} color="#78909C" />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          styles.footer,
          { paddingBottom: 20 + bottom, backgroundColor: "#ECEFF1" },
        ]}
      >
        <FontAwesome name="copyright" size={24} color="black" />
        <Text style={styles.rightsText}>All rights reserved</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors.light,
    maxWidth: "100%",
  },

  headerTouchable: {
    padding: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "400",
    color: Colors.primary,
    fontFamily: "cursive",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  userDataContainer: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#9acffd",
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
    justifyContent: "center",
    backgroundColor: "#ECEFF1",
  },
  logInside: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  logInsideTouchable: {
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  logText: {
    paddingHorizontal: 20,
    color: "#78909C",
  },
  footerButton: {
    marginVertical: 10,
    borderRadius: 8,
  },
  drawerItemLabel: {
    fontWeight: "bold",
    color: "#78909C",
  },
  drawerItemLabel1: {
    fontWeight: "bold",
    color: Colors.primary,
  },
  rightsText: {
    fontSize: 14,
    color: "#888",
    marginLeft: 5,
  },
});

export default CustomDrawerContent;
