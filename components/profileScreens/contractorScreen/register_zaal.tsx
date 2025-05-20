import Colors from "@/constants/Colors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import { TextInput } from "react-native-paper";
import MultiSelect from "react-native-multiple-select";
import { launchImageLibrary } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

type FormDataTypes = {
  zaal_types: string[];
  zaal_location: Zaal_location;
  zaal_details: Zaal_details;
  base_time_slots: string[];
  feature: Zaal_feature;
};
type Zaal_location = {
  latitude: string;
  longitude: string;
  smart_location: string;
};
type Zaal_feature = {
  changingRoom: boolean;
  shower: boolean;
  lighting: boolean;
  spectatorSeats: boolean;
  parking: boolean;
  freeWifi: boolean;
  scoreboard: boolean;
  speaker: boolean;
  microphone: boolean;
};
type Zaal_details = {
  name: string;
  price: string;
  workTime: string;
  phoneNumber: string;
  address: string;
};

type ZaalType = {
  id: number;
  name: string;
};

const zaal_type_init: ZaalType[] = [
  { id: 1, name: "Basketball" },
  { id: 2, name: "Volleyball" },
  { id: 3, name: "Football" },
  { id: 4, name: "Badminton" },
  { id: 5, name: "Table Tennis" },
  { id: 6, name: "Tennis" },
  { id: 7, name: "Wrestling" },
  { id: 8, name: "Dance Studio" },
  { id: 9, name: "Gymnastics" },
  { id: 10, name: "Yoga / Pilates" },
  { id: 11, name: "Fitness / Cardio Room" },
  { id: 12, name: "Billiards" },
];

