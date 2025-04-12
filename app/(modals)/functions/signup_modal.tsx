import Colors from "@/constants/Colors";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  Animated,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "../context/authContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { axiosInstanceRegular } from "./axiosInstance";
import * as SecureStore from "expo-secure-store";

type LoginInput = {
  userName: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  userID: string;
  signUpTimer: string;
};

const initSteps = [
  {
    steps: 0,
    title: "Name",
    placeholder: {
      placeholderFirstName: "First Name",
      placeholderLastName: "Last Name",
    },
    icons: <MaterialIcons name="email" size={24} color="black" />,
    next: "Next",
  },
  {
    steps: 1,
    title: "Email",
    placeholder: "Enter the email",
    icons: (
      <MaterialCommunityIcons name="account-edit" size={24} color="black" />
    ),
    buttonText: "Check mail",
  },
  {
    steps: 2,
    title: "Username",
    placeholder: "Enter the username",
    icons: <AntDesign name="idcard" size={24} color="black" />,
    buttonText: "Next",
  },
  {
    steps: 3,
    title: "Final",
    placeholder: "Check the personal information",
    buttonText: "Create Account",
  },
];

const SignupModal = ({
  isModalVisible,
  setModalVisible,
  formData,
  setFormData,
  steps,
  setSteps,
}: {
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  formData: LoginInput;
  setFormData: React.Dispatch<React.SetStateAction<LoginInput>>;
  steps: number;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [modalPasswordHide, setModalPasswordHide] = useState<boolean>(true);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const fadeCheckUsername = useRef(new Animated.Value(0)).current;
  const fadeConfirm = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { logIn } = useAuth();
  const { bottom } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isModalVisible) {
      setTimeLeft(600);
      setSteps(0);
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setModalVisible(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isModalVisible]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosInstanceRegular.post("/auth/facebook", {
        fbData: {
          userName: formData.userName,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          signUpTimer: formData.signUpTimer,
        },
      });
      if (response.status === 200 && response.data.success) {
        await SecureStore.setItemAsync(
          "Tokens",
          JSON.stringify({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          })
        );
        setModalVisible(false);
        Alert.alert("Success", "Account created successfully");
        logIn();
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  useEffect(() => {
    Animated.timing(fadeCheckUsername, {
      toValue: formData.userName.length > 0 ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [formData.userName]);

  useEffect(() => {
    Animated.timing(fadeConfirm, {
      toValue: formData.password.length > 0 ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [formData.password]);

  const fadeInStep = () => {
    fadeAnim.setValue(0);
    requestAnimationFrame(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };
  useEffect(() => {
    console.log(steps);
  }, [steps]);

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      presentationStyle="formSheet"
    >
      <View
        style={[
          styles.modalContainer,
          {
            marginBottom: bottom,
            borderBottomWidth: 1,
            borderColor: Colors.primary,
          },
        ]}
      >
        <View
          style={[
            styles.modalHeader,
            {
              height: headerHeight,
            },
          ]}
        >
          <TouchableOpacity>
            <Ionicons
              name="arrow-back"
              size={28}
              color={Colors.primary}
              onPress={() => {
                Alert.alert("Are you sure?", "You will lose all your data", [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                  },
                  {
                    text: "Yes",
                    onPress: () => setModalVisible(false),
                  },
                ]);
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            {initSteps.map((item) => {
              return (
                <View
                  key={item.steps}
                  style={{
                    alignItems: "center",
                    padding: 5,
                  }}
                >
                  <View
                    style={{
                      backgroundColor:
                        steps === item.steps ? Colors.primary : "#bebebe",
                      borderWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 25,
                      padding: 5,
                      paddingHorizontal: 10,
                      borderColor: "#bebebe",
                    }}
                  >
                    <Text style={{ color: Colors.light, fontSize: 20 }}>
                      {item.steps}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor:
                        steps === item.steps ? Colors.primary : Colors.white,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          steps === item.steps ? Colors.primary : "#bebebe",
                      }}
                    >
                      {item.title}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        {steps === 0 && (
          <View style={styles.modalInputContainer}>
            <TextInput
              style={styles.modalInput}
              value={formData.firstName}
              placeholder={
                typeof initSteps[0].placeholder === "object" &&
                "placeholderFirstName" in initSteps[0].placeholder
                  ? initSteps[0].placeholder.placeholderFirstName
                  : ""
              }
              onChangeText={(e) => {
                setFormData({ ...formData, firstName: e });
              }}
            />
            <TextInput
              style={styles.modalInput}
              value={formData.lastName}
              placeholder={
                typeof initSteps[0].placeholder === "object" &&
                "placeholderLastName" in initSteps[0].placeholder
                  ? initSteps[0].placeholder.placeholderLastName
                  : ""
              }
              onChangeText={(e) => {
                setFormData({ ...formData, lastName: e });
              }}
            />
            <View style={styles.modalButtonContainerFirst}>
              <TouchableOpacity
                style={styles.modalNextButton}
                onPress={() => {
                  setSteps(steps + 1);
                  fadeInStep();
                }}
              >
                <Text style={styles.modalButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {steps === 1 && (
          <Animated.View
            style={[styles.modalInputContainer, { opacity: fadeAnim }]}
          >
            <TextInput
              style={styles.modalInput}
              placeholder={
                typeof initSteps[1].placeholder === "string"
                  ? initSteps[1].placeholder
                  : ""
              }
              value={formData.email}
              onChangeText={(e) => {
                setFormData({ ...formData, email: e });
              }}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalNextButton}
                onPress={() => {
                  setSteps(steps - 1);
                  fadeInStep();
                }}
              >
                <Text style={styles.modalButtonText}>Preview</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalNextButton}
                onPress={() => {
                  fadeInStep();

                  setSteps(steps + 1);
                }}
              >
                <Text style={styles.modalButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
        {steps === 2 && (
          <Animated.View
            style={[styles.modalInputContainer, { opacity: fadeAnim }]}
          >
            <TextInput
              style={styles.modalInput}
              placeholder={
                typeof initSteps[2].placeholder === "string"
                  ? initSteps[2].placeholder
                  : ""
              }
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.nativeEvent.text })
              }
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalNextButton}
                onPress={() => {
                  setSteps(steps - 1);
                  fadeInStep();
                }}
              >
                <Text style={styles.modalButtonText}>Preview</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalNextButton}
                onPress={() => {
                  if (!disableButton) {
                    setSteps(steps + 1);
                    fadeInStep();
                  } else {
                    Alert.alert("Please check your username");
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
            <Animated.View
              style={{
                opacity: fadeCheckUsername,
                alignItems: "center",
                padding: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setDisableButton(false);
                }}
                style={{
                  backgroundColor: Colors.primary,
                  padding: 10,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: Colors.white, fontSize: 20 }}>
                  Check User Name
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}
        {steps === 3 && (
          <Animated.View
            style={[styles.modalInputContainer, { opacity: fadeAnim, flex: 1 }]}
          >
            <ScrollView>
              {Object.entries(formData).map(([fields, value]) => (
                <View key={fields} style={styles.modalInputContainer}>
                  <Text>{fields}</Text>
                  <TextInput value={value} style={styles.modalInput} />
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => {
                handleSubmit();
              }}
            >
              <Text>Submit</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
};

export default SignupModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "95%",
    height: "100%",
    marginHorizontal: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalInputContainer: {
    gap: 20,
    justifyContent: "center",
    flex: 1,
  },
  modalInput: {
    height: 50,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    borderRadius: 15,
    borderColor: "#bebebe",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    alignItems: "center",
  },
  modalButtonContainerFirst: {
    alignItems: "flex-end",
  },
  modalNextButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 20,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: Colors.white,
    fontSize: 20,
  },
});
