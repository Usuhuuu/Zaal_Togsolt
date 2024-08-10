import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { Link } from 'expo-router';

interface Props {
  listings: any[];
  category: string;
}

const Listing = ({ listings, category }: Props) => {
  useEffect(() => {
    console.log(`Reload Listing`);
  }, [category]);

  return (
    <View style={styles.container}>
      <Link href={`/(modals)/login`} style={styles.link}>Login</Link>
      <Link href={`/(modals)/signup`} style={styles.link}>Signup</Link>
      <Text style={styles.text}>Listing</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100, // Adjust based on the height of your ExploreHeader
    paddingHorizontal: 16, // Optional: adjust padding as needed
  },
  link: {
    marginBottom: 10, // Optional: space between links
    fontSize: 18,
    color: 'blue', // Or your desired color
  },
  text: {
    fontSize: 24,
  },
});

export default Listing;
