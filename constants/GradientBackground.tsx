// GradientBackground.tsx
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
  style?: ViewStyle; // Optional style prop for additional styling
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ style }) => {
  return (
    <LinearGradient
      colors={['#000046', '#EB5757', '#1CB5E0', 'transparent']} // Gradient colors
      start={[0, 0]} // Gradient starts from the top-left corner
      end={[1, 1]} // Gradient ends at the bottom-right corner
      locations={[0, 0.3, 0.6, 1]} // Adjust the position of each color
      style={[styles.background, style]} // Merge passed style with default style
    />
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%', // Make it full height to cover the area needed
  },
});

export default GradientBackground;