import { View, StyleSheet } from 'react-native';
import React, { useMemo, useState } from 'react';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import ListingsMap from '@/components/ListingsMap';
import listingsDataGeo from '@/assets/Data/airbnb-listings.geo (1).json'; // Ensure the filename is correct
import { ListingGeo } from '@/interfaces/listingGeo';
import ListingBottomSheet from '@/components/ListingBottomSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import the root view component

interface FeatureCollection {
  type: 'FeatureCollection';
  features: ListingGeo[];
}

const Page = () => {
  // Load data
  const listingsData = require('@/assets/Data/airbnb-listings.json');

  // State management for category
  const [category, setCategory] = useState<string>('Sags');

  // Memoized items
  const items = useMemo(() => (listingsData as any[]), []);
  // Category change handler
  const onDataChanged = (category: string) => {
    console.log(`CHANGED_`, category);
    setCategory(category);
  };

  return (
    <GestureHandlerRootView style={styles.container}> 
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      {/*<Listing listings={items} category={category} />*/}
      <ListingsMap listings={listingsDataGeo as FeatureCollection} />
      <ListingBottomSheet listing={items} category={category} />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
});

export default Page;