const RegisterZaal: React.FC = () => {
  const [formData, setFormData] = useState<FormDataTypes>({
    zaal_types: [],
    zaal_location: {
      latitude: "",
      longitude: "",
      smart_location: "",
    },
    zaal_details: {
      name: "",
      price: "",
      workTime: "",
      phoneNumber: "",
      address: "",
    },
    base_time_slots: [],
    feature: {
      changingRoom: false,
      shower: false,
      lighting: false,
      spectatorSeats: false,
      parking: false,
      freeWifi: false,
      scoreboard: false,
      speaker: false,
      microphone: false,
    },
  });
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const handleSubmit = () => {
    try {
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <ScrollView
      style={{
        backgroundColor: Colors.white,
        flex: 1,
      }}
    >
      <SafeAreaView
        style={{
          height: "auto",
        }}
      >
        <View style={styles.container}>
          <View
            style={{
              width: "100%",
              maxHeight: "70%",
            }}
          >
            <MultiSelect
              hideTags
              items={zaal_type_init}
              uniqueKey={"id"}
              selectText={"Select Types"}
              searchInputPlaceholderText="Search Sports Types..."
              displayKey="name"
              onSelectedItemsChange={(selectedIds: number[]) => {
                const selectedNames = zaal_type_init
                  .filter((item) => selectedIds.includes(item.id))
                  .map((item) => item.name);

                setFormData((prev) => ({
                  ...prev,
                  zaal_types: selectedNames,
                }));
              }}
              selectedItems={zaal_type_init
                .filter((item) => formData.zaal_types.includes(item.name))
                .map((item) => item.id)}
              styleMainWrapper={{
                width: "80%",
                alignSelf: "center",
              }}
              styleDropdownMenuSubsection={{
                backgroundColor: Colors.white,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.darkGrey,
              }}
              searchInputStyle={{
                height: 40,
                fontSize: 16,
                color: Colors.darkGrey,
                backgroundColor: Colors.white,
                borderRadius: 8,
              }}
              tagRemoveIconColor="#ff4444"
              tagBorderColor="#ddd"
              tagTextColor="#555"
              selectedItemTextColor={Colors.darkGrey}
              selectedItemIconColor={Colors.primary}
              itemTextColor={Colors.darkGrey}
              submitButtonColor={Colors.primary}
              submitButtonText="Confirm"
              fixedHeight={true}
            />
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: 10,
                marginHorizontal: 20,
                width: "80%",
                alignSelf: "center",
              }}
            >
              {formData.zaal_types.map((typeName) => (
                <TouchableOpacity
                  key={typeName}
                  onPress={() =>
                    setFormData((prev) => ({
                      ...prev,
                      zaal_types: prev.zaal_types.filter(
                        (name) => name !== typeName
                      ),
                    }))
                  }
                  style={{
                    backgroundColor: Colors.primary,
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: 20,
                    marginRight: 8,
                    marginBottom: 8,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", marginRight: 6 }}>
                    {typeName}
                  </Text>
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TextInput
            style={styles.textinputs}
            mode="outlined"
            label="Name"
            theme={{
              colors: {
                primary: Colors.darkGrey,
                background: Colors.white,
              },
            }}
          />
          <TextInput style={styles.textinputs} mode="outlined" label="Price" />
          <TextInput
            style={styles.textinputs}
            mode="outlined"
            label="Work Time"
          />
          <TextInput
            style={styles.textinputs}
            mode="outlined"
            label="Phone Number"
          />
          <TextInput
            style={styles.textinputs}
            mode="outlined"
            label="Address"
          />
          <View style={{ width: "80%", backgroundColor: Colors.white }}>
            {Object.entries(formData.feature).map(([key, value], index) => (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 4,
                }}
              >
                <Text style={{ flex: 1 }}>{key}</Text>
                <Switch
                  value={value}
                  trackColor={{
                    false: Colors.darkGrey,
                    true: Colors.primary,
                  }}
                  thumbColor={value ? Colors.primary : Colors.darkGrey}
                  onValueChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      feature: {
                        ...prev.feature,
                        [key]: !prev.feature[key as keyof Zaal_feature],
                      },
                    }))
                  }
                />
              </View>
            ))}
          </View>

          <View
            style={{
              backgroundColor: Colors.white,
              minWidth: "90%",
              maxWidth: "95%",
              flexWrap: "wrap",
              flexDirection: "row",
              borderWidth: 1,
              padding: 5,
              borderColor: Colors.darkGrey,
            }}
          >
            {imageUrl.map((item, index) => (
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={{ uri: item }}
                  style={{
                    width: 80,
                    height: 100,
                    margin: 5,
                    borderRadius: 5,
                  }}
                />
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setImageUrl((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  <MaterialIcons
                    name="remove-circle-outline"
                    size={24}
                    color={"red"}
                    style={{
                      position: "absolute",
                      right: 0,
                      padding: 10,
                      top: 0,
                    }}
                  />
                </TouchableOpacity>
              </View>
            ))}
            <View
              style={{
                width: 80,
                height: 100,
                borderWidth: 1,
                alignItems: "center",
                justifyContent: "center",
                borderStyle: "dashed",
                backgroundColor: Colors.grey,
                borderRadius: 5,
                borderColor: Colors.darkGrey,
                margin: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  launchImageLibrary(
                    {
                      mediaType: "photo",
                      includeBase64: true,
                    },
                    (response) => {
                      if (response.assets && response.assets[0].uri) {
                        setImageUrl((prev) => {
                          if (response.assets && response.assets[0].uri) {
                            return [...prev, response.assets[0].uri];
                          }
                          return prev;
                        });
                      } else if (response.didCancel) {
                        console.log("user canceled");
                      } else {
                        console.warn("invalid response", response.errorCode);
                      }
                    }
                  );
                }}
              >
                <AntDesign name="plus" size={24} color={Colors.darkGrey} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                padding: 20,
                backgroundColor: Colors.primary,
                borderRadius: 10,
                marginTop: 10,
              }}
              onPress={() => handleSubmit()}
            >
              <Text style={{ color: Colors.white }}>REGISTER SPORT HALL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    gap: 10,
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  textinputs: {
    width: "80%",
    alignSelf: "center",
    height: 40,
  },
  toggleText: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
});

export default RegisterZaal;
