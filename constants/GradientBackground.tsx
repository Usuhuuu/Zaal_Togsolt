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
      colors={['#61b3fa','#fff']} // Gradient colors
      start={[0, 0]} // Gradient starts from the top-left corner
      end={[0, 1.2]} // Gradient ends at the bottom-right corner // Adjust the position of each color
      style={[styles.background]} // Merge passed style with default style
    />
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%', // Ensure gradient covers full height
  },
});

export default GradientBackground;