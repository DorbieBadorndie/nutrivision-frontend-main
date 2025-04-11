import React from 'react';
import { StyleSheet, View, Image, Dimensions, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/types';

type Page2ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'page-2'>;

export default function Page2() {
  const navigation = useNavigation<Page2ScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.container}>
        {/* Logo kept from original */}
        <Image
          source={require('@/assets/images/NutriVision.png')}
          style={styles.logo}
          accessibilityRole="image"
          accessibilityLabel="NutriVision logo"
        />
        
        {/* Add your new page-2 content here */}
        <View style={styles.profileBox}>
                        <ThemedText style={styles.profileBoxText}>
                          Average <ThemedText style={styles.profileText}>Daily</ThemedText> Intake
                        </ThemedText>
                      </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eff1f6',
  },
  container: {
    flex: 1,
    backgroundColor: '#eff1f6'
  },
  // Logo style from original
  logo: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
  },
  // New styles for page-2
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  profileBox: {
    marginTop: 15,
    marginLeft: 10,
    width: 150,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  profileBoxText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  profileText: {
    fontSize: 12,
    color: '#9AB206',
  },
});