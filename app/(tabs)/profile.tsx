import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity } from "react-native";
import * as Clipboard from 'expo-clipboard';
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import ProfileData from "@/components/profileData";

export default function App() {
    const userId = "12345678"; // User ID to copy to clipboard
    const copyToClipboard = () => {
        Clipboard.setStringAsync(userId);// Copy user ID to clipboard
    };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <LinearGradient
                    colors={['#021645', '#559DDD']}
                    start={[0, 1]}
                    end={[0.4, 0]}
                    locations={[0, 0.8]}
                    style={styles.background} 
                />
                <View style={styles.titleBar}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                </View>
                <View style={styles.profileContainer}>
                    <View style={styles.nameContainer}>
                        <Text style={{color: '#fff'}}>Sainuu</Text>
                        <Text style={styles.profileName}>DASHNYAM</Text>
                        <View style={styles.userIdContainer}> 
                        <Text style={{color: Colors.dark}}>      User ID: {userId}  </Text>
                        <TouchableOpacity onPress={copyToClipboard} style={{justifyContent:"space-around" , }}>
                        <Ionicons name="copy" size={24} color="#000" />
                    </TouchableOpacity>
                    </View>
                    </View>

                    {/* Friends section */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsText}>Naiz</Text>
                            <Text style={styles.statsNumber}>1000</Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsText}>Games</Text>
                            <Text style={styles.statsNumber}>500</Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsText}>tokens</Text>
                            <Text style={styles.statsNumber}>500</Text>
                        </View>
                    </View>

                    <View>
                        <Image source={require("@/assets/images/profileIcons/profile.png")} style={styles.profileImage} />
                    </View>
                    
                    <View style={styles.dm}>
                        <MaterialIcons name="settings" size={24} color="#DFD8C8" />
                    </View>
                    <View style={styles.active}></View>
                    <View style={styles.add}>
                        <Ionicons name="add" size={30} color="#DFD8C8" style={{ marginTop: 4 }} />
                    </View>
                </View>
                
                {/* Horizontal ScrollView for Cards */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Naiz sagsnii bag</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Naiz</Text>
                            <Text style={styles.cardValue}>1000</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Naiz</Text>
                            <Text style={styles.cardValue}>1000</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Naiz</Text>
                            <Text style={styles.cardValue}>1000</Text>
                        </View>
                    </View>
                </ScrollView>
                <ProfileData></ProfileData>
                <View style={styles.card}>
                            <Text style={styles.cardTitle}>Naiz sagsnii bag</Text>
                        </View>
            </ScrollView>

            

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    scrollContainer: {
        paddingVertical: 0,
    },
    text: {
        color: "#52575D"
    },
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 40,
        marginHorizontal: 10
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        paddingHorizontal: 20
    },
    nameContainer: {
        flex: 1, 
        marginLeft: 10,
        justifyContent: 'center',
        marginBottom: 60,
        height: 100, 
        overflow: 'hidden'
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        left: 20
    },
    profileImage: {
        left: 20,
        width: 150,
        height: 150,
        borderRadius: 100,
        overflow: "hidden"
    },
    dm: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: 8,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-end",
        right: 100
    },
    active: {
        backgroundColor: "#34FFB9",
        position: "absolute",
        bottom: 10,
        padding: 4,
        height: 20,
        right: 110,
        width: 20,
        borderRadius: 10,
        borderColor: "#1aba0b",
        borderWidth: 2
    },
    add: {
        backgroundColor: "#41444B",
        position: "absolute",
        bottom: 0,
        right: 10,
        width: 40,
        height: 40,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    statsContainer: {
        position: "absolute",
        top: 110,
        left: 20,
        right: 145,
        flexDirection: "row",
        marginBottom: 20,
        justifyContent: "space-between",
        borderColor: "#fff",
        borderWidth: 0,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomWidth: 1,
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,

    },
    statsBox: {
        flex: 1,
    },
    statsText: {
        fontSize: 11,
        color: "#fff",
        textTransform: "uppercase",
        fontWeight: "500",
        left: 15,
    },
    statsNumber: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
        marginTop: 4,
        left: 15,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%'
    },
    cardContainer: {
        flexDirection: "row", // Align cards horizontally
        marginVertical: 20, // Vertical margin around the cards
    },
    card: {
        backgroundColor: "#fff", // Card background
        padding: 30, // Padding inside the card
        borderRadius: 50, // Rounded corners
        shadowColor: "#fff", // Shadow for depth
        shadowOffset: { width: 0, height: 2 }, // Shadow positioning
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 5, // Android shadow
        alignItems: "center", // Center content
        width: 110, // Set width of the card
        marginRight: 10, // Add space between cards
        left: 10,
        height: 110, // Set height of the card
        borderColor: "#0d7c85", // Border color
        borderWidth: 3, // Border width
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#888",
    },
    cardValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginTop: 5,
    },
    userIdContainer: {
        flexDirection: 'row', // Align user ID and icon horizontally
        alignItems: 'center', // Center the icon vertically with the text
    },

});
