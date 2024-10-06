import React, { useRef, useState } from "react";
import { StatusBar, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient'; 

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
      <StatusBar barStyle="light-content" backgroundColor="#2a85d5" />
      <View style={styles.container}>
        <LinearGradient
          colors={['#2a85d5', '#559DDD']}
          start={[0, 0]}
          end={[0, 1]}
          locations={[0, 0.4]}
          style={styles.background} 
        />
        <View style={styles.content}>
          <View style={styles.actionRow}>
            <Link href={`/(modals)/sags`} asChild>
              <TouchableOpacity style={styles.searchbtn}>
                <Image
                  source={require("../assets/images/ranking.png")}
                  style={{ width: 26, height: 26 }}
                />
              </TouchableOpacity>
            </Link>
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
                    style={{ width: 26, height: 26 }}
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
    height: 150,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden', // Ensures the gradient does not overflow outside the container
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%', // Ensure gradient covers full height
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
    gap: 25,
  },
  filterButton: {
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  searchbtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
  },
  titleContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: '#000',
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
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ExploreHeader;
