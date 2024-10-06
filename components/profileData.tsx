import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { PieChart } from 'react-native-chart-kit'; // Using PieChart for Doughnut representation
import Colors from '@/constants/Colors';

const categories = [
  { name: 'Basketball', source: require("../assets/sport-icons/basketball.png"), details: {name: '' , timesPlayed: 5, goal: 10 } },
  { name: 'Volleyball', source: require("../assets/sport-icons/volleyball.png"), details: { timesPlayed: 8, goal: 15 } },
  { name: 'Football', source: require("../assets/sport-icons/football.png"), details: { timesPlayed: 12, goal: 20 } },
  { name: 'Tennis', source: require("../assets/sport-icons/table-tennis.png"), details: { timesPlayed: 3, goal: 5 } },
  { name: 'Bowling', source: require("../assets/sport-icons/lanes.png"), details: { timesPlayed: 6, goal: 10 } },
  { name: 'Golf', source: require("../assets/sport-icons/golf.png"), details: { timesPlayed: 9, goal: 15 } },
];

const ProfileData = () => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<(TouchableOpacity | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<null | { timesPlayed: number, goal: number }>(null);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    setSelectedDetails(categories[index].details);

    if (selected) {
      (selected as unknown as View).measure((_fx, fy, width, height, px, py) => {
        scrollRef.current?.scrollTo({ x: px - 16, animated: true });
      });
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const doughnutData = [
    {
      population: selectedDetails ? selectedDetails.timesPlayed : 0,
      color: Colors.primary, // Green for times played
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      population: selectedDetails ? selectedDetails.goal - (selectedDetails.timesPlayed || 0) : 0,
      color: '#ffffff', // Red for remaining goal
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];
 
  

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#e5f0ff', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />
      <View style={styles.header}>
        <Text style={styles.activityTitle}>minii amjilt </Text>
        <View style={styles.goalContainer}>
          <Text style={styles.goalText}></Text>
        </View>
      </View>
      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            ref={(el) => (itemsRef.current[index] = el)}
            style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
            onPress={() => selectCategory(index)}
          >
            <View style={styles.iconContainer}>
              <Image source={item.source} style={{ width: 26, height: 26 }} />
            </View>
            <Text style={styles.titleText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Show the selected category details */}
      {selectedDetails && (
        <View style={styles.detailsContainer}>
          <View style={styles.chartContainer}>
          <PieChart
            data={doughnutData}
            width={150}
            height={150}
            chartConfig={{
              color: (opacity = 1) => `rgba(35, 34, 34, ${opacity})`,
              style: {
                borderRadius: 1,
              },
              decimalPlaces: 0, // Optional
            }}

            backgroundColor="transparent"
            paddingLeft="25"
            style={styles.chart}
            accessor="population"
            hasLegend={false} // Disable the legend to remove labels
            absolute={false} // Disable absolute numbers inside chart
          />
          
          </View>
             <View style={styles.centerOverlay}>
                <Text style={styles.centerText}> {selectedDetails.timesPlayed} / {selectedDetails.goal}</Text>
          </View>
          <View style={styles.chartLegend}>
            {doughnutData.map((data) => (
            <View key={data.name} style={styles.legendItem}>
            <View style={[styles.legendColorBox, { backgroundColor: data.color }]} />
            <Text>{data.name}</Text>
            </View>
           ))}
          </View>    
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    margin: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 20,
  },
  goalContainer: {
    backgroundColor: '#ff6392',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoriesBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  categoriesBtnActive: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#facad9',
    borderRadius: 10,
  },
  iconContainer: {
    marginBottom: 5,
  },
  titleText: {
    fontSize: 14,
    color: '#333',
  },
  detailsContainer: {
    padding: 5,
    borderRadius: 10,

  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'space-between',
    flexDirection: 'row',
    
  },
  chart: {
    marginTop: 10,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColorBox: {
    width: 10,
    height: 15,
    marginRight: 5,
  },
  centerOverlay: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,  // Make it a circle
    backgroundColor: 'white',  // Simulate a hole by overlaying white circle
    justifyContent: 'center',
    alignItems: 'center',
    top: 40,
    left: 18,
  },
  centerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',  // Color matching the main donut part
  },
});

export default ProfileData;
