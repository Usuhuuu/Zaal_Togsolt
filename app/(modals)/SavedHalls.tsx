import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useSavedHalls } from "@/app/(modals)/functions/savedhalls"; // Import the hook to access the context
import { Hall } from "@/app/(modals)/functions/savedhalls"; // Ensure this path is correct

const SavedHalls: React.FC = () => {
  const { savedHalls, removeHall } = useSavedHalls(); // Destructure savedHalls and removeHall from the context

  // Debugging: Log savedHalls data to ensure it's being populated
  useEffect(() => {
    console.log("Saved Halls:", savedHalls);
  }, [savedHalls]);

  // Debugging: Ensure that the Hall objects have correct structure
  useEffect(() => {
    if (savedHalls.length > 0) {
      console.log("First Hall object:", savedHalls[0]);
    }
  }, [savedHalls]);

  const renderItem = ({ item }: { item: Hall }) => (
    <View style={styles.hallItem}>
      <Text style={styles.hallName}>{item.name}</Text>
      <TouchableOpacity onPress={() => removeHall(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.modalContent}>
      <Text style={styles.header}>Saved Halls</Text>
      {savedHalls.length === 0 ? (
        <Text>No halls saved!</Text>
      ) : (
        <FlatList
          data={savedHalls}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()} // Ensure id is a string for the keyExtractor
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hallItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
  },
  hallName: {
    flex: 1,
    fontSize: 18,
  },
  removeButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SavedHalls;
