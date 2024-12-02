import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router"; // To read query parameters
import Colors from "@/constants/Colors"; // Import your colors

const ReviewUpdateScreen = () => {
  const { reviews, rating } = useLocalSearchParams(); // Destructure the reviews and rating from the query params
  const [loading, setLoading] = useState(false);
  const [ratingState, setRating] = useState(Math.floor((parseInt(Array.isArray(rating) ? rating[0] : rating) || 0) / 20)); // Parse the rating and convert it to a value from 1 to 5

  useEffect(() => {
    // Here, you can handle any logic you need with the reviews and rating
    console.log("Reviews:", reviews); // Number of reviews
    console.log("Rating:", rating); // Rating score
  }, [reviews, rating]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, alignItems: "center" }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Text style={styles.label}>Unelgee</Text>
            <Text style={styles.reviewText}>{ratingState}</Text>

            <View style={styles.ratingRow}>
           {[1, 2, 3, 4, 5].map((star) => (
          <Text
          key={star}
          style={{
          fontSize: 30,
          color: star <= ratingState ? "" : "#ccc", // Display gold for selected rating, gray for others
          }}
         >
         ★
        </Text>
         ))}
        </View>
            
            {/* Display Reviews */}
            <Text>Niit: {reviews} unelgee baina</Text>
          </>
        )}


        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#333",
    textTransform: "uppercase",
  },
  reviewText: {
    fontSize: 80,
    marginBottom: 10,
    color: Colors.primary, // Replace with your desired color or import Colors
  },
  ratingRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    gap: 5,
  },
});

export default ReviewUpdateScreen;
