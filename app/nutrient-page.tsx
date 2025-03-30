import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from 'expo-router';
import { RootStackParamList } from '@/types/types';
import { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Index'>;

export default function UserNutrientPage() {
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // ✅ Fallback while loading fonts
  }

  // ======== NAVIGATION ========
  const navigation = useNavigation() as HomeScreenNavigationProp;

  const handleCheck = () => {
    navigation.navigate('camera'); // ✅ Ensure 'Camera' exists in stack
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/NutriVision.png')} style={styles.logo} />
      <View style={styles.userIntakeCard}>
        <Text style={styles.userText}>User</Text>
        <Text style={styles.intakeText}> Intake</Text>
      </View>
      {/* Floating check button */}
      <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
        <ThemedText style={styles.checkMark}>✓</ThemedText>
      </TouchableOpacity>
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
    position: 'absolute',
    top: -5 * (height * 0.01),
    left: width * 0.02,
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  userIntakeCard: {
    position: 'absolute',
    top: height * 0.02 + 80,
    left: width * 0.06,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: 'row',
  },
  userText: {
    color: '#9AB206',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono-Regular',
  },
  intakeText: {
    color: '#4D4444',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono-Regular',
  },
  checkButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    fontSize: 25,
    color: '#9AB206', // ✅ Ensured consistent color
    fontWeight: 'bold',
  },
});
