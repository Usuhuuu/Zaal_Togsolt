import React, { useRef, useState } from "react";
import { StatusBar, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import Colors from "@/constants/Colors";

const categories = [
  { name: 'Sags', icon: 'basketball-ball' },
  { name: 'Volley-ball', icon: 'volleyball-ball' },
  { name: 'Hol-Bombog', icon: 'futbol' },
  { name: 'Tennis', icon: 'table-tennis' },
  { name: 'Bowling', icon: 'bowling-ball' },
  { name: 'Golf', icon: 'golf-ball' },
];

interface Props {
  onCategoryChanged: (category: string) => void;
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);

    selected?.measure((fx, fy, width, height, px, py) => {
      if (scrollRef.current) {
        scrollRef.current?.scrollTo({ x: px - 16, animated: true });
      }
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#EB5757"
        translucent // Make StatusBar background transparent
      />
      <View style={styles.container}>
        {/* LinearGradient background */}
        <LinearGradient
          colors={['#003973',`#EB5757`,`#004E92`]} // Gradient colors
          start={[0,0]} // Gradient starts from the top-left corner
          end={[0,1]} // Gradient ends at the bottom-right corner
          locations={[0, 0.3, 0.6, 1]} // Adjust the position of each color
          style={styles.background} 
        />
        <View style={styles.content}>
          <View style={styles.actionRow}>
            <Link href={`/(modals)/sags`} asChild>
              <TouchableOpacity style={styles.searchbtn}>
                <Ionicons name="search" size={24} />
              </TouchableOpacity>
            </Link>

            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="menu" size={22} color= "#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                ref={(el) => (itemsRef.current[index] = el)}
                style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
                onPress={() => selectCategory(index)}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome5 size={24} name={item.icon as any} color={activeIndex === index ? Colors.primary : Colors.dark} />
                </View>
                <Text style={styles.titleText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden', // Ensures the gradient does not overflow outside the container
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    gap: 25,
  },
  filterButton: {
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  searchbtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 45,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderColor: 'black',
    borderWidth: 1,
  },
  titleContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollViewContent: {
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 16,
  },
  categoriesBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 6,
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
    borderBottomColor: '#000',
    borderBottomWidth: 3,
  },
  iconContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 24,
  },
});

export default ExploreHeader;

//The ExploreHeader component is a custom header that displays a list of categories. When a category is selected, the active category is highlighted with a border at the bottom of the category button. The component also includes a search button and a filter button.
