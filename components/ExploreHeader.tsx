import React, { useRef, useState } from "react";
import { StatusBar, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient'; 
import Colors from "@/constants/Colors";

const categories = [
  { name: 'Sags', source: require("../assets/sport-icons/basketball.png") },
  { name: 'Volley-ball', source: require("../assets/sport-icons/volleyball.png") },
  { name: 'Hol-Bombog', source: require("../assets/sport-icons/football.png") },
  { name: 'Tennis', source: require("../assets/sport-icons/table-tennis.png") },
  { name: 'Bowling', source: require("../assets/sport-icons/lanes.png") },
  { name: 'Golf', source: require("../assets/sport-icons/golf.png") },
];

interface Props {
  onCategoryChanged: (category: string) => void;
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<(typeof TouchableOpacity | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);

    if (selected) {
      (selected as unknown as View).measure((_fx, fy, width, height, px, py) => {
        scrollRef.current?.scrollTo({ x: px - 16, animated: true });
      });
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#61b3fa" />
      <View style={styles.container}>
        <LinearGradient
          colors={['#61b3fa', '#fff']}
          start={[0, 0]}
          end={[0, 1.2]}
          locations={[0, 1]}
          style={styles.background} 
        />
        <View style={styles.content}>
          <View style={styles.actionRow}>
            <Link href={`/(modals)/sags`} asChild>
              <TouchableOpacity style={styles.searchbtn}>
                <Image
                  source={require("../assets/sport-icons/notifications.png")}
                  style={{ width: 23, height: 23 }}
                />
              </TouchableOpacity>
            </Link>
            <View style={styles.titleContainer}>
              <Image
                source={require("../assets/sport-icons/logo.png")}
                style={{ width: 70, height: 70 }}
              />
              <Text style={{fontSize:18 , right:20}}>Sags</Text>
            </View>

            <TouchableOpacity style={styles.filterButton}>
              <Image
                source={require("../assets/images/category.png")}
                style={{ width: 20, height: 20 }}
              />
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
                  <Image
                    source={item.source}
                    style={{ width: 20, height: 20 }}
                  />
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
    height: 140,
    overflow: 'hidden', 
    // Ensures the gradient does not overflow outside the container
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '40%', // Ensure gradient covers full height
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
  },
  filterButton: {
    padding: 10,
  },
  searchbtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  titleContainer: {
    height: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleText: {
    color: '#000',
    fontWeight: 'condensed',
  },
  scrollViewContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
  },
  categoriesBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 6,
  },
  categoriesBtnActive: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    backgroundColor: Colors.primary, // Replace with the actual color value
    borderRadius: 8,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 30,
    marginBottom: 5,
  },
});

export default ExploreHeader;
