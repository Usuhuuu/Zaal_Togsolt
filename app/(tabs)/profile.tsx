import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { fetchRoleAndProfile } from "@/app/(modals)/functions/profile_data_fetch";
import Colors from "@/constants/Colors";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";

// Import SavedHalls component
import useSWR, { mutate } from "swr";
import ContractorPage from "@/components/profileScreens/contractor";
import ProfileAdmin from "@/components/profileScreens/admin";
import NormalUser from "@/components/profileScreens/normalUser";
import { useAuth } from "../(modals)/context/authContext";
import Page from "../(modals)/login";

const Profile: React.FC = () => {
  const [formData, setFormData] = useState<any>({});
  const [path, setPath] = useState<string>("main");
  const [loading, setLoading] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const { LoginStatus } = useAuth();

  const { data, error, isLoading } = useSWR(
    LoginStatus ? [`RoleAndProfile_${path}`, LoginStatus] : null,
    {
      fetcher: () => fetchRoleAndProfile(path, LoginStatus),
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      refreshWhenHidden: false,
      dedupingInterval: 10000,
      errorRetryInterval: 4000,
      errorRetryCount: 3,
    }
  );

  useEffect(() => {
    if (data) {
      setFormData(data.profileData);
      setUserRole(data.role);
    } else if (error) {
      console.log("Error fetching role and profile data:", error);
    }
    // Set loading state based on isLoading
    setLoading(isLoading);
  }, [data, error, isLoading]);

  useEffect(() => {
    if (LoginStatus && path) {
      mutate(`RoleAndProfile_${path}`);
    }
  }, [formData, path]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(formData);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {!LoginStatus ? (
        <Page />
      ) : (
        <>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <>
              {userRole === "admin" && (
                <ProfileAdmin
                  copyToClipboard={copyToClipboard}
                  formData={formData}
                />
              )}

              {userRole === "contractor" && (
                <ContractorPage
                  copyToClipboard={copyToClipboard}
                  formData={formData}
                />
              )}

              {userRole === "user" && (
                <NormalUser
                  copyToClipboard={copyToClipboard}
                  formData={formData}
                />
              )}
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 15,
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

export default Profile;
