import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'; // Import the Text component
import React, { useMemo, useRef, useState } from 'react';
import Listings from '@/components/Listing';
import BottomSheet from '@gorhom/bottom-sheet'; // Ensure this is the correct import
import { Listing } from '@/interfaces/listing';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface ListingBottomSheetProps {
  listing: Listing[];
  category: string;
}
const ListingBottomSheet = ({ listing, category }: ListingBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null); // Correctly type the ref

  const [refresh ,setrefresh] = useState<number>(0);

  const showMap = ()=>{
    bottomSheetRef.current?.collapse();
    setrefresh(refresh + 1);
}

  const snapPoints = useMemo(() => ['9%', '90%'], []);

  return (
    <BottomSheet 
    ref={bottomSheetRef} 
    snapPoints={snapPoints}
     handleIndicatorStyle={{
      backgroundColor: Colors.primary, // Change color
        width: 60,                         
        borderRadius: 2,

    }}
        style={styles.sheetContainer}>
      <View style={styles.contentContainer}>
        <Listings listings={listing} category={category} refresh={refresh}/>
        <View style={styles.absoluteBtn}>
            <TouchableOpacity onPress={showMap} style={styles.btn}>
                <Text style={styles.btnText}>Map</Text>
                <Ionicons name="map" size={20} color="white" />
            </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  absoluteBtn: {
    bottom: 50,
    width: '100%',
    alignItems: 'center',   
  },
  btn:{
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,

  },
  btnText:{
    color: '#fff',
  },
  sheetContainer: {
    borderTopLeftRadius: 0, // Updated radius
    borderTopRightRadius: 0, // Updated radius
    backgroundColor: "black",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
});

export default ListingBottomSheet;
