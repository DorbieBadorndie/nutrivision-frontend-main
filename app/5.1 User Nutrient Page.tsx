import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/NutriVision.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 0,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
