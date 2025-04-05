import React from 'react';
import { StyleSheet, View, Image, Dimensions, SafeAreaView, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/types';



type Page2ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'page-2'>;

export default function Page2() {
  const navigation = useNavigation<Page2ScreenNavigationProp>();
  const { width } = Dimensions.get('window');

  return (
    <SafeAreaView style={styles.safeArea}>
        {/* Logo kept from original */}
        <Image
          source={require('@/assets/images/NutriVision.png')}
          style={styles.logo}
          accessibilityRole="image"
          accessibilityLabel="NutriVision logo"
        />
        <ThemedView style={styles.container}>
        {/* Add your new page-2 content here */}
        <View style={styles.profileBox}>
                        <ThemedText style={styles.profileBoxText}>
                          Average <ThemedText style={styles.profileText}>Daily</ThemedText> Intake
                        </ThemedText>
                      </View>
          <View style={styles.rowContainer}>
      {/* Container 1 */}
      <View style={[styles.column]}>
        {<View style={styles.textRow}>
        <Text style={styles.title}>11g</Text>
        </View>
    }
        <View style={styles.textRow}>
        <Text style={styles.subtitle}>Carbohydrates</Text>
        </View>
        {/* Circular Progress with Image */}
    
      <View style={styles.textRow}> 
        <View style={styles.progressRow}>
      <View style={{ alignItems: 'flex-start' , marginTop: 5 }}>
      <AnimatedCircularProgress
        size={95}
        width={10}
        fill={20} // Percentage fill
        tintColor="#d5cd3a"
        backgroundColor="#dddddd"
      />
    </View>
  </View>
    </View>

      </View>

      {/* Container 2 */}
      <View style={[styles.column]}>
        {/* Your content */}
      </View>

      {/* Container 3 */}
      <View style={[styles.column,]}>
        {/* Your content */}
      </View>
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
    backgroundColor: '#eff1f6',
    gap: 10,
    padding: 15
  },
  // Logo style from original
  logo: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'flex-start'
  },
  // New styles for page-2
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 2,
    fontWeight: 'bold',
  },
  profileBox: {
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 7,
  },
  column: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    },
textRow: {
    alignItems: 'flex-start',
},
  progressRow: {
  },
});